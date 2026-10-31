// Versão "foto" do escudo ORIGINAL: mesmo brasão de escudo.ts, com acabamento
// fotorrealista feito só com filtros SVG (luz especular, bevel, ruído, desfoque).
// Sem logos oficiais, sem cópia de escudos reais, sem fotos.
import type { Time } from './times';
import { SIGLAS, FORMA, campo, lum, estrela } from './escudo';

const FONTE = 'Arial, Helvetica, DejaVu Sans, sans-serif';

// pseudo-aleatório determinístico (mesma imagem sempre)
function rng(seed: number) {
  let s = seed >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}
function semente(id: string) { let h = 7; for (const ch of id) h = (h * 31 + ch.charCodeAt(0)) >>> 0; return h; }

/** Escudo "foto" como <g>, canto sup. esquerdo (x,y), largura s. */
export function escudoFotoG(t: Time, x: number, y: number, s: number, id = t.id): string {
  const sigla = SIGLAS[t.id] ?? t.nome.slice(0, 3).toUpperCase();
  const escuro = [...t.cores].sort((a, b) => lum(a) - lum(b))[0];
  const meio = lum(escuro) > 0.35 ? '#111111' : escuro;
  const k = s / 100, p = `ef-${id}`;
  const bevel = (nome: string, blur: number, esc: number, exp: number) =>
    `<filter id="${p}-${nome}" x="-10%" y="-10%" width="120%" height="120%">` +
    `<feGaussianBlur in="SourceAlpha" stdDeviation="${blur}" result="b"/>` +
    `<feSpecularLighting in="b" surfaceScale="${esc}" specularConstant="1.1" specularExponent="${exp}" lighting-color="#FFFFFF" result="sp"><fePointLight x="20" y="-30" z="60"/></feSpecularLighting>` +
    `<feComposite in="sp" in2="SourceAlpha" operator="in" result="spi"/>` +
    `<feDiffuseLighting in="b" surfaceScale="${esc}" diffuseConstant="1" lighting-color="#FFFFFF" result="df"><feDistantLight azimuth="235" elevation="50"/></feDiffuseLighting>` +
    `<feComposite in="SourceGraphic" in2="df" operator="arithmetic" k1="1.15" k2="0" k3="0" k4="0" result="lit"/>` +
    `<feComposite in="lit" in2="spi" operator="arithmetic" k1="0" k2="1" k3="0.85" k4="0" result="o"/>` +
    `<feComposite in="o" in2="SourceAlpha" operator="in"/></filter>`;
  return `<g transform="translate(${x} ${y}) scale(${k})">` +
    `<defs>` +
    `<clipPath id="${p}-c"><path d="${FORMA}"/></clipPath>` +
    `<linearGradient id="${p}-ouro" x1="0" y1="0" x2="1" y2="1">` +
    `<stop offset="0" stop-color="#FFF4C4"/><stop offset="0.25" stop-color="#D9A93A"/><stop offset="0.5" stop-color="#7C5614"/>` +
    `<stop offset="0.7" stop-color="#F1CF6B"/><stop offset="1" stop-color="#8A6118"/></linearGradient>` +
    `<linearGradient id="${p}-brilho" x1="0" y1="0" x2="0.6" y2="1"><stop offset="0" stop-color="#FFF" stop-opacity="0.42"/><stop offset="0.45" stop-color="#FFF" stop-opacity="0.06"/><stop offset="1" stop-color="#000" stop-opacity="0.35"/></linearGradient>` +
    `<filter id="${p}-sombra" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="4"/></filter>` +
    `<filter id="${p}-esmalte" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="3"/><feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.10 0"/></filter>` +
    `<filter id="${p}-metalruido" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.02 1.4" numOctaves="2" seed="9"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.35 0"/></filter>` +
    `<mask id="${p}-aro"><path d="${FORMA}" fill="none" stroke="#FFF" stroke-width="8" stroke-linejoin="round"/></mask>` +
    bevel('bv', 1.6, 4, 22) + bevel('bvs', 0.6, 2.5, 28) +
    `<filter id="${p}-txt" x="-20%" y="-30%" width="140%" height="160%"><feDropShadow dx="0.6" dy="1" stdDeviation="0.6" flood-color="#000" flood-opacity="0.8"/></filter>` +
    `</defs>` +
    // sombra projetada
    `<path d="${FORMA}" transform="translate(3 6)" fill="#000" opacity="0.75" filter="url(#${p}-sombra)"/>` +
    // campo esmaltado
    `<g clip-path="url(#${p}-c)">${campo(t)}` +
    `<rect width="100" height="100" filter="url(#${p}-esmalte)"/>` +
    `<rect x="0" y="0" width="100" height="22" fill="${meio}"/>` +
    `<path d="M0,0 H100 V30 C70,40 30,36 0,52 Z" fill="#FFF" opacity="0.13"/>` +
    `<rect width="100" height="100" fill="url(#${p}-brilho)"/></g>` +
    // aro de metal com bevel e ruído escovado
    `<g filter="url(#${p}-bv)"><path d="${FORMA}" fill="none" stroke="url(#${p}-ouro)" stroke-width="8" stroke-linejoin="round"/></g>` +
    `<rect x="0" y="0" width="100" height="100" mask="url(#${p}-aro)" filter="url(#${p}-metalruido)"/>` +
    `<g filter="url(#${p}-bvs)"><rect x="9" y="21.6" width="82" height="2.2" fill="url(#${p}-ouro)"/>` +
    estrela(25, 16.2, 3.4, `url(#${p}-ouro)`) + estrela(75, 16.2, 3.4, `url(#${p}-ouro)`) + `</g>` +
    `<text x="50" y="19.4" text-anchor="middle" font-family="${FONTE}" font-weight="700" font-size="8" fill="#F4F4F4" letter-spacing="1.2" filter="url(#${p}-txt)">${t.uf}</text>` +
    // medalhão
    `<circle cx="51" cy="57" r="22" fill="#000" opacity="0.5" filter="url(#${p}-sombra)"/>` +
    `<circle cx="50" cy="55" r="21" fill="${meio}"/>` +
    `<circle cx="50" cy="55" r="21" fill="url(#${p}-brilho)"/>` +
    `<g filter="url(#${p}-bv)"><circle cx="50" cy="55" r="20" fill="none" stroke="url(#${p}-ouro)" stroke-width="3.6"/></g>` +
    `<g filter="url(#${p}-bvs)"><text x="50" y="60.8" text-anchor="middle" font-family="${FONTE}" font-weight="900" font-size="15" fill="url(#${p}-ouro)" letter-spacing="0.6">${sigla}</text></g>` +
    // reflexo especular pontual
    `<ellipse cx="28" cy="14" rx="9" ry="2.2" fill="#FFF" opacity="0.55" transform="rotate(-12 28 14)" filter="url(#${p}-sombra)"/>` +
    `</g>`;
}

/** Fundo de estádio noturno desfocado (refletores, bokeh, torcida, gramado), vinheta e grão. */
function estadio(t: Time, w: number, h: number): string {
  const r = rng(semente(t.id));
  const cor = t.cores.find((c) => lum(c) > 0.12 && lum(c) < 0.85) ?? '#2A6B3A';
  const hor = h * 0.62; // linha do gramado
  let bokeh = '';
  for (let i = 0; i < 38; i++) {
    const bx = r() * w, by = h * 0.05 + r() * h * 0.5, br = (0.015 + r() * 0.05) * w;
    const c = r() < 0.45 ? cor : r() < 0.5 ? '#FFE9B0' : '#FFFFFF';
    bokeh += `<circle cx="${bx.toFixed(0)}" cy="${by.toFixed(0)}" r="${br.toFixed(0)}" fill="${c}" opacity="${(0.08 + r() * 0.22).toFixed(2)}"/>`;
  }
  let luzes = '';
  for (const lx of [0.12, 0.88]) {
    for (let i = 0; i < 12; i++) {
      const cx = w * lx + ((i % 4) - 1.5) * w * 0.035, cy = h * 0.1 + Math.floor(i / 4) * w * 0.035;
      luzes += `<circle cx="${cx}" cy="${cy}" r="${w * 0.012}" fill="#FFFFFF"/>`;
    }
  }
  const faixas = Array.from({ length: 12 }, (_, i) => {
    const y0 = hor + (h - hor) * Math.pow(i / 12, 1.6), y1 = hor + (h - hor) * Math.pow((i + 1) / 12, 1.6);
    return i % 2 ? `<rect x="0" y="${y0}" width="${w}" height="${y1 - y0 + 1}" fill="#000" opacity="0.14"/>` : '';
  }).join('');
  return `<defs>` +
    `<linearGradient id="bg-ceu" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#03060A"/><stop offset="0.45" stop-color="#0B1622"/><stop offset="0.62" stop-color="#1A2A22"/><stop offset="1" stop-color="#050805"/></linearGradient>` +
    `<linearGradient id="bg-gram" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2F7D3A"/><stop offset="0.5" stop-color="#1D5A26"/><stop offset="1" stop-color="#0B2410"/></linearGradient>` +
    `<radialGradient id="bg-glow" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#FFF6DA" stop-opacity="0.9"/><stop offset="0.3" stop-color="#FFE8A8" stop-opacity="0.35"/><stop offset="1" stop-color="#FFE8A8" stop-opacity="0"/></radialGradient>` +
    `<radialGradient id="bg-vin" cx="0.5" cy="0.47" r="0.72"><stop offset="0.45" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.85"/></radialGradient>` +
    `<radialGradient id="bg-spot" cx="0.5" cy="0.45" r="0.5"><stop offset="0" stop-color="${cor}" stop-opacity="0.45"/><stop offset="1" stop-color="${cor}" stop-opacity="0"/></radialGradient>` +
    `<linearGradient id="bg-mtg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF" stop-opacity="0"/><stop offset="0.35" stop-color="#FFF" stop-opacity="1"/><stop offset="1" stop-color="#FFF" stop-opacity="0.8"/></linearGradient>` +
    `<mask id="bg-mt"><rect x="0" y="${h * 0.3}" width="${w}" height="${hor - h * 0.3}" fill="url(#bg-mtg)"/></mask>` +
    `<filter id="bg-b30" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="${w * 0.012}"/></filter>` +
    `<filter id="bg-b8"><feGaussianBlur stdDeviation="${w * 0.006}"/></filter>` +
    `<filter id="bg-torcida" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.09 0.06" numOctaves="2" seed="${semente(t.id) % 97}"/>` +
    `<feColorMatrix values="1.4 0 0 0 -0.35  0 1.2 0 0 -0.35  0 0 1.3 0 -0.3  0 0 0 0 0.85"/><feGaussianBlur stdDeviation="${w * 0.008}"/></filter>` +
    `<filter id="bg-grama" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.6 0.05" numOctaves="2" seed="4"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0.15  0 0 0 0 0  0 0 0 0.45 0"/><feGaussianBlur stdDeviation="${w * 0.002}"/></filter>` +
    `<filter id="bg-grao" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="1" seed="11"/><feColorMatrix values="0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 0.09 0"/></filter>` +
    `</defs>` +
    `<rect width="${w}" height="${h}" fill="url(#bg-ceu)"/>` +
    // arquibancada / torcida desfocada
    `<rect x="0" y="${h * 0.3}" width="${w}" height="${hor - h * 0.3}" filter="url(#bg-torcida)" opacity="0.32" mask="url(#bg-mt)"/>` +
    `<rect x="0" y="${h * 0.3}" width="${w}" height="${hor - h * 0.3}" fill="${cor}" opacity="0.12" mask="url(#bg-mt)"/>` +
    // gramado com faixas de corte, desfocado
    `<g filter="url(#bg-b8)"><rect x="0" y="${hor}" width="${w}" height="${h - hor}" fill="url(#bg-gram)"/>${faixas}` +
    `<rect x="0" y="${hor}" width="${w}" height="${h - hor}" filter="url(#bg-grama)"/>` +
    `<rect x="0" y="${hor + (h - hor) * 0.18}" width="${w}" height="${w * 0.006}" fill="#FFF" opacity="0.35"/></g>` +
    // refletores + halo + bokeh
    `<g filter="url(#bg-b8)">${luzes}</g>` +
    `<circle cx="${w * 0.12}" cy="${h * 0.12}" r="${w * 0.33}" fill="url(#bg-glow)"/>` +
    `<circle cx="${w * 0.88}" cy="${h * 0.12}" r="${w * 0.33}" fill="url(#bg-glow)"/>` +
    `<g filter="url(#bg-b30)">${bokeh}</g>` +
    `<rect width="${w}" height="${h}" fill="url(#bg-spot)"/>`;
}

/** Papel de parede "foto": estádio desfocado + escudo grande no centro. */
export function gerarSvgFotoEscudo(t: Time, w: number, h: number): string {
  const m = Math.min(w, h);
  const s = m * (w < h ? 0.8 : 0.6);
  const ex = (w - s) / 2, ey = h * 0.44 - s * 0.55;
  const fs = Math.round(Math.min(m * 0.1, (w * 0.84) / (t.nome.length * 0.74)));
  const ty = ey + s + fs * 1.4;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">` +
    estadio(t, w, h) +
    `<ellipse cx="${w / 2}" cy="${ey + s * 1.02}" rx="${s * 0.38}" ry="${s * 0.05}" fill="#000" opacity="0.55" filter="url(#bg-b30)"/>` +
    escudoFotoG(t, ex, ey, s, `${t.id}-wp`) +
    `<defs><filter id="tx-s" x="-10%" y="-30%" width="120%" height="160%"><feDropShadow dx="0" dy="${fs * 0.05}" stdDeviation="${fs * 0.08}" flood-color="#000" flood-opacity="0.85"/></filter></defs>` +
    `<text x="${w / 2}" y="${ty}" text-anchor="middle" font-family="${FONTE}" font-weight="900" font-size="${fs}" fill="#FFFFFF" letter-spacing="${fs * 0.04}" filter="url(#tx-s)">${t.nome.toUpperCase()}</text>` +
    `<text x="${w / 2}" y="${ty + fs * 0.72}" text-anchor="middle" font-family="${FONTE}" font-weight="700" font-size="${Math.round(fs * 0.3)}" fill="#E8C35A" letter-spacing="${fs * 0.08}" filter="url(#tx-s)">SÉRIE A 2026 · ${t.uf}</text>` +
    `<rect width="${w}" height="${h}" fill="url(#bg-vin)"/>` +
    `<rect width="${w}" height="${h}" filter="url(#bg-grao)"/>` +
    `</svg>`;
}
