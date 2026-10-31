// Prévia PESSOAL com escudos oficiais (marca registrada; não publicar/vender).
// Uso: RESVG=... tsx scripts/gerar-oficial.mjs
import { createRequire } from 'node:module';
import { writeFileSync, readFileSync, mkdirSync } from 'node:fs';
const require = createRequire(import.meta.url);
const { Resvg } = require(process.env.RESVG ?? '@resvg/resvg-js');
const { TIMES } = await import('../src/times.ts');
const { gerarSvgEstilo } = await import('../src/estilos.ts');
const OUT = new URL('../../prints/', import.meta.url).pathname;
const ESC = new URL('../assets/escudos/', import.meta.url).pathname;
mkdirSync(OUT, { recursive: true });
const render = (svg) => new Resvg(svg, { font: { loadSystemFonts: true, defaultFontFamily: 'DejaVu Sans' } }).render().asPng();
const PARES = [['palmeiras', 'asas'], ['flamengo', 'torcida'], ['corinthians', 'chuva'], ['vasco', 'colagem']];
for (const [id, est] of PARES) {
  const t = TIMES.find((x) => x.id === id);
  const href = 'data:image/svg+xml;base64,' + readFileSync(ESC + id + '.svg').toString('base64');
  writeFileSync(OUT + `oficial-${id}.png`, render(gerarSvgEstilo(t, est, 1080, 2400, href)));
  console.log(OUT + `oficial-${id}.png`, est);
}
const W = 540, H = 1200, G = 20;
const imgs = PARES.map(([id], i) => `<image x="${G + i * (W + G)}" y="${G}" width="${W}" height="${H}" href="data:image/png;base64,${readFileSync(OUT + `oficial-${id}.png`).toString('base64')}"/>`).join('');
writeFileSync(OUT + 'oficial-4.png', render(`<svg xmlns="http://www.w3.org/2000/svg" width="${G + 4 * (W + G)}" height="${H + 2 * G}"><rect width="100%" height="100%" fill="#111"/>${imgs}</svg>`));
console.log(OUT + 'oficial-4.png');
