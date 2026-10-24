import { readdir, readFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { publicAssets } from './public-assets.mjs';
const root = fileURLToPath(new URL('../', import.meta.url));
const dist = path.join(root,'dist');
const lab = JSON.parse(await readFile(path.join(root,'src/data/lab.json'),'utf8'));
async function walk(directory, prefix='') {
  const files=[];
  for (const entry of await readdir(path.join(directory,prefix),{withFileTypes:true})) {
    const name=path.join(prefix,entry.name);
    files.push(...entry.isDirectory() ? await walk(directory,name) : [name]);
  }
  return files;
}
const allowed=new Set(['index.html','news/index.html',...lab.projects.map(project=>`projects/${project.id}/index.html`),...await publicAssets()]);
const files=await walk(dist);
for (const file of files) {
  if (!allowed.has(file) && !/^assets\/[\w.-]+\.(js|css|woff2?)$/.test(file)) throw new Error(`Unexpected build file: ${file}`);
  if (/\.(html|js|css)$/.test(file)) {
    const text=await readFile(path.join(dist,file),'utf8');
    if (/\/Users\/|\/private\/|@fs\/|client_secret|AeroDHS_ESP32|password123/.test(text)) throw new Error(`Local or private content in ${file}`);
    if (/Research & build domains|Three ways to explore|Actuator A0|RoBook|AeroDHS|aerodhs|FIG\. 01 — MOTION, BY DESIGN/.test(text)) throw new Error(`Removed site content remains in ${file}`);
  }
}
for (const file of allowed) await stat(path.join(dist,file));
const total=(await Promise.all(files.map(async file=>(await stat(path.join(dist,file))).size))).reduce((a,b)=>a+b,0);
console.log(`Standalone output verified: ${files.length} reviewed files, ${(total/1024/1024).toFixed(2)} MB; static news and project entry pages included.`);
