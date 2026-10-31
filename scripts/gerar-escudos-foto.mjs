// Gera os exemplos "foto". Uso: RESVG=... tsx scripts/gerar-escudos-foto.mjs [time]
import { createRequire } from 'node:module';
import { writeFileSync, mkdirSync } from 'node:fs';
const require = createRequire(import.meta.url);
const { Resvg } = require(process.env.RESVG ?? '@resvg/resvg-js');
const { TIMES } = await import('../src/times.ts');
const { gerarSvgFotoEscudo } = await import('../src/escudo-foto.ts');
const OUT = new URL('../../prints/', import.meta.url).pathname;
mkdirSync(OUT, { recursive: true });
const render = (svg) => new Resvg(svg, { font: { loadSystemFonts: true, defaultFontFamily: 'DejaVu Sans' } }).render().asPng();
const achar = (id) => TIMES.find((t) => t.id === id);
const alvo = process.argv[2] ?? 'palmeiras';
writeFileSync(OUT + `foto-escudo-${alvo}.png`, render(gerarSvgFotoEscudo(achar(alvo), 1080, 2400)));
console.log(OUT + `foto-escudo-${alvo}.png`);
// folha 4 times: cada um é o papel de parede reduzido (540x1200) lado a lado
const ids = ['palmeiras', 'corinthians', 'gremio', 'bahia'];
const W = 540, H = 1200, G = 20;
const imgs = ids.map((id, i) => `<image x="${G + i * (W + G)}" y="${G}" width="${W}" height="${H}" href="data:image/png;base64,${Buffer.from(render(gerarSvgFotoEscudo(achar(id), 1080, 2400))).toString('base64')}"/>`).join('');
const total = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${G + 4 * (W + G)}" height="${H + 2 * G}"><rect width="100%" height="100%" fill="#111"/>${imgs}</svg>`;
writeFileSync(OUT + 'foto-escudos-4.png', render(total));
console.log(OUT + 'foto-escudos-4.png');
