import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';
import { readFile, mkdir, copyFile } from 'node:fs/promises';
import path from 'node:path';
import { publicAssets } from './scripts/public-assets.mjs';
import lab from './src/data/lab.json' with { type: 'json' };

export default defineConfig({
  base: '/',
  plugins: [{
    name: 'reviewed-public-assets-and-static-routes',
    async generateBundle() {
      for (const file of await publicAssets()) this.emitFile({ type: 'asset', fileName: file, source: await readFile(fileURLToPath(new URL(`./public/${file}`, import.meta.url))) });
    },
    async closeBundle() {
      const dist = fileURLToPath(new URL('./dist/', import.meta.url));
      for (const route of ['news', ...lab.projects.map(project => `projects/${project.id}`)]) {
        await mkdir(path.join(dist, route), { recursive: true });
        await copyFile(path.join(dist, 'index.html'), path.join(dist, route, 'index.html'));
      }
    },
  }],
  server: {
    fs: { strict: true, allow: [fileURLToPath(new URL('.', import.meta.url))] },
  },
  build: { sourcemap: false, copyPublicDir: false },
});
