# CAD models and turntable previews

The L.A.R.A., CupExS, pop-up spoiler, and Tekkai 2.0 pages use orthographic Three.js viewers.
Their homepage cards use six WebP renders at 60° intervals. The featured carousel
keeps its existing artwork. The imported FBXs remain local and are never shipped.

## Rebuild assets

Requirements: Blender 5.2+, Python with Pillow, and `npm install`.

```sh
/Applications/Blender.app/Contents/MacOS/Blender --background --factory-startup --python scripts/prepare-project-models.py
python3 scripts/finish-project-models.py
node scripts/optimize-project-models.mjs
python3 scripts/prepare-image-metadata.py
npm run assets:sync
npm run build
```

Run the optimizer after Blender exports; it preserves an uncompressed copy in
`.model-build/`. Intermediate PNGs and reports also live there and are ignored by
Git. `-- --project cupexs --preview` produces a single preview for authoring.
The full rebuild is required before shipping all six frames.

Source mapping:

| Project | Local source under `public/3D models/` |
| --- | --- |
| cupexs | Cupexs car.fbx |
| lara | Lara.fbx |
| active-spoiler | Spoiler arm v2.fbx |
| sumo-2026 | Tekkai v2.fbx |

These Fusion exports use -Y as up when imported. The script corrects this to
Blender Z-up, centers the assembled geometry, and exports glTF Y-up. Check that
orientation before adding exports from other software. The script preserves
assembly positions and part colors, converts Fusion diffuse colors to linear
RGB, removes gloss, and splits shading at 30° corners while smoothing curves.
Planar dissolution and a mesh budget reduce excessive CAD tessellation. Inspect
fine details whenever changing those thresholds.

The camera stays fixed and orthographic while the assembly pivot turns through
0°, 60°, 120°, 180°, 240°, and 300°. One fixed scale fits all six positions.
Freestyle renders visible silhouettes, marked feature edges, and material
boundaries in black. Triangle diagonals are omitted. The live viewer combines
25° feature edges with a black silhouette pass; line thickness stays consistent
while zooming. Meshopt compression is decoded by a locally bundled decoder.

## Integrating another model

Add the source mapping to the preparation and finishing scripts. In `lab.json`,
set `media.model` to `{ "src": "media/models/project.glb", "alt": "…" }` and
`media.turntable.frames` to six ordered WebP paths. Set `media.src` to frame 000
for the default card image and project-page poster. Keep the carousel's `icon`
independent. Rebuild metadata and the public asset allowlist.

Cards map mouse X across their full width to six zones and reset on mouse leave.
Frames load near the viewport only for hover-capable fine pointers without a
reduced-motion preference. Touch and reduced-motion visitors get the default
cover. Incomplete sequences keep a static cover.

Project viewers load automatically, render on demand, and release GPU resources
when unmounted. Drag or arrow keys rotate; buttons or +/- zoom; Home or Reset
view restores the camera. Wheel zoom is enabled while the canvas has focus.
Vertical touch gestures scroll the page. Loading failures and WebGL context loss
restore the poster and announce the fallback.

## Verify

Run `npm run build` and `npx playwright test`. Model-specific browser coverage is
in `tests/project-models.spec.ts`: six zones, pointer exit, navigation, touch,
reduced motion, model failure, context loss, keyboard controls, zoom/reset, and
desktop/mobile captures. Inspect the captures for framing, CAD colors, black
edges, readable seams, and smooth curved surfaces.
