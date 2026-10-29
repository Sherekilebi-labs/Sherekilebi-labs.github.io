import { readFile, readdir, access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const readJSON = async file => JSON.parse(await readFile(path.join(root, file), 'utf8'));
const lab = await readJSON('src/data/lab.json');
const excerpts = await readJSON('src/data/generated/excerpts.json');
const posts = await Promise.all((await readdir(path.join(root, 'content/news'))).filter(file => file.endsWith('.json')).map(file => readJSON(`content/news/${file}`)));
const requireValue = (condition, message) => { if (!condition) throw new Error(message); };
const unique = (values, label) => requireValue(new Set(values).size === values.length, `Duplicate ${label}`);
unique(lab.projects.map(p => p.id), 'project ID');
unique(lab.people.map(p => p.id), 'person ID');
unique(posts.map(p => p.id), 'dispatch ID');
unique(posts.map(p => p.slug), 'dispatch slug');
const people = new Set(lab.people.map(p => p.id));
const projects = new Set(lab.projects.map(p => p.id));
const checkURL = url => requireValue(new URL(url).protocol === 'https:', `Expected HTTPS link: ${url}`);
const checkMedia = async src => {
  if (src.startsWith('https://')) return checkURL(src);
  requireValue(/^media\/[a-zA-Z0-9/_-]+\.(png|svg|webp|jpe?g|gif|mp4|webm)$/.test(src), `Invalid media path: ${src}`);
  await access(path.join(root, 'public', src));
};
for (const project of lab.projects) {
  for (const field of ['id', 'title', 'folder', 'category', 'status']) requireValue(project[field]?.trim(), `${project.id}: missing ${field}`);
  const summaryLines = Array.isArray(project.summary) ? project.summary : [project.summary];
  requireValue(summaryLines.length && summaryLines.every(line => typeof line === 'string' && line.trim()), `${project.id}: summary must contain non-empty text`);
  requireValue(typeof project.introduction === 'string' && project.introduction.trim(), `${project.id}: introduction must contain non-empty text`);
  for (const field of ['cardSummary', 'currentState']) {
    if (project[field] !== undefined) requireValue(typeof project[field] === 'string' && project[field].trim(), `${project.id}: invalid ${field}`);
  }
  for (const topic of project.engineeringTopics || []) {
    requireValue(topic.title?.trim() && topic.body?.trim(), `${project.id}: empty engineering topic`);
  }
  for (const result of project.results || []) {
    for (const field of ['title', 'method', 'finding', 'limitations']) requireValue(typeof result[field] === 'string' && result[field].trim(), `${project.id}: result missing ${field}`);
  }
  requireValue(project.nextSteps === undefined || (Array.isArray(project.nextSteps) && project.nextSteps.every(step => typeof step === 'string' && step.trim())), `${project.id}: invalid next steps`);
  requireValue(['cyan','orange','green'].includes(project.accent), `Invalid accent: ${project.id}`);
  requireValue(['arm','sumo','hydrofoil','pcb','education','racer','door','spoiler','scale'].includes(project.media.diagram), `Invalid diagram: ${project.id}`);
  requireValue(project.media.alt?.trim() && (project.media.caption === undefined || typeof project.media.caption === 'string'), `Invalid media description: ${project.id}`);
  requireValue(!project.contributorIds.some(id => !people.has(id)), `Unknown contributor: ${project.id}`);
  if (project.sourceUrl) checkURL(project.sourceUrl);
  for (const link of project.sourceLinks || []) checkURL(link.url);
  for (const src of [project.media.src, project.icon].filter(Boolean)) await checkMedia(src);
  if (project.media.model) {
    const { src, alt } = project.media.model;
    requireValue(/^media\/models\/[a-z0-9-]+\.glb$/.test(src), `Invalid model path: ${project.id}`);
    requireValue(alt?.trim() && project.media.src, `Model needs alternative text and a poster: ${project.id}`);
    const data = await readFile(path.join(root, 'public', src));
    requireValue(data.length >= 20 && data.toString('ascii', 0, 4) === 'glTF' && data.readUInt32LE(4) === 2 && data.readUInt32LE(8) === data.length, `Invalid GLB: ${project.id}`);
    const scene = JSON.parse(data.toString('utf8', 20, 20 + data.readUInt32LE(12)));
    requireValue(scene.meshes?.length > 0, `Model has no meshes: ${project.id}`);
    requireValue(![...(scene.buffers || []), ...(scene.images || [])].some(asset => asset.uri && !asset.uri.startsWith('data:')), `GLB must embed its resources: ${project.id}`);
  }
  if (project.media.turntable) {
    const frames = project.media.turntable.frames;
    requireValue(Array.isArray(frames) && frames.length === 6 && new Set(frames).size === 6, `Turntable needs six distinct frames: ${project.id}`);
    for (const frame of frames) await checkMedia(frame);
  }
  if (project.logo) {
    requireValue(project.logo.alt?.trim(), `Missing logo description: ${project.id}`);
    await checkMedia(project.logo.src);
  }
  if (project.introductionImage) {
    requireValue(project.introductionImage.alt?.trim() && project.introductionImage.caption?.trim(), `Missing introduction image description: ${project.id}`);
    await checkMedia(project.introductionImage.src);
  }
  for (const image of project.gallery || []) {
    requireValue(image.alt && image.caption, `Missing gallery description: ${project.id}`);
    await checkMedia(image.src);
  }
  for (const frame of [project.simulation?.animation, ...(project.simulation?.frames || [])].filter(Boolean)) {
    requireValue(frame.alt?.trim() && frame.caption?.trim(), `Missing simulation frame description: ${project.id}`);
    await checkMedia(frame.src);
  }
  for (const figure of project.analysisFigures || []) {
    requireValue(figure.alt?.trim() && figure.caption?.trim(), `Missing analysis figure description: ${project.id}`);
    await checkMedia(figure.src);
  }
}
for (const link of [...lab.links,...lab.people.flatMap(p => p.links)]) checkURL(link.url);
for (const post of posts) {
  requireValue(/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(post.slug), `Invalid dispatch slug: ${post.id}`);
  requireValue(/^\d{4}-\d{2}-\d{2}$/.test(post.date) && new Date(post.date).toISOString().slice(0,10) === post.date, `Invalid date: ${post.id}`);
  requireValue(Array.isArray(post.authors) && post.authors.length > 0 && post.authors.every(author => people.has(author)), `Unknown dispatch author: ${post.id}`);
  requireValue(['project-update','lab-news','shenanigans'].includes(post.category), `Invalid dispatch category: ${post.id}`);
  requireValue(!post.relatedProject || projects.has(post.relatedProject), `Unknown related project: ${post.id}`);
  requireValue(post.title?.trim() && post.summary?.trim(), `Missing dispatch copy: ${post.id}`);
  requireValue(Array.isArray(post.tags) && post.tags.every(tag => typeof tag === 'string'), `Invalid tags: ${post.id}`);
  requireValue(post.pinned === undefined || typeof post.pinned === 'boolean', `Invalid pinned flag: ${post.id}`);
  requireValue(post.content === undefined || typeof post.content === 'string', `Invalid Markdown: ${post.id}`);
  requireValue(!post.mediaType || ['image','video'].includes(post.mediaType), `Invalid media type: ${post.id}`);
  if (post.media) { requireValue(post.mediaAlt?.trim(), `Missing media alt text: ${post.id}`); await checkMedia(post.media); }
  for (const match of (post.content || '').matchAll(/!\[[^\]]*\]\(([^)\s]+)\)/g)) await checkMedia(match[1].replace(/^\//,''));
}
requireValue(!excerpts.some(excerpt => !projects.has(excerpt.projectId)), 'Orphan documentation excerpt');
const icon = await readFile(path.join(root,'public/tsatmfreni.svg'),'utf8');
requireValue(icon.includes('<path') && !/<image|data:image/.test(icon), 'The emblem must contain actual vector paths');
console.log(`Content valid: ${lab.projects.length} projects, ${lab.people.length} peers, ${posts.length} dispatches, vector emblem verified.`);
