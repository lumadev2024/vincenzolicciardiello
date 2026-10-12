"""Generate responsive assets without changing the originals (requires Pillow)."""
from pathlib import Path
from PIL import Image, ImageOps, ImageDraw

assets = Path(__file__).resolve().parent.parent / 'assets'
for name, widths in [('matteo', [480, 800]), ('dottore-cutout', [480, 720])]:
    original = Image.open(assets / f'{name}.webp')
    for width in widths:
        resized = original.resize((width, round(original.height * width / original.width)), Image.Resampling.LANCZOS)
        resized.save(assets / f'{name}-{width}.webp', quality=83, method=6)

favicon = Image.open(assets / 'favicon.webp')
favicon.resize((32, 32), Image.Resampling.LANCZOS).save(assets / 'favicon-32.png')
favicon.resize((180, 180), Image.Resampling.LANCZOS).save(assets / 'apple-touch-icon.png')

# Contact sheet for inspecting all existing raster assets.
originals = [p for p in assets.iterdir() if p.suffix in ('.png', '.webp', '.jpg') and not any(x in p.stem for x in ('-480', '-720', '-800', 'favicon-32', 'apple-touch'))]
sheet = Image.new('RGB', (800, ((len(originals) + 3) // 4) * 190), '#d6ddd5')
draw = ImageDraw.Draw(sheet)
for i, p in enumerate(originals):
    img = Image.open(p).convert('RGBA')
    img.thumbnail((180, 150))
    x, y = (i % 4) * 200, (i // 4) * 190
    sheet.paste(img, (x + 10, y + 5), img)
    draw.text((x + 10, y + 162), p.name, fill='black')
sheet.save(assets.parent / 'tools' / 'asset-contact-sheet.jpg')
print('Generated responsive portraits, favicon and Apple icon.')
