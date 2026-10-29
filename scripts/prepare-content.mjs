import { readFile, writeFile, mkdir, realpath, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import os from 'node:os';

const site = fileURLToPath(new URL('../', import.meta.url));
const workspace = await realpath(path.resolve(site, '..'));
const config = JSON.parse(await readFile(path.join(site, 'content.sources.json'), 'utf8'));
const lab = JSON.parse(await readFile(path.join(site, 'src/data/lab.json'), 'utf8'));
const check = process.argv.includes('--check');
const roots = {
  workspace,
  platformio: path.resolve(process.env.PLATFORMIO_PROJECTS || path.join(os.homedir(), 'Documents/PlatformIO/Projects')),
  platformio2026: path.resolve(process.env.PLATFORMIO_2026_PROJECTS || path.join(os.homedir(), 'program files/PlatformIO/Projects')),
};

async function sourceFile(relative, rootName = 'workspace') {
  if (path.isAbsolute(relative) || relative.split(/[\\/]/).includes('..')) throw new Error(`Unsafe source path: ${relative}`);
  const root = await realpath(roots[rootName]);
  const resolved = await realpath(path.join(root, relative));
  if (!resolved.startsWith(root + path.sep)) throw new Error(`Source escapes its root: ${relative}`);
  if (/secrets\.(?!example\.)|\.env(?:\.|$)/i.test(relative)) throw new Error('Private configuration cannot be imported');
  return readFile(resolved);
}

async function output(relative, bytes) {
  const destination = path.resolve(site, relative);
  if (!destination.startsWith(site)) throw new Error('Output must remain inside website/');
  if (check) {
    const current = await readFile(destination).catch(() => Buffer.alloc(0));
    if (!current.equals(Buffer.from(bytes))) throw new Error(`Content is stale: ${relative}. Run npm run content:sync.`);
  } else {
    await mkdir(path.dirname(destination), { recursive: true });
    await writeFile(destination, bytes);
  }
}

for (const project of lab.projects) {
  const root = await realpath(roots[project.sourceRoot || 'workspace']);
  const resolved = await realpath(path.resolve(root, project.folder));
  if (!resolved.startsWith(root + path.sep) || !(await stat(resolved)).isDirectory()) throw new Error(`Invalid project folder: ${project.folder}`);
}

const excerpts = [];
for (const document of config.documents) {
  const project = lab.projects.find(project => project.id === document.projectId);
  if (!project || !document.path.startsWith(`${project.folder}/`)) throw new Error(`Mismatched document: ${document.path}`);
  const markdown = (await sourceFile(document.path, document.root)).toString('utf8');
  let text;
  if (document.start) {
    const start = markdown.indexOf(document.start);
    const end = markdown.indexOf(document.end, start + document.start.length);
    if (start < 0 || end < 0) throw new Error(`Code markers missing: ${document.path}`);
    text = markdown.slice(start, end).trim();
  } else {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  const start = lines.findIndex(line => /^#{1,6}\s/.test(line) && line.replace(/^#+\s+/, '').trim() === document.heading);
  if (start < 0) throw new Error(`Heading missing in ${document.path}: ${document.heading}`);
  let end = start + 1;
  while (end < lines.length && !/^#{1,6}\s/.test(lines[end])) end++;
  text = lines.slice(start + 1, end).join('\n').trim();
  }
  if (!text || text.length > 4500) throw new Error(`Review excerpt size for ${document.path}`);
  if (/password|client.secret|access.token|private.key|BEGIN .*PRIVATE/i.test(text)) throw new Error(`Review potentially sensitive excerpt: ${document.path}`);
  excerpts.push({ projectId: document.projectId, source: document.path, heading: document.heading, text });
}
await output('src/data/generated/excerpts.json', JSON.stringify(excerpts, null, 2) + '\n');

for (const asset of config.assets) {
  if (!/^media\/[a-z0-9-]+\.(png|svg|webp|jpg)$/.test(asset.destination)) throw new Error(`Invalid asset destination: ${asset.destination}`);
  await output(`public/${asset.destination}`, await sourceFile(asset.path, asset.root));
}
console.log(`${check ? 'Verified' : 'Prepared'} ${excerpts.length} selected documentation excerpts and ${config.assets.length} repository assets.`);
