// Gera os 4 exemplos de estilo + folha. Uso: RESVG=... tsx scripts/gerar-estilos.mjs [só-um-time]
import { createRequire } from 'node:module';
import { writeFileSync, mkdirSync, readFileSync } from 'node:fs';
const require = createRequire(import.meta.url);
const { Resvg } = require(process.env.RESVG ?? '@resvg/resvg-js');
const { TIMES } = await import('../src/times.ts');
const { gerarSvgEstilo } = await import('../src/estilos.ts');
const OUT = new URL('../../prints/', import.meta.url).pathname;
mkdirSync(OUT, { recursive: true });
const render = (svg) => new Resvg(svg, { font: { loadSystemFonts: true, defaultFontFamily: 'DejaVu Sans' } }).render().asPng();
const PARES = [['palmeiras', 'asas'], ['flamengo', 'torcida'], ['corinthians', 'chuva'], ['vasco', 'colagem']];
const so = process.argv[2];
for (const [id, est] of PARES) {
  if (so && so !== id) continue;
  const t = TIMES.find((x) => x.id === id);
  writeFileSync(OUT + `estilo-${id}.png`, render(gerarSvgEstilo(t, est, 1080, 2400)));
  console.log(OUT + `estilo-${id}.png`, est);
}
if (!so) {
  const W = 540, H = 1200, G = 20;
  const imgs = PARES.map(([id], i) => `<image x="${G + i * (W + G)}" y="${G}" width="${W}" height="${H}" href="data:image/png;base64,${readFileSync(OUT + `estilo-${id}.png`).toString('base64')}"/>`).join('');
  writeFileSync(OUT + 'estilo-4.png', render(`<svg xmlns="http://www.w3.org/2000/svg" width="${G + 4 * (W + G)}" height="${H + 2 * G}"><rect width="100%" height="100%" fill="#111"/>${imgs}</svg>`));
  console.log(OUT + 'estilo-4.png');
}
