"""Convert the six Blender PNGs per project into compact, transparent WebPs."""
from pathlib import Path
from PIL import Image

root = Path(__file__).resolve().parents[1]
for project in ['cupexs', 'lara', 'active-spoiler', 'sumo-2026']:
    sources = [root / '.model-build' / project / f'{angle:03d}.png' for angle in range(0, 360, 60)]
    if not all(source.exists() for source in sources):
        raise SystemExit(f'{project}: all six Blender renders are required')
    output = root / 'public/media/web/turntables' / project
    output.mkdir(parents=True, exist_ok=True)
    for source in sources:
        with Image.open(source) as image:
            image.save(output / f'{source.stem}.webp', format='WEBP', quality=90, method=6)
    print(f'{project}: saved six WebP turntable frames')
