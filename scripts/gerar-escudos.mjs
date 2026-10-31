// Gera PNGs de exemplo dos escudos. Uso: node scripts/gerar-escudos.mjs [time] [--todos]
// Requer @resvg/resvg-js (instalado fora do app: RESVG=/caminho/node_modules/@resvg/resvg-js).
import { createRequire } from 'node:module';
import { writeFileSync, mkdirSync } from 'node:fs';
const require = createRequire(import.meta.url);
const { Resvg } = require(process.env.RESVG ?? '@resvg/resvg-js');
const { TIMES } = await import('../src/times.ts');
const { gerarSvgComEscudo, escudoG } = await import('../src/escudo.ts');

const OUT = new URL('../../prints/', import.meta.url).pathname;
mkdirSync(OUT, { recursive: true });
const png = (svg, arq) => {
  const r = new Resvg(svg, { font: { loadSystemFonts: true, defaultFontFamily: 'DejaVu Sans' } });
  writeFileSync(OUT + arq, r.render().asPng());
  console.log(OUT + arq);
};
const achar = (id) => TIMES.find((t) => t.id === id);

const alvo = process.argv[2] && !process.argv[2].startsWith('--') ? process.argv[2] : 'palmeiras';
png(gerarSvgComEscudo(achar(alvo), 1080, 2400), `exemplo-escudo-${alvo}.png`);

// Contato com 4 escudos
const quatro = ['palmeiras', 'corinthians', 'gremio', 'bahia'].map(achar);
const W = 1600, H = 520, s = 340;
let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><rect width="${W}" height="${H}" fill="#1B1F24"/>`;
quatro.forEach((t, i) => {
  const x = 40 + i * 390;
  svg += escudoG(t, x + 5, 40, s, `c${i}`) +
    `<text x="${x + 5 + s / 2}" y="${40 + s + 70}" text-anchor="middle" font-family="DejaVu Sans" font-weight="700" font-size="34" fill="#FFFFFF">${t.nome}</text>`;
});
png(svg + '</svg>', 'exemplo-escudos-4.png');

if (process.argv.includes('--todos')) {
  mkdirSync(OUT + 'escudos/', { recursive: true });
  for (const t of TIMES) png(gerarSvgComEscudo(t, 1080, 2400), `escudos/${t.id}-1080x2400.png`);
}
