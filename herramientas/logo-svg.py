# Alcalá — vectoriza el logo (webp con transparencia) a SVG con potrace.
# Uso: python herramientas/logo-svg.py imagenes/logo-blanco.webp herramientas/logo.svg
import sys, os
from PIL import Image
import numpy as np, potrace
src, out = sys.argv[1], sys.argv[2]
im = Image.open(src).convert('RGBA')
S = max(1, round(2400 / im.width))                 # se amplía hasta ~2400 px para que las curvas salgan finas
im = im.resize((im.width * S, im.height * S), Image.LANCZOS)
a = np.array(im)[..., 3]
# OJO: potracer toma True como fondo, así que se le pasa el negativo de la máscara de píxeles opacos
bm = potrace.Bitmap(a <= 128)
path = bm.trace(turdsize=30, turnpolicy=potrace.POTRACE_TURNPOLICY_MINORITY, alphamax=1.0, opticurve=True, opttolerance=0.25)
W, H = im.width // S, im.height // S
d = []
for curve in path:
    s = curve.start_point
    d.append(f"M{s.x/S:.2f} {s.y/S:.2f}")
    for seg in curve:
        if seg.is_corner:
            c = seg.c; e = seg.end_point
            d.append(f"L{c.x/S:.2f} {c.y/S:.2f}L{e.x/S:.2f} {e.y/S:.2f}")
        else:
            c1 = seg.c1; c2 = seg.c2; e = seg.end_point
            d.append(f"C{c1.x/S:.2f} {c1.y/S:.2f} {c2.x/S:.2f} {c2.y/S:.2f} {e.x/S:.2f} {e.y/S:.2f}")
    d.append("Z")
svg = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}"><path fill="#6B1A2B" fill-rule="evenodd" d="{"".join(d)}"/></svg>'
open(out, 'w', encoding='utf-8').write(svg)
print('curvas:', len(list(path)), 'bytes:', os.path.getsize(out))
