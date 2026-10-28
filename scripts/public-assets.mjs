import { readFile, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
/** Only reviewed, referenced assets ship; the original media folder stays local. */
export async function publicAssets() {
  const lab = JSON.parse(await readFile(path.join(root, 'src/data/lab.json'), 'utf8'));
  const files = new Set(['Sherekilebi logo.png', 'tsatmfreni.svg', 'licenses/jetbrains-mono-OFL.txt', 'licenses/georgia-flag-source.txt', 'media/georgia-flag.svg']);
  const add = source => { if (source && !source.startsWith('https://')) files.add(source.replace(/^\/+/, '')); };
  for (const project of lab.projects) {
    add(project.icon); add(project.media.src);
    add(project.logo?.src); add(project.introductionImage?.src);
    for (const image of project.gallery || []) add(image.src);
    for (const figure of project.analysisFigures || []) add(figure.src);
    for (const frame of project.simulation?.frames || []) add(frame.src);
  }
  for (const name of await readdir(path.join(root, 'content/news'))) {
    if (!name.endsWith('.json')) continue;
    const post = JSON.parse(await readFile(path.join(root, 'content/news', name), 'utf8'));
    add(post.media);
    for (const match of (post.content || '').matchAll(/!\[[^\]]*\]\((\/?media\/[^)\s]+)\)/g)) add(match[1]);
  }
  for (const file of files) if (path.isAbsolute(file) || file.split('/').includes('..')) throw new Error('Unsafe public asset path');
  return [...files];
}
