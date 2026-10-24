import { readFile, writeFile } from 'node:fs/promises';
import { publicAssets } from './public-assets.mjs';

// Keep original, unused media local even when someone runs `git add .`.
const target = new URL('../.gitignore', import.meta.url);
const start = '# BEGIN REVIEWED PUBLIC ASSETS (npm run assets:sync)';
const end = '# END REVIEWED PUBLIC ASSETS';
const before = await readFile(target, 'utf8');
if (!before.includes(start) || !before.includes(end)) throw new Error('Missing asset ignore markers');
const assets = (await publicAssets()).sort();
const rules = [start, '/public/**', '!/public/**/', ...assets.map(file => `!/public/${file}`), end].join('\n');
await writeFile(target, before.replace(new RegExp(`${start.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[\\s\\S]*?${end}`), rules));
console.log(`Git allowlist updated: ${assets.length} referenced public assets.`);
