import type { Time } from './times';

export type Tamanho = { id: string; rotulo: string; w: number; h: number };
export const TAMANHOS: Tamanho[] = [
  { id: 'cel', rotulo: 'Celular 1080×1920', w: 1080, h: 1920 },
  { id: 'cel-alto', rotulo: 'Celular alto 1080×2400', w: 1080, h: 2400 },
  { id: 'tab-ret', rotulo: 'Tablet retrato 1600×2560', w: 1600, h: 2560 },
  { id: 'tab-pai', rotulo: 'Tablet paisagem 2560×1600', w: 2560, h: 1600 },
];

function luminancia(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

function estrela(cx: number, cy: number, r: number, cor: string) {
  const pts: string[] = [];
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const rr = i % 2 === 0 ? r : r * 0.42;
    pts.push(`${(cx + rr * Math.cos(a)).toFixed(1)},${(cy + rr * Math.sin(a)).toFixed(1)}`);
  }
  return `<polygon points="${pts.join(' ')}" fill="${cor}"/>`;
}

export function fundo(t: Time, w: number, h: number): string {
  const c = t.cores;
  const m = Math.min(w, h);
  switch (t.padrao) {
    case 'listras-v': {
      const n = 9, sw = w / n;
      return Array.from({ length: n }, (_, i) =>
        `<rect x="${i * sw}" y="0" width="${sw + 1}" height="${h}" fill="${c[i % c.length]}"/>`).join('');
    }
    case 'listras-h': {
      const n = 12, sh = h / n;
      return Array.from({ length: n }, (_, i) =>
        `<rect x="0" y="${i * sh}" width="${w}" height="${sh + 1}" fill="${c[i % c.length]}"/>`).join('');
    }
    case 'listras-diag': {
      const d = w + h, sw = m / 7;
      const n = Math.ceil(d / sw) + 2;
      const r = Array.from({ length: n }, (_, i) =>
        i % 2 ? `<rect x="${i * sw - h}" y="-10" width="${sw}" height="${d * 2}" fill="${c[1]}"/>` : '').join('');
      return `<rect width="${w}" height="${h}" fill="${c[0]}"/><g transform="skewX(-35)">${r}</g>`;
    }
    case 'faixa-h': {
      const y = h * 0.36, bh = m * 0.22;
      const linhas = c[2]
        ? `<rect x="0" y="${y - bh * 0.18}" width="${w}" height="${bh * 0.12}" fill="${c[2]}"/><rect x="0" y="${y + bh * 1.06}" width="${w}" height="${bh * 0.12}" fill="${c[2]}"/>`
        : '';
      return `<rect width="${w}" height="${h}" fill="${c[0]}"/><rect x="0" y="${y}" width="${w}" height="${bh}" fill="${c[1]}"/>${linhas}`;
    }
    case 'faixa-v': {
      const bw = m * 0.28;
      return `<rect width="${w}" height="${h}" fill="${c[0]}"/><rect x="${(w - bw) / 2}" y="0" width="${bw}" height="${h}" fill="${c[1]}"/>`;
    }
    case 'faixa-diag': {
      const t2 = m * 0.16;
      return `<rect width="${w}" height="${h}" fill="${c[0]}"/><polygon points="0,${-t2} ${t2 * 1.4},0 ${w},${h - t2} ${w},${h + t2} ${w - t2 * 1.4},${h} 0,${t2}" fill="${c[1]}"/>`;
    }
    case 'metade':
      return `<rect width="${w}" height="${h}" fill="${c[0]}"/><polygon points="${w},0 ${w},${h} 0,${h}" fill="${c[1]}"/>`;
    case 'gradiente':
      return `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c[0]}"/><stop offset="1" stop-color="${c[1]}"/></linearGradient></defs><rect width="${w}" height="${h}" fill="url(#g)"/>`;
    case 'estrela':
      return `<rect width="${w}" height="${h}" fill="${c[0]}"/>${estrela(w / 2, h * 0.38, m * 0.3, c[1])}`;
    case 'estrelas': {
      const pos = [[0.5, 0.14, 1], [0.32, 0.32, 0.8], [0.68, 0.3, 0.85], [0.5, 0.56, 1], [0.6, 0.42, 0.5]];
      return `<rect width="${w}" height="${h}" fill="${c[0]}"/>` +
        pos.map(([x, y, s]) => estrela(w * x, h * y, m * 0.07 * s, c[1])).join('');
    }
  }
}

/** Gera o SVG do papel de parede (arte original: cores + padrão + nome). */
export function gerarSvg(t: Time, w: number, h: number): string {
  const m = Math.min(w, h);
  const fs = Math.round(Math.min(m * 0.13, (w * 0.86) / (t.nome.length * 0.74)));
  const y = h * 0.82;
  const base = t.cores[0];
  const claro = luminancia(base) > 0.6;
  const txt = '#FFFFFF';
  const sombra = claro ? 0.75 : 0.45;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">` +
    fundo(t, w, h) +
    `<defs><linearGradient id="s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="${sombra}"/></linearGradient></defs>` +
    `<rect x="0" y="${h * 0.6}" width="${w}" height="${h * 0.4}" fill="url(#s)"/>` +
    `<text x="${w / 2}" y="${y}" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-weight="900" font-size="${fs}" fill="${txt}" letter-spacing="${fs * 0.04}">${t.nome.toUpperCase()}</text>` +
    `<text x="${w / 2}" y="${y + fs * 0.75}" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="${Math.round(fs * 0.32)}" fill="${txt}" fill-opacity="0.85" letter-spacing="${fs * 0.08}">SÉRIE A 2026 · ${t.uf}</text>` +
    `</svg>`;
}
