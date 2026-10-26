# Image layout: complete photos, no extra clicks

## Default presentation

- Show the complete frame. Responsive images keep their natural proportions and use `object-fit: contain`; a wide photograph and a portrait do not need to share the same height.
- Keep project icons in their existing contained card/carousel frames. Their links open project pages. Workshop photos and news media have no raw-image links or new-tab behavior.
- Use two columns for project photographs on desktop and one on narrow screens. A final unpaired photograph spans the gallery. Align figures at the top instead of stretching short photos to match tall ones.
- Limit gallery photographs to 640 pixels tall, news-feed media to 620 pixels, and homepage previews to 360 pixels. Containment keeps the entire image visible within those bounds; a quiet background fills any spare space. Mobile images naturally shrink to the available width.
- Place captions and dispatch date labels below the picture so they cannot cover wiring, robot parts, text, or graph axes.

## Resizing and cropping policy

The current metadata-free WebP derivatives are large enough for these layouts, so changing their presentation does not require re-encoding or cropping the originals. The committed dimension snapshot supplies accurate image width/height attributes and reduces layout shifts while photos load.

For future images, first rotate using EXIF orientation, retain the untouched original locally, then create a metadata-free web copy. Resize proportionally without upscaling; approximately 1500–1600 pixels on the long side is suitable for most inline photographs. Generate smaller derivatives at 480, 800, and 1200 pixels only if image transfer size becomes a measured issue, and connect them through `srcset` and `sizes`.

Do not automatically center-crop every photo. A manual crop may remove empty background when the full subject still fits, but preserve robot extremities, circuit boards, connector labels, people/pets, and graph axes. Keep an uncropped web copy whenever a crop would lose useful context. Use the uncropped version in the page's full gallery or dispatch.

## Verification and maintenance

After adding/replacing photos, run `python3 scripts/prepare-image-metadata.py` to refresh `src/data/generated/image-dimensions.json`, then build the website. The optional helper reads images with Pillow and never changes the originals.

Check portrait and landscape examples on project pages, `/news`, and homepage previews at desktop and phone widths. Confirm the full frame is visible, no image opens a raw file, captions stay outside the picture, and the page has no horizontal overflow. Existing browser checks cover these behaviors.


## GYM Scale background removal

The original `public/media/GYM scale.jpg` is preserved. The transparent cutout is
`public/media/GYM scale.png`; the website continues to use
`public/media/web/gym-scale.webp`, now with alpha transparency. Created with the
built-in imagegen tool using the JPEG as the edit target.

Edit prompt:

```text
Use case: background-extraction. Edit target: the supplied GYM scale CAD-render image. Remove only the white/off-white background surrounding the scale and replace it with true transparent alpha. Preserve the scale exactly: the blue weighing platform, silver/gray enclosure, dark contour lines, perspective, framing, proportions, all four round controls and their markings, the digital display and its tiny markings. Keep all parts of the scale opaque, including silver highlights and light-colored details; these are not background. Preserve the original appearance and colors. Keep clean antialiased edges without a white halo. Do not redesign, redraw, relight, rotate, add or remove hardware, change text, or add a shadow/backdrop. Output a transparent PNG cutout of the same complete scale.
```
