// Amostras de Desenhos e Filmes com arte ORIGINAL (formas simples, sem personagens, logos ou pôsteres reais).
// Uso: RESVG=... node scripts/gerar-temas.mjs <lote>   → prints/<lote>/<id>-<estilo>.png
import { createRequire } from 'node:module';
import { writeFileSync, mkdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
const require = createRequire(import.meta.url);
const { Resvg } = require(process.env.RESVG ?? '@resvg/resvg-js');
const OUT = new URL(`../../prints/${process.argv[2] ?? 'lote3'}/`, import.meta.url).pathname;
mkdirSync(OUT, { recursive: true });
const W = 1080, H = 2400;
const render = (svg, w = W) => new Resvg(svg, { fitTo: { mode: 'width', value: w }, font: { loadSystemFonts: true, defaultFontFamily: 'DejaVu Sans' } }).render().asPng();

// Formas em uma caixa 600x600; papel: a, b, c (cores) e l (traço/detalhe)
const R = (x, y, w, h, rx, r) => ({ t: 'rect', a: { x, y, width: w, height: h, rx }, r });
const C = (cx, cy, rr, r) => ({ t: 'circle', a: { cx, cy, r: rr }, r });
const E = (cx, cy, rx, ry, r) => ({ t: 'ellipse', a: { cx, cy, rx, ry }, r });
const P = (d, r, so) => ({ t: 'path', a: { d }, r, so });
const TEMAS = {
  'robo-amigo': { titulo: 'ROBÔ AMIGO', cores: ['#4FC3F7', '#FFB74D', '#FF5C8A'], formas: [
    P('M300 95 L300 45', 'l', 1), C(300, 35, 22, 'c'), R(100, 340, 60, 150, 30, 'a'), R(440, 340, 60, 150, 30, 'a'),
    R(210, 520, 60, 70, 20, 'a'), R(330, 520, 60, 70, 20, 'a'), R(150, 95, 300, 200, 50, 'a'), R(170, 310, 260, 220, 40, 'b'),
    C(235, 185, 34, 'c'), C(365, 185, 34, 'c'), C(235, 185, 12, 'l'), C(365, 185, 12, 'l'),
    P('M240 245 Q300 285 360 245', 'l', 1), P('M300 455 L245 400 A30 30 0 0 1 300 370 A30 30 0 0 1 355 400 Z', 'c')] },
  'gato-astronauta': { titulo: 'GATO NO ESPAÇO', cores: ['#B39DDB', '#80CBC4', '#FFE082'], formas: [
    C(300, 270, 215, 'c'), R(185, 455, 230, 140, 60, 'b'), P('M185 200 L215 85 L275 160 Z', 'a'), P('M415 200 L385 85 L325 160 Z', 'a'),
    C(300, 255, 125, 'a'), E(255, 240, 16, 26, 'l'), E(345, 240, 16, 26, 'l'), P('M285 285 L315 285 L300 302 Z', 'l'),
    P('M200 290 L265 300 M200 320 L265 310 M400 290 L335 300 M400 320 L335 310', 'l', 1), C(300, 520, 22, 'c')] },
  'detetive-neon': { titulo: 'DETETIVE', cores: ['#FF4FA3', '#3DDCFF', '#FFD23F'], formas: [
    P('M160 590 L230 270 L300 400 L370 270 L440 590 Z', 'b'), E(300, 215, 215, 42, 'a'), P('M190 215 Q195 85 300 95 Q405 85 410 215 Z', 'a'),
    R(195, 170, 210, 26, 6, 'c'), C(470, 440, 62, 'c'), P('M515 485 L580 560', 'l', 1), P('M300 400 L300 590', 'l', 1)] },
  'nave-espacial': { titulo: 'NAVE ESPACIAL', cores: ['#E0E6F0', '#FF6B4A', '#5CE1E6'], formas: [
    C(510, 95, 42, 'b'), P('M430 110 Q510 60 590 85', 'l', 1), P('M245 420 Q300 600 355 420 Z', 'c'),
    P('M212 330 L130 480 L215 445 Z', 'b'), P('M388 330 L470 480 L385 445 Z', 'b'), P('M300 40 Q405 160 390 430 L210 430 Q195 160 300 40 Z', 'a'),
    C(300, 225, 52, 'c'), C(300, 225, 30, 'l'), C(90, 140, 8, 'c'), C(140, 560, 6, 'c'), C(520, 300, 7, 'c')] },
};
const CAT = { 'robo-amigo': 'desenhos', 'gato-astronauta': 'desenhos', 'detetive-neon': 'filmes', 'nave-espacial': 'filmes' };

const attrs = (a) => Object.entries(a).map(([k, v]) => `${k}="${v}"`).join(' ');
function motivo(formas, cor, modo, sw = 12) {
  return formas.map((f) => {
    const c = cor[f.r];
    const pinta = modo === 'linha' || f.so ? `fill="none" stroke="${c}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"` : `fill="${c}"`;
    return `<${f.t} ${attrs(f.a)} ${pinta}/>`;
  }).join('');
}
const mistura = (h, alvo, k) => '#' + [1, 3, 5].map((i) => Math.round(parseInt(h.substr(i, 2), 16) * (1 - k) + parseInt(alvo.substr(i, 2), 16) * k).toString(16).padStart(2, '0')).join('');
const lugar = (s, esc = 1.45) => `<g transform="translate(${(W - 600 * esc) / 2} 760) scale(${esc})">${s}</g>`;
const svg = (defs, corpo) => `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><defs>${defs}</defs>${corpo}</svg>`;
const texto = (t, y, fam, tam, cor, extra = '') => `<text x="${W / 2}" y="${y}" text-anchor="middle" font-family="${fam}" font-size="${tam}" fill="${cor}" ${extra}>${t}</text>`;

const ESTILOS = {
  neon(t) {
    const cor = { a: '#FF4FD8', b: '#3DF2FF', c: '#FFE14D', l: '#FFFFFF' };
    let grade = '';
    for (let y = 1700; y < H; y += 70) grade += `<line x1="0" y1="${y}" x2="${W}" y2="${y}" stroke="#7B2CFF" stroke-opacity="0.45" stroke-width="3"/>`;
    for (let x = -1200; x <= W + 1200; x += 160) grade += `<line x1="${W / 2}" y1="1700" x2="${x}" y2="${H}" stroke="#7B2CFF" stroke-opacity="0.45" stroke-width="3"/>`;
    return svg(`<filter id="brilho" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="9" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>`,
      `<rect width="${W}" height="${H}" fill="#07051A"/>${grade}<g filter="url(#brilho)">${lugar(motivo(t.formas, cor, 'linha', 10))}${texto(t.titulo, 430, 'Monoton', Math.min(112, Math.round(1000 / t.titulo.length)), 'none', 'stroke="#3DF2FF" stroke-width="3"')}</g>`);
  },
  aquarela(t) {
    const [x, y, z] = t.cores.map((h) => mistura(h, '#FFFFFF', 0.25));
    const cor = { a: x, b: y, c: z, l: '#3A3550' };
    const manchas = [[260, 700, 420, x], [820, 1150, 380, y], [380, 1750, 460, z], [900, 2150, 300, x]].map(([cx, cy, r, c]) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${c}" opacity="0.35"/>`).join('');
    return svg(`<filter id="agua" x="-20%" y="-20%" width="140%" height="140%"><feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="3" seed="4"/><feDisplacementMap in="SourceGraphic" scale="70"/><feGaussianBlur stdDeviation="6"/></filter>
      <filter id="borda"><feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" seed="9"/><feDisplacementMap in="SourceGraphic" scale="10"/></filter>`,
      `<rect width="${W}" height="${H}" fill="#F7F2E8"/><g filter="url(#agua)">${manchas}</g><g filter="url(#borda)" opacity="0.92">${lugar(motivo(t.formas, cor, 'cor'))}</g>${texto(t.titulo.toLowerCase(), 1820, 'Permanent Marker', 104, '#3A3550')}`);
  },
  minimalista(t) {
    const fundo = mistura(t.cores[0], '#101418', 0.78);
    const cor = { a: t.cores[0], b: t.cores[1], c: t.cores[2], l: fundo };
    return svg('', `<rect width="${W}" height="${H}" fill="${fundo}"/>${lugar(motivo(t.formas, cor, 'cor'), 1.2)}${texto(t.titulo, 1900, 'Oswald', 46, '#E8ECF1', 'letter-spacing="18"')}<rect x="${W / 2 - 40}" y="1940" width="80" height="4" fill="${t.cores[2]}"/>`);
  },
  retro(t) {
    const cor = { a: '#F4E3C1', b: '#2A9D8F', c: '#E76F51', l: '#3D2645' };
    let faixas = '';
    for (let i = 0; i < 6; i++) faixas += `<rect x="0" y="${1010 + i * 52}" width="${W}" height="${10 + i * 4}" fill="#3D2645"/>`;
    return svg(`<linearGradient id="ceu" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3D2645"/><stop offset="0.45" stop-color="#C8553D"/><stop offset="1" stop-color="#F2A541"/></linearGradient>
      <linearGradient id="sol" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFD166"/><stop offset="1" stop-color="#EF476F"/></linearGradient>
      <filter id="grao"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="1" seed="2"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.18 0"/></filter>`,
      `<rect width="${W}" height="${H}" fill="url(#ceu)"/><circle cx="${W / 2}" cy="1000" r="420" fill="url(#sol)"/>${faixas}${lugar(motivo(t.formas, cor, 'cor'))}
      ${texto(t.titulo, 1960, 'Bebas Neue', 170, '#3D2645', 'transform="translate(8 8)"')}${texto(t.titulo, 1960, 'Bebas Neue', 170, '#F4E3C1')}<rect width="${W}" height="${H}" filter="url(#grao)"/>`);
  },
  pixel(t) {
    const cor = { a: t.cores[0], b: t.cores[1], c: t.cores[2], l: '#141029' };
    let est = '';
    for (let i = 0; i < 60; i++) est += `<rect x="${(i * 397) % W}" y="${(i * 641) % H}" width="18" height="18" fill="#FFFFFF" opacity="${0.3 + (i % 3) * 0.2}"/>`;
    // desenha pequeno (108 px de largura) e amplia sem suavizar → pixels de 10x10
    return { peq: render(svg('', `<rect width="${W}" height="${H}" fill="#1B1640"/>${est}${lugar(motivo(t.formas, cor, 'cor'))}${texto(t.titulo, 1900, 'Black Ops One', 120, '#FFE14D')}`), 108) };
  },
};
for (const [id, t] of Object.entries(TEMAS)) for (const [e, f] of Object.entries(ESTILOS)) {
  const r = f(t), arq = OUT + `${id}-${e}.png`;
  if (typeof r === 'string') writeFileSync(arq, render(r));
  else { writeFileSync(arq, r.peq); execFileSync('python3', ['-c', `from PIL import Image; Image.open('${arq}').convert('RGB').resize((${W},${H}), Image.NEAREST).save('${arq}')`]); }
  console.log(OUT + `${id}-${e}.png`, CAT[id]);
}
