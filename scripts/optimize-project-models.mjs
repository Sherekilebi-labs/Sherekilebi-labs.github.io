import { copyFile, mkdir, readFile, stat, writeFile, access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { dedup, weld, meshopt } from '@gltf-transform/functions';
import { MeshoptDecoder, MeshoptEncoder } from 'meshoptimizer';

const root = fileURLToPath(new URL('../', import.meta.url));
await Promise.all([MeshoptEncoder.ready, MeshoptDecoder.ready]);
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({
  'meshopt.encoder': MeshoptEncoder, 'meshopt.decoder': MeshoptDecoder,
});
const report = [];
for (const project of ['cupexs', 'lara', 'active-spoiler', 'sumo-2026']) {
  const target = path.join(root, `public/media/models/${project}.glb`);
  const original = path.join(root, `.model-build/${project}/model.glb`);
  await mkdir(path.dirname(original), { recursive: true });
  // The Blender stage writes an uncompressed file; retain it for reproducibility.
  // Re-running compression always starts from the uncompressed Blender export.
  try { await access(original); } catch { await copyFile(target, original); }
  const document = await io.read(original);
  if (document.getRoot().listTextures().length === 0) {
    for (const mesh of document.getRoot().listMeshes()) {
      for (const primitive of mesh.listPrimitives()) {
        for (const semantic of primitive.listSemantics()) {
          if (semantic.startsWith('TEXCOORD_') || semantic === 'TANGENT') primitive.setAttribute(semantic, null);
        }
      }
    }
  }
  await document.transform(dedup(), weld(), meshopt({
    encoder: MeshoptEncoder, level: 'medium', quantizePosition: 16, quantizeNormal: 12, quantizeTexcoord: 14,
  }));
  await io.write(target, document);
  const preparation = JSON.parse(await readFile(path.join(root, `.model-build/${project}/report.json`), 'utf8'));
  report.push({ ...preparation, glbBytes: (await stat(target)).size });
  console.log(`${project}: ${(preparation.glbBytes / 1024 / 1024).toFixed(2)} → ${((await stat(target)).size / 1024 / 1024).toFixed(2)} MB`);
}
await writeFile(path.join(root, 'src/data/generated/model-metadata.json'), JSON.stringify(report, null, 2) + '\n');
