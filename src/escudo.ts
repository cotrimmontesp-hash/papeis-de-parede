// Escudo ORIGINAL em formato de brasão, gerado por código.
// Não usa nem imita escudos/logos oficiais: só a forma heráldica genérica,
// as cores/padrões do time (times.ts) e uma sigla de 3 letras.
import type { Time } from './times';
import { fundo } from './arte';

export const SIGLAS: Record<string, string> = {
  'athletico-pr': 'CAP', 'atletico-mg': 'CAM', bahia: 'BAH', botafogo: 'BOT',
  chapecoense: 'CHA', corinthians: 'COR', coritiba: 'CFC', cruzeiro: 'CRU',
  flamengo: 'FLA', fluminense: 'FLU', gremio: 'GRE', internacional: 'INT',
  mirassol: 'MIR', palmeiras: 'PAL', bragantino: 'RBB', remo: 'REM',
  santos: 'SAN', 'sao-paulo': 'SAO', vasco: 'VAS', vitoria: 'VIT',
};

export const OURO = '#E8C35A';
const FONTE = 'Arial, Helvetica, DejaVu Sans, sans-serif';
// Brasão "heater" genérico, em coordenadas 0..100.
export const FORMA = 'M10,10 H90 V50 C90,74 73,88 50,97 C27,88 10,74 10,50 Z';

export function lum(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  return (0.299 * ((n >> 16) & 255) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255;
}

export function estrela(cx: number, cy: number, r: number, cor: string) {
  const p: string[] = [];
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const rr = i % 2 === 0 ? r : r * 0.42;
    p.push(`${(cx + rr * Math.cos(a)).toFixed(2)},${(cy + rr * Math.sin(a)).toFixed(2)}`);
  }
  return `<polygon points="${p.join(' ')}" fill="${cor}"/>`;
}

/** Campo interno do brasão (0..100), a partir do padrão do time. */
export function campo(t: Time): string {
  const c = t.cores;
  const bg = (cor: string) => `<rect width="100" height="100" fill="${cor}"/>`;
  switch (t.padrao) {
    case 'listras-v':
      return Array.from({ length: 7 }, (_, i) =>
        `<rect x="${10 + i * (80 / 7)}" y="0" width="${80 / 7 + 0.3}" height="100" fill="${c[i % c.length]}"/>`).join('');
    case 'listras-h':
      return Array.from({ length: 8 }, (_, i) =>
        `<rect x="0" y="${10 + i * 11}" width="100" height="11.3" fill="${c[i % c.length]}"/>`).join('');
    case 'listras-diag':
      return bg(c[0]) + `<g transform="rotate(-35 50 50)">` +
        Array.from({ length: 8 }, (_, i) => i % 2 ? `<rect x="${-40 + i * 12}" y="-40" width="12" height="180" fill="${c[1]}"/>` : '').join('') + `</g>`;
    case 'faixa-h':
      return bg(c[0]) + `<rect x="0" y="40" width="100" height="20" fill="${c[1]}"/>` +
        (c[2] ? `<rect x="0" y="36" width="100" height="3" fill="${c[2]}"/><rect x="0" y="61" width="100" height="3" fill="${c[2]}"/>` : '');
    case 'faixa-v':
      return bg(c[0]) + `<rect x="38" y="0" width="24" height="100" fill="${c[1]}"/>`;
    case 'faixa-diag':
      return bg(c[0]) + `<polygon points="10,22 22,10 90,78 90,92 82,97" fill="${c[1]}"/>`;
    case 'metade':
      return bg(c[0]) + `<polygon points="90,10 90,100 10,100" fill="${c[1]}"/>`;
    case 'gradiente': // esquartelado com os dois tons
      return bg(c[0]) + `<rect x="50" y="0" width="50" height="50" fill="${c[1]}"/><rect x="0" y="50" width="50" height="50" fill="${c[1]}"/>`;
    case 'estrela':
      return bg(c[0]) + estrela(50, 52, 34, c[1]);
    case 'estrelas':
      return bg(c[0]) + [[30, 30], [70, 30], [24, 62], [76, 62], [50, 84]].map(([x, y]) => estrela(x, y, 6, c[1])).join('');
  }
}

/** SVG <g> do escudo, com largura `s` em (x, y) = canto superior esquerdo. */
export function escudoG(t: Time, x: number, y: number, s: number, id = t.id): string {
  const sigla = SIGLAS[t.id] ?? t.nome.slice(0, 3).toUpperCase();
  const escuro = [...t.cores].sort((a, b) => lum(a) - lum(b))[0];
  const meio = lum(escuro) > 0.35 ? '#111111' : escuro;
  const k = s / 100;
  const cid = `esc-${id}`;
  return `<g transform="translate(${x} ${y}) scale(${k})">` +
    `<defs><clipPath id="${cid}"><path d="${FORMA}"/></clipPath>` +
    `<filter id="${cid}-sb" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="2" stdDeviation="2.2" flood-color="#000" flood-opacity="0.55"/></filter></defs>` +
    `<path d="${FORMA}" fill="${OURO}" stroke="${OURO}" stroke-width="7" stroke-linejoin="round" filter="url(#${cid}-sb)"/>` +
    `<g clip-path="url(#${cid})">${campo(t)}</g>` +
    `<path d="${FORMA}" fill="none" stroke="#111111" stroke-width="1.6" stroke-linejoin="round"/>` +
    // chefe (faixa do topo) com a UF e duas estrelinhas decorativas
    `<g clip-path="url(#${cid})"><rect x="0" y="0" width="100" height="22" fill="${meio}"/>` +
    `<rect x="0" y="22" width="100" height="1.6" fill="${OURO}"/></g>` +
    estrela(25, 16.2, 3.2, OURO) + estrela(75, 16.2, 3.2, OURO) +
    `<text x="50" y="19.4" text-anchor="middle" font-family="${FONTE}" font-weight="700" font-size="8" fill="#FFFFFF" letter-spacing="1.2">${t.uf}</text>` +
    // medalhão central com a sigla
    `<circle cx="50" cy="55" r="21" fill="${meio}" stroke="${OURO}" stroke-width="2.6"/>` +
    `<circle cx="50" cy="55" r="17.2" fill="none" stroke="#FFFFFF" stroke-opacity="0.55" stroke-width="0.8"/>` +
    `<text x="50" y="60.6" text-anchor="middle" font-family="${FONTE}" font-weight="900" font-size="15" fill="#FFFFFF" letter-spacing="0.6">${sigla}</text>` +
    `</g>`;
}

/** SVG só do escudo (quadrado s×s, fundo transparente). */
export function gerarSvgSoEscudo(t: Time, s: number): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 ${s} ${s}">${escudoG(t, 0, 0, s)}</svg>`;
}

/** Papel de parede com o escudo grande no centro (fundo = padrão do time escurecido). */
export function gerarSvgComEscudo(t: Time, w: number, h: number): string {
  const m = Math.min(w, h);
  const s = m * (w < h ? 0.78 : 0.62);
  const ex = (w - s) / 2, ey = h * (w < h ? 0.42 : 0.4) - s * 0.53;
  const fs = Math.round(Math.min(m * 0.11, (w * 0.86) / (t.nome.length * 0.74)));
  const ty = ey + s * 1.0 + fs * 1.35;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">` +
    fundo(t, w, h) +
    `<defs><radialGradient id="esc-vin" cx="0.5" cy="0.42" r="0.75"><stop offset="0" stop-color="#000" stop-opacity="0.25"/><stop offset="1" stop-color="#000" stop-opacity="0.7"/></radialGradient></defs>` +
    `<rect width="${w}" height="${h}" fill="url(#esc-vin)"/>` +
    escudoG(t, ex, ey, s, `${t.id}-wp`) +
    `<text x="${w / 2}" y="${ty}" text-anchor="middle" font-family="${FONTE}" font-weight="900" font-size="${fs}" fill="#FFFFFF" letter-spacing="${fs * 0.04}">${t.nome.toUpperCase()}</text>` +
    `<text x="${w / 2}" y="${ty + fs * 0.75}" text-anchor="middle" font-family="${FONTE}" font-weight="700" font-size="${Math.round(fs * 0.32)}" fill="${OURO}" letter-spacing="${fs * 0.08}">SÉRIE A 2026 · ${t.uf}</text>` +
    `</svg>`;
}
