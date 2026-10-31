// Gera um lote: todos os estilos para os times dados, com escudo OFICIAL (prévia pessoal).
// Uso: RESVG=... tsx scripts/gerar-lote.mjs <lote> <time1,time2,...> [--folhas] [--so=estilo1,estilo2]
import { createRequire } from 'node:module';
import { writeFileSync, readFileSync, mkdirSync, existsSync } from 'node:fs';
const require = createRequire(import.meta.url);
const { Resvg } = require(process.env.RESVG ?? '@resvg/resvg-js');
const { TIMES } = await import('../src/times.ts');
const { gerarSvgEstilo, ESTILOS } = await import('../src/estilos.ts');
const [lote, lista] = process.argv.slice(2);
const so = (process.argv.find((a) => a.startsWith('--so=')) ?? '').slice(5).split(',').filter(Boolean);
const OUT = new URL(`../../prints/${lote}/`, import.meta.url).pathname;
const ESC = new URL('../assets/escudos/', import.meta.url).pathname;
mkdirSync(OUT, { recursive: true });
const render = (svg) => new Resvg(svg, { font: { loadSystemFonts: true, defaultFontFamily: 'DejaVu Sans' } }).render().asPng();
const ids = lista.split(',');
const W = 1080, H = 2400;
for (const id of ids) {
  const t = TIMES.find((x) => x.id === id);
  const arq = ESC + id + '.svg';
  if (!existsSync(arq)) { console.log('SEM ESCUDO', id); continue; }
  const href = 'data:image/svg+xml;base64,' + readFileSync(arq).toString('base64');
  for (const est of ESTILOS) {
    if (so.length && !so.includes(est)) continue;
    const t0 = Date.now();
    writeFileSync(OUT + `${id}-${est}.png`, render(gerarSvgEstilo(t, est, W, H, href)));
    console.log(`${OUT}${id}-${est}.png ${((Date.now() - t0) / 1000).toFixed(1)}s`);
  }
}
const img = (p, x, y, w, h) => `<image x="${x}" y="${y}" width="${w}" height="${h}" href="data:image/png;base64,${readFileSync(p).toString('base64')}"/>`;
if (process.argv.includes('--folhas')) {
  const tw = 360, th = 800, g = 16;
  for (const id of ids) {
    let s = '';
    ESTILOS.forEach((e, i) => { s += img(OUT + `${id}-${e}.png`, g + (i % 3) * (tw + g), g + Math.floor(i / 3) * (th + g + 50), tw, th) +
      `<text x="${g + (i % 3) * (tw + g) + tw / 2}" y="${g + Math.floor(i / 3) * (th + g + 50) + th + 38}" text-anchor="middle" font-family="DejaVu Sans" font-weight="700" font-size="28" fill="#FFF">${e}</text>`; });
    writeFileSync(OUT + `${id}-folha.png`, render(`<svg xmlns="http://www.w3.org/2000/svg" width="${g + 3 * (tw + g)}" height="${g + 2 * (th + g + 50)}"><rect width="100%" height="100%" fill="#111"/>${s}</svg>`));
    console.log(OUT + `${id}-folha.png`);
  }
  const gw = 180, gh = 400;
  let s = '';
  ids.forEach((id, r) => ESTILOS.forEach((e, c) => { s += img(OUT + `${id}-${e}.png`, g + c * (gw + g), g + r * (gh + g), gw, gh); }));
  writeFileSync(OUT + `${lote}-geral.png`, render(`<svg xmlns="http://www.w3.org/2000/svg" width="${g + ESTILOS.length * (gw + g)}" height="${g + ids.length * (gh + g)}"><rect width="100%" height="100%" fill="#111"/>${s}</svg>`));
  console.log(OUT + `${lote}-geral.png`);
}
