"""Record intrinsic dimensions without changing any source image.

Optional authoring helper: python3 scripts/prepare-image-metadata.py
Requires Pillow; the normal website build uses the committed JSON snapshot.
"""
import json
import re
from pathlib import Path
from PIL import Image

root = Path(__file__).resolve().parents[1]
lab = json.loads((root / 'src/data/lab.json').read_text())
sources = set()
for project in lab['projects']:
    if project['media'].get('src'):
        sources.add(project['media']['src'])
    for image in project.get('gallery', []):
        sources.add(image['src'])
for file in (root / 'content/news').glob('*.json'):
    post = json.loads(file.read_text())
    if post.get('media') and post.get('mediaType') != 'video':
        sources.add(post['media'])
    sources.update(re.findall(r'!\[[^\]]*\]\((media/[^)\s]+)\)', post.get('content', '')))

sizes = {}
public = (root / 'public').resolve()
for source in sorted(sources):
    if source.startswith('https://'):
        continue
    file = (public / source).resolve()
    if not file.is_relative_to(public):
        raise ValueError('Image must be inside public/')
    if file.suffix.lower() not in ['.webp', '.png', '.jpg', '.jpeg', '.gif']:
        continue
    with Image.open(file) as image:
        width, height = image.size
    sizes[source] = {'width': width, 'height': height}

output = root / 'src/data/generated/image-dimensions.json'
output.write_text(json.dumps(sizes, indent=2) + '\n')
print(f'Recorded intrinsic dimensions for {len(sizes)} images; originals unchanged.')
