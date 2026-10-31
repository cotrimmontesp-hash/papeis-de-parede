"""Converte os PNGs dos lotes (prints/lote*/<time>-<estilo>.png) em imagens otimizadas
para o app: public/papeis/<time>/<estilo>.jpg (original 1080x2400) e <estilo>-mini.webp
(miniatura 300x667), e gera src/catalogo.ts. Uso: python3 scripts/preparar-imagens.py"""
import glob, json, os, re
from PIL import Image

APP = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PRINTS = os.path.join(os.path.dirname(APP), 'prints')
OUT = os.path.join(APP, 'public', 'papeis')
ESTILOS = ['asas', 'torcida', 'chuva', 'colagem', 'neon', 'metal']
cat = {}
for png in sorted(glob.glob(os.path.join(PRINTS, 'lote*', '*.png'))):
    m = re.match(r'(.+)-(' + '|'.join(ESTILOS) + r')\.png$', os.path.basename(png))
    if not m: continue
    tid, est = m.groups()
    d = os.path.join(OUT, tid); os.makedirs(d, exist_ok=True)
    jpg, mini = os.path.join(d, est + '.jpg'), os.path.join(d, est + '-mini.webp')
    if not (os.path.exists(jpg) and os.path.getmtime(jpg) >= os.path.getmtime(png)):
        im = Image.open(png).convert('RGB')
        im.save(jpg, 'JPEG', quality=86, progressive=True, optimize=True)
        im.resize((300, 667), Image.LANCZOS).save(mini, 'WEBP', quality=72, method=6)
    cat.setdefault(tid, []).append(est)
for k in cat: cat[k].sort(key=ESTILOS.index)
with open(os.path.join(APP, 'src', 'catalogo.ts'), 'w') as f:
    f.write('// Gerado por scripts/preparar-imagens.py — não editar à mão.\n')
    f.write('export const CATALOGO: Record<string, string[]> = ' + json.dumps(cat, indent=2, ensure_ascii=False) + ';\n')
tot = sum(os.path.getsize(p) for p in glob.glob(os.path.join(OUT, '*', '*')))
print(len(cat), 'times,', sum(map(len, cat.values())), 'imagens,', round(tot / 1e6, 1), 'MB em public/papeis')
