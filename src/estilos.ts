// Estilos "trabalhados" de papel de parede (inspirados nas referências do Paulo,
// sem copiar nada): escudo ORIGINAL (escudo-foto.ts) + fundos gerados por código.
// Fontes: Google Fonts livres (Anton, Bebas Neue, Permanent Marker, Black Ops One).
import type { Time } from './times';
import { escudoFotoG } from './escudo-foto';
import { estrela } from './escudo';

export type Estilo = 'asas' | 'torcida' | 'chuva' | 'colagem' | 'neon' | 'metal';
export const ESTILOS: Estilo[] = ['asas', 'torcida', 'chuva', 'colagem', 'neon', 'metal'];

// ---- utilidades de cor ----
function rgb(hex: string) { const n = parseInt(hex.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; }
function hex(r: number, g: number, b: number) { return '#' + [r, g, b].map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join(''); }
function sat(c: string) { const [r, g, b] = rgb(c); const mx = Math.max(r, g, b), mn = Math.min(r, g, b); return mx === 0 ? 0 : (mx - mn) / mx; }
function escurecer(c: string, k: number) { const [r, g, b] = rgb(c); return hex(r * k, g * k, b * k); }
/** Cor "viva" do time (a mais saturada); null se o time é só preto/branco. */
function corViva(t: Time): string | null {
  const c = [...t.cores].sort((a, b) => sat(b) - sat(a))[0];
  return sat(c) < 0.2 ? null : c;
}

// Se definido, o centro usa a imagem do escudo OFICIAL (href/data URI) no lugar do nosso brasão.
// Uso pessoal/prévia: escudo oficial é marca registrada (ver assets/escudos/FONTES.md).
let oficialAtual: string | null = null;
function centro(t: Time, x: number, y: number, s: number, id: string): string {
  if (!oficialAtual) return escudoFotoG(t, x, y, s, id);
  const fid = `of-${id}`;
  return `<defs><filter id="${fid}" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="${f(s * 0.025)}" stdDeviation="${f(s * 0.03)}" flood-color="#000" flood-opacity="0.75"/></filter></defs>` +
    `<image x="${f(x + s * 0.03)}" y="${f(y)}" width="${f(s * 0.94)}" height="${f(s * 1.0)}" preserveAspectRatio="xMidYMid meet" href="${oficialAtual}" filter="url(#${fid})"/>`;
}

function rng(seed: number) {
  let s = seed >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}
const f = (n: number) => n.toFixed(1);

const GRAO = `<filter id="st-grao" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.8" seed="5"/><feColorMatrix values="0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 0.1 0"/></filter>`;
const GRUNGE = (op: number) => `<filter id="st-grunge" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.011" numOctaves="5" seed="21"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -1.6 0 0 0 ${op}"/></filter>` +
  `<filter id="st-risco" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.004 0.35" numOctaves="2" seed="8"/><feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  2.2 0 0 0 -1.35"/></filter>`;
const VIN = `<radialGradient id="st-vin" cx="0.5" cy="0.45" r="0.75"><stop offset="0.5" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.8"/></radialGradient>`;
const acabamento = (w: number, h: number) => `<rect width="${w}" height="${h}" fill="url(#st-vin)"/><rect width="${w}" height="${h}" filter="url(#st-grao)"/>`;

function titulo(t: Time, w: number, y: number, fonte: string, fs: number, cor: string, extra = '') {
  return `<text x="${w / 2}" y="${y}" text-anchor="middle" font-family="${fonte}" font-size="${fs}" fill="${cor}" letter-spacing="${fs * 0.03}" ${extra}>${t.nome.toUpperCase()}</text>`;
}

// ---------- 1) ASAS + metade/metade (grunge) ----------
function asa(lado: 1 | -1, cx: number, cy: number, s: number, cores: [string, string]) {
  let g = '';
  const camadas = [{ n: 10, L: 1.0, wd: 0.13 }, { n: 9, L: 0.74, wd: 0.12 }, { n: 7, L: 0.5, wd: 0.11 }, { n: 5, L: 0.3, wd: 0.1 }];
  camadas.forEach((c, ci) => {
    for (let i = 0; i < c.n; i++) {
      const a = (-58 + (i / (c.n - 1)) * 70) * Math.PI / 180; // ângulo do leque
      const L = s * c.L * (1 - i * 0.045), wd = s * c.wd;
      const ex = Math.cos(a) * L, ey = Math.sin(a) * L;
      // pena: gota alongada da raiz até a ponta
      const nx = -Math.sin(a) * wd, ny = Math.cos(a) * wd;
      const d = `M0,0 Q${f(ex * 0.5 + nx)},${f(ey * 0.5 + ny)} ${f(ex)},${f(ey)} Q${f(ex * 0.55 - nx * 0.4)},${f(ey * 0.55 - ny * 0.4)} 0,0 Z`;
      const cor = cores[(i + ci) % 2];
      g += `<path d="${d}" fill="${cor}" stroke="#000" stroke-opacity="0.6" stroke-width="${s * 0.006}"/><path d="M0,0 L${f(ex * 0.92)},${f(ey * 0.92)}" stroke="#FFF" stroke-opacity="0.22" stroke-width="${s * 0.004}"/>`;
    }
  });
  return `<g transform="translate(${cx} ${cy}) scale(${lado} 1)" filter="url(#st-asa)">${g}</g>`;
}
function estiloAsas(t: Time, w: number, h: number) {
  const viva = corViva(t);
  const c0 = viva ?? '#D8D8D8', c1 = viva ? escurecer(viva, 0.6) : '#9A9A9A';
  const s = w * 0.58, ex = (w - s) / 2, ey = h * 0.42 - s * 0.55;
  const asaS = w * 0.56;
  return `<defs>${GRUNGE(0.95)}${GRAO}${VIN}` +
    `<filter id="st-asa" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="6" stdDeviation="8" flood-opacity="0.7"/></filter>` +
    `<linearGradient id="st-lz" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF" stop-opacity="0.18"/><stop offset="0.5" stop-color="#FFF" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.5"/></linearGradient></defs>` +
    `<rect width="${w / 2}" height="${h}" fill="${c0}"/><rect x="${w / 2}" width="${w / 2}" height="${h}" fill="#0B0B0B"/>` +
    `<rect width="${w}" height="${h}" filter="url(#st-grunge)"/><rect width="${w}" height="${h}" filter="url(#st-risco)" opacity="0.25"/>` +
    `<rect width="${w}" height="${h}" fill="url(#st-lz)"/>` +
    asa(-1, w / 2 - s * 0.25, ey + s * 0.5, asaS, ['#0B0B0B', '#262626']) +
    asa(1, w / 2 + s * 0.25, ey + s * 0.5, asaS, [c0, c1]) +
    (oficialAtual ? '' : estrela(w / 2, ey - w * 0.07, w * 0.055, '#E8C35A')) +
    centro(t, ex, ey, s, `${t.id}-asas`) +
    titulo(t, w, h * 0.73, 'Anton', w * 0.15, '#FFFFFF', `filter="url(#st-asa)"`) +
    acabamento(w, h);
}

// ---------- 2) TORCIDA em silhueta + fumaça + tochas ----------
function estiloTorcida(t: Time, w: number, h: number) {
  const r = rng(77), cor = corViva(t) ?? '#8A8A8A';
  const [cr, cg, cb] = rgb(cor).map((v) => (v / 255).toFixed(2));
  let povo = '', bracos = '', tochas = '', bandeiras = '';
  for (let fila = 0; fila < 4; fila++) {
    const y0 = h * (0.68 + fila * 0.075), esc = 1.0 + fila * 0.45;
    for (let x = -30; x < w + 30; x += 34 * esc) {
      const cx = x + r() * 20, cy = y0 + r() * 30, rr = 22 * esc;
      povo += `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(rr)}"/><rect x="${f(cx - rr * 1.5)}" y="${f(cy + rr * 0.8)}" width="${f(rr * 3)}" height="${h}" rx="${f(rr)}"/>`;
      if (r() < 0.35) {
        const ang = -25 + r() * 50, L = rr * (4 + r() * 2.5);
        bracos += `<rect x="${f(cx - rr * 0.35)}" y="${f(cy - L)}" width="${f(rr * 0.7)}" height="${f(L)}" rx="${f(rr * 0.35)}" transform="rotate(${f(ang)} ${f(cx)} ${f(cy)})"/>` +
          `<circle cx="${f(cx)}" cy="${f(cy - L)}" r="${f(rr * 0.5)}" transform="rotate(${f(ang)} ${f(cx)} ${f(cy)})"/>`;
      }
      if (fila === 1 && r() < 0.12) {
        const ty = cy - rr * 5;
        tochas += `<circle cx="${f(cx)}" cy="${f(ty)}" r="${f(rr * 4)}" fill="url(#st-fogo)"/><circle cx="${f(cx)}" cy="${f(ty)}" r="${f(rr * 0.6)}" fill="#FFF6D8"/>`;
      }
    }
  }
  for (let i = 0; i < 4; i++) {
    const bx = w * (0.05 + i * 0.27), by = h * (0.45 + (i % 2) * 0.06), bw = w * 0.45, bh = h * 0.16;
    bandeiras += `<path d="M${bx},${by} q${bw * 0.25},-${bh * 0.25} ${bw * 0.5},0 t${bw * 0.5},0 v${bh} q-${bw * 0.25},${bh * 0.2} -${bw * 0.5},0 t-${bw * 0.5},0 Z" fill="${i % 2 ? cor : '#0A0A0A'}" opacity="0.55"/>`;
  }
  const s = w * 0.62, ex = (w - s) / 2, ey = h * 0.3 - s * 0.4;
  return `<defs>${GRAO}${VIN}` +
    `<radialGradient id="st-ceu" cx="0.5" cy="0.35" r="0.8"><stop offset="0" stop-color="${cor}" stop-opacity="0.9"/><stop offset="0.6" stop-color="${escurecer(cor, 0.28)}"/><stop offset="1" stop-color="${escurecer(cor, 0.05)}"/></radialGradient>` +
    `<radialGradient id="st-fogo" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#FFE7A0" stop-opacity="0.95"/><stop offset="0.25" stop-color="#FF6A1A" stop-opacity="0.6"/><stop offset="1" stop-color="#FF2A00" stop-opacity="0"/></radialGradient>` +
    `<filter id="st-fumaca" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.0035 0.006" numOctaves="5" seed="13"/><feColorMatrix values="0 0 0 0 ${cr}  0 0 0 0 ${cg}  0 0 0 0 ${cb}  1.7 0 0 0 -0.55"/><feGaussianBlur stdDeviation="6"/></filter>` +
    `<filter id="st-desf"><feGaussianBlur stdDeviation="14"/></filter><filter id="st-desf2"><feGaussianBlur stdDeviation="3"/></filter>` +
    `<filter id="st-sb" x="-20%" y="-30%" width="140%" height="160%"><feDropShadow dx="0" dy="6" stdDeviation="10" flood-opacity="0.9"/></filter></defs>` +
    `<rect width="${w}" height="${h}" fill="url(#st-ceu)"/>` +
    `<g filter="url(#st-desf)">${bandeiras}</g>` +
    `<rect width="${w}" height="${h}" filter="url(#st-fumaca)" opacity="0.85"/>` +
    `<g filter="url(#st-desf2)">${tochas}</g>` +
    `<g fill="#050102" filter="url(#st-desf2)">${bracos}${povo}</g>` +
    `<g>${tochas}</g>` +
    centro(t, ex, ey, s, `${t.id}-torc`) +
    titulo(t, w, ey + s * 1.02 + w * 0.17, 'Bebas Neue', w * 0.19, '#FFFFFF', `filter="url(#st-sb)"`) +
    acabamento(w, h);
}

// ---------- 3) VIDRO COM CHUVA ----------
function estiloChuva(t: Time, w: number, h: number) {
  const r = rng(303);
  let bokeh = '', gotas = '', escorrer = '';
  for (let i = 0; i < 40; i++) bokeh += `<circle cx="${f(r() * w)}" cy="${f(r() * h)}" r="${f(30 + r() * 110)}" fill="${r() < 0.5 ? '#FFFFFF' : '#9AA6B2'}" opacity="${(0.06 + r() * 0.16).toFixed(2)}"/>`;
  for (let i = 0; i < 420; i++) {
    const gx = r() * w, gy = r() * h, rr = 3 + Math.pow(r(), 3) * 26, ry = rr * (1 + r() * 0.35);
    gotas += `<g transform="translate(${f(gx)} ${f(gy)})"><ellipse rx="${f(rr)}" ry="${f(ry)}" fill="url(#st-gota)"/>` +
      `<ellipse cx="${f(-rr * 0.3)}" cy="${f(-ry * 0.4)}" rx="${f(rr * 0.28)}" ry="${f(ry * 0.18)}" fill="#FFF" opacity="0.85"/></g>`;
  }
  for (let i = 0; i < 26; i++) {
    const x = r() * w, y = r() * h * 0.7, L = h * (0.08 + r() * 0.25), lw = 3 + r() * 7;
    let d = `M${f(x)},${f(y)}`;
    for (let k = 1; k <= 8; k++) d += ` L${f(x + (r() - 0.5) * 14)},${f(y + (L * k) / 8)}`;
    escorrer += `<path d="${d}" fill="none" stroke="url(#st-trilha)" stroke-width="${f(lw)}" stroke-linecap="round"/>` +
      `<ellipse cx="${f(x)}" cy="${f(y + L)}" rx="${f(lw * 1.6)}" ry="${f(lw * 2.1)}" fill="url(#st-gota)"/>`;
  }
  const s = w * 0.8, ex = (w - s) / 2, ey = h * 0.42 - s * 0.55;
  return `<defs>${GRAO}${VIN}` +
    `<linearGradient id="st-fundo" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#D9DDE0"/><stop offset="0.5" stop-color="#7D868E"/><stop offset="1" stop-color="#2B3036"/></linearGradient>` +
    `<radialGradient id="st-gota" cx="0.42" cy="0.35" r="0.65"><stop offset="0" stop-color="#FFFFFF" stop-opacity="0.25"/><stop offset="0.6" stop-color="#FFFFFF" stop-opacity="0.05"/><stop offset="0.85" stop-color="#000" stop-opacity="0.35"/><stop offset="1" stop-color="#000" stop-opacity="0.6"/></radialGradient>` +
    `<linearGradient id="st-trilha" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#000" stop-opacity="0.35"/><stop offset="0.5" stop-color="#FFF" stop-opacity="0.35"/><stop offset="1" stop-color="#000" stop-opacity="0.3"/></linearGradient>` +
    `<filter id="st-desf"><feGaussianBlur stdDeviation="22"/></filter>` +
    `<filter id="st-vapor" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.006" numOctaves="4" seed="2"/><feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0.9 0 0 0 -0.25"/></filter>` +
    `<filter id="st-vidro" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="2" seed="6" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="14" xChannelSelector="R" yChannelSelector="G"/></filter></defs>` +
    `<rect width="${w}" height="${h}" fill="url(#st-fundo)"/><g filter="url(#st-desf)">${bokeh}</g>` +
    `<g filter="url(#st-vidro)">${centro(t, ex, ey, s, `${t.id}-chuva`)}</g>` +
    `<rect width="${w}" height="${h}" filter="url(#st-vapor)" opacity="0.28"/>` +
    escorrer + gotas +
    titulo(t, w, h * 0.78, 'Oswald', w * 0.12, '#FFFFFF', `font-weight="700" opacity="0.92"`) +
    acabamento(w, h);
}

// ---------- 4) COLAGEM P&B com respingos ----------
function estiloColagem(t: Time, w: number, h: number) {
  const r = rng(909);
  const palavras = [t.nome.toUpperCase(), 'GIGANTE', t.uf, 'TORCIDA', 'RAÇA', 'FÉ', 'SEMPRE', 'AMOR'];
  let blocos = '', textos = '', respingos = '';
  for (let i = 0; i < 14; i++) {
    const bw = w * (0.3 + r() * 0.5), bh = h * (0.08 + r() * 0.16), bx = r() * w - bw * 0.3, by = r() * h - bh * 0.3, rot = (r() - 0.5) * 16;
    const tipo = i % 3;
    const fill = tipo === 0 ? 'url(#st-pontos)' : tipo === 1 ? 'url(#st-listras)' : (r() < 0.5 ? '#F2F2F2' : '#1A1A1A');
    blocos += `<rect x="${f(bx)}" y="${f(by)}" width="${f(bw)}" height="${f(bh)}" fill="${fill}" transform="rotate(${f(rot)} ${f(bx + bw / 2)} ${f(by + bh / 2)})" filter="url(#st-rasgo)"/>`;
  }
  for (let i = 0; i < 12; i++) {
    const p = palavras[i % palavras.length], fs = w * (0.08 + r() * 0.16), rot = r() < 0.3 ? -90 : (r() - 0.5) * 10;
    const x = r() * w, y = r() * h, claro = r() < 0.6;
    const fonte = i % 2 ? 'Black Ops One' : 'Anton';
    textos += `<text x="${f(x)}" y="${f(y)}" font-family="${fonte}" font-size="${f(fs)}" text-anchor="middle" transform="rotate(${f(rot)} ${f(x)} ${f(y)})" ` +
      (r() < 0.5 ? `fill="${claro ? '#F4F4F4' : '#0C0C0C'}" opacity="0.9"` : `fill="none" stroke="#F4F4F4" stroke-width="${f(fs * 0.025)}" opacity="0.8"`) + `>${p}</text>`;
  }
  for (let k = 0; k < 7; k++) {
    const cx = r() * w, cy = r() * h, R = w * (0.05 + r() * 0.12), cor = k === 3 && corViva(t) ? corViva(t)! : k % 2 ? '#FFFFFF' : '#050505';
    let g = `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(R)}"/>`;
    for (let i = 0; i < 26; i++) {
      const a = r() * Math.PI * 2, dist = R * (0.9 + r() * 1.8), rr = R * (0.04 + r() * 0.16);
      g += `<circle cx="${f(cx + Math.cos(a) * dist)}" cy="${f(cy + Math.sin(a) * dist)}" r="${f(rr)}"/>`;
      if (r() < 0.4) g += `<line x1="${f(cx)}" y1="${f(cy)}" x2="${f(cx + Math.cos(a) * dist)}" y2="${f(cy + Math.sin(a) * dist)}" stroke="${cor}" stroke-width="${f(rr * 0.7)}" stroke-linecap="round"/>`;
    }
    respingos += `<g fill="${cor}" filter="url(#st-tinta)" opacity="0.9">${g}</g>`;
  }
  const s = w * 0.74, ex = (w - s) / 2, ey = h * 0.4 - s * 0.55;
  return `<defs>${GRAO}${VIN}${GRUNGE(0.9)}` +
    `<pattern id="st-pontos" width="18" height="18" patternUnits="userSpaceOnUse" patternTransform="rotate(30)"><rect width="18" height="18" fill="#111"/><circle cx="9" cy="9" r="5" fill="#E8E8E8"/></pattern>` +
    `<pattern id="st-listras" width="40" height="40" patternUnits="userSpaceOnUse" patternTransform="rotate(-35)"><rect width="40" height="40" fill="#F0F0F0"/><rect width="20" height="40" fill="#0D0D0D"/></pattern>` +
    `<filter id="st-rasgo" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" seed="4" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="26" xChannelSelector="R" yChannelSelector="G" result="d"/><feDropShadow dx="4" dy="6" stdDeviation="6" flood-opacity="0.7"/></filter>` +
    `<filter id="st-tinta" x="-50%" y="-50%" width="200%" height="200%"><feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" seed="12" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="22" xChannelSelector="R" yChannelSelector="G"/></filter>` +
    `<filter id="st-pb"><feColorMatrix type="saturate" values="0"/></filter>` +
    `<filter id="st-sb" x="-20%" y="-30%" width="140%" height="160%"><feDropShadow dx="0" dy="8" stdDeviation="8" flood-opacity="0.95"/></filter></defs>` +
    `<rect width="${w}" height="${h}" fill="#0A0A0A"/>` +
    `<g filter="url(#st-pb)">${blocos}${textos}</g>` +
    `<rect width="${w}" height="${h}" filter="url(#st-grunge)"/>` +
    respingos +
    `<g filter="url(#st-sb)">${centro(t, ex, ey, s, `${t.id}-col`)}</g>` +
    `<g filter="url(#st-sb)"><rect x="${w * 0.04}" y="${h * 0.7}" width="${w * 0.92}" height="${w * 0.28}" fill="#F4F4F4" transform="rotate(-3 ${w / 2} ${h * 0.75})" filter="url(#st-rasgo)"/>` +
    titulo(t, w, h * 0.7 + w * 0.235, 'Anton', Math.min(w * 0.24, (w * 0.84) / (t.nome.length * 0.5)), '#0A0A0A', `transform="rotate(-3 ${w / 2} ${h * 0.75})"`) + `</g>` +
    `<text x="${w * 0.5}" y="${h * 0.86}" text-anchor="middle" font-family="Permanent Marker" font-size="${w * 0.07}" fill="#FFFFFF" transform="rotate(-4 ${w / 2} ${h * 0.86})">nossa história, nossa torcida</text>` +
    acabamento(w, h);
}

// ---------- 5) NEON + cidade à noite ----------
function estiloNeon(t: Time, w: number, h: number) {
  const r = rng(515), neon = corViva(t) ?? '#DDEBFF', neon2 = t.cores.find((c) => c !== neon && sat(c) > 0.2) ?? '#FFFFFF';
  let predios = '', janelas = '';
  const base = h * 0.8;
  for (let x = -20; x < w + 20;) {
    const bw = 60 + r() * 120, bh = h * (0.08 + r() * 0.26);
    predios += `<rect x="${f(x)}" y="${f(base - bh)}" width="${f(bw)}" height="${f(bh)}"/>`;
    for (let wy = base - bh + 20; wy < base - 14; wy += 26) for (let wx = x + 10; wx < x + bw - 14; wx += 22)
      if (r() < 0.32) janelas += `<rect x="${f(wx)}" y="${f(wy)}" width="9" height="12" fill="${r() < 0.7 ? '#FFD98A' : neon}" opacity="${(0.4 + r() * 0.5).toFixed(2)}"/>`;
    x += bw + 4;
  }
  const s = w * 0.62, ex = (w - s) / 2, ey = h * 0.36 - s * 0.5, cx = w / 2, cy = ey + s * 0.5, R = s * 0.66;
  const tubo = (cor: string, rr: number) =>
    `<circle cx="${cx}" cy="${cy}" r="${rr}" fill="none" stroke="${cor}" stroke-width="40" opacity="0.35" filter="url(#st-n40)"/>` +
    `<circle cx="${cx}" cy="${cy}" r="${rr}" fill="none" stroke="${cor}" stroke-width="16" opacity="0.8" filter="url(#st-n10)"/>` +
    `<circle cx="${cx}" cy="${cy}" r="${rr}" fill="none" stroke="#FFFFFF" stroke-width="5"/>`;
  return `<defs>${GRAO}${VIN}` +
    `<linearGradient id="st-noite" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#05030F"/><stop offset="0.6" stop-color="${escurecer(neon, 0.22)}"/><stop offset="0.8" stop-color="#0A0614"/><stop offset="1" stop-color="#020104"/></linearGradient>` +
    `<filter id="st-n40" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="34"/></filter>` +
    `<filter id="st-n10" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="9"/></filter>` +
    `<filter id="st-ref" x="0" y="0" width="100%" height="100%"><feGaussianBlur stdDeviation="6 16"/></filter>` +
    `<linearGradient id="st-chao" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF" stop-opacity="0.45"/><stop offset="1" stop-color="#FFF" stop-opacity="0"/></linearGradient>` +
    `<mask id="st-mchao"><rect x="0" y="${base}" width="${w}" height="${h - base}" fill="url(#st-chao)"/></mask></defs>` +
    `<rect width="${w}" height="${h}" fill="url(#st-noite)"/>` +
    // grade de chão em perspectiva
    Array.from({ length: 16 }, (_, i) => `<line x1="${w / 2}" y1="${base}" x2="${f(-w + (i * 3 * w) / 15)}" y2="${h}" stroke="${neon}" stroke-width="2" opacity="0.35"/>`).join('') +
    Array.from({ length: 8 }, (_, i) => { const y = base + (h - base) * Math.pow((i + 1) / 8, 1.8); return `<line x1="0" y1="${f(y)}" x2="${w}" y2="${f(y)}" stroke="${neon}" stroke-width="2" opacity="0.3"/>`; }).join('') +
    `<g fill="#06040C">${predios}</g>${janelas}` +
    `<g mask="url(#st-mchao)" filter="url(#st-ref)"><g transform="translate(0 ${2 * base}) scale(1 -1)"><g fill="#06040C">${predios}</g>${janelas}</g></g>` +
    tubo(neon, R) + tubo(neon2, R * 1.1) +
    centro(t, ex, ey, s, `${t.id}-neon`) +
    `<text x="${w / 2}" y="${h * 0.7}" text-anchor="middle" font-family="Monoton" font-size="${f(Math.min(w * 0.14, (w * 0.9) / (t.nome.length * 0.9)))}" fill="${neon}" filter="url(#st-n10)">${t.nome.toUpperCase()}</text>` +
    `<text x="${w / 2}" y="${h * 0.7}" text-anchor="middle" font-family="Monoton" font-size="${f(Math.min(w * 0.14, (w * 0.9) / (t.nome.length * 0.9)))}" fill="#FFFFFF">${t.nome.toUpperCase()}</text>` +
    acabamento(w, h);
}

// ---------- 6) METAL: placa de aço escovado, raios de luz e faixa nas cores ----------
function estiloMetal(t: Time, w: number, h: number) {
  const viva = corViva(t) ?? '#1A1A1A', seg = t.cores.find((c) => c !== viva) ?? '#FFFFFF';
  const s = w * 0.66, ex = (w - s) / 2, ey = h * 0.4 - s * 0.55;
  const raios = Array.from({ length: 13 }, (_, i) => {
    const a = (60 + i * 5) * Math.PI / 180, L = h * 1.2, ox = w / 2, oy = -h * 0.05, d = 0.9 * Math.PI / 180;
    return `<polygon points="${ox},${oy} ${f(ox + Math.cos(a - d) * L)},${f(oy + Math.sin(a - d) * L)} ${f(ox + Math.cos(a + d) * L)},${f(oy + Math.sin(a + d) * L)}" fill="#FFF" opacity="${i % 2 ? 0.07 : 0.13}"/>`;
  }).join('');
  const rebite = (x: number, y: number) => `<circle cx="${x}" cy="${y}" r="16" fill="url(#st-reb)" stroke="#2A2A2A" stroke-width="2"/>`;
  const m = 60;
  return `<defs>${GRAO}${VIN}` +
    `<linearGradient id="st-aco" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#9DA3A8"/><stop offset="0.35" stop-color="#5E646A"/><stop offset="0.55" stop-color="#C9CED2"/><stop offset="0.8" stop-color="#4A4F54"/><stop offset="1" stop-color="#2B2F33"/></linearGradient>` +
    `<radialGradient id="st-reb" cx="0.35" cy="0.3" r="0.7"><stop offset="0" stop-color="#F2F4F5"/><stop offset="0.5" stop-color="#8B9196"/><stop offset="1" stop-color="#2E3236"/></radialGradient>` +
    `<filter id="st-escov" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.002 0.9" numOctaves="3" seed="31"/><feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.22 0"/></filter>` +
    `<filter id="st-raio" filterUnits="userSpaceOnUse" x="0" y="0" width="${w}" height="${h}"><feGaussianBlur stdDeviation="18"/></filter>` +
    `<filter id="st-gravado" x="-10%" y="-30%" width="120%" height="160%"><feOffset dx="0" dy="3" in="SourceAlpha" result="o"/><feFlood flood-color="#FFF" flood-opacity="0.5"/><feComposite in2="o" operator="in" result="lz"/><feMerge><feMergeNode in="lz"/><feMergeNode in="SourceGraphic"/></feMerge></filter>` +
    `<filter id="st-sb" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="14" stdDeviation="16" flood-opacity="0.75"/></filter></defs>` +
    `<rect width="${w}" height="${h}" fill="url(#st-aco)"/><rect width="${w}" height="${h}" filter="url(#st-escov)"/>` +
    `<g filter="url(#st-raio)">${raios}</g>` +
    // faixa diagonal nas cores do time
    `<g opacity="0.9" filter="url(#st-sb)"><polygon points="0,${h * 0.48} ${w},${h * 0.3} ${w},${h * 0.42} 0,${h * 0.6}" fill="${viva}"/>` +
    `<polygon points="0,${h * 0.6} ${w},${h * 0.42} ${w},${h * 0.445} 0,${h * 0.625}" fill="${seg}"/></g>` +
    // moldura da placa
    `<rect x="${m}" y="${m}" width="${w - 2 * m}" height="${h - 2 * m}" rx="40" fill="none" stroke="#1E2125" stroke-width="6" opacity="0.7"/>` +
    `<rect x="${m + 6}" y="${m + 6}" width="${w - 2 * m - 12}" height="${h - 2 * m - 12}" rx="36" fill="none" stroke="#FFF" stroke-width="2" opacity="0.35"/>` +
    rebite(m + 50, m + 50) + rebite(w - m - 50, m + 50) + rebite(m + 50, h - m - 50) + rebite(w - m - 50, h - m - 50) +
    `<g filter="url(#st-sb)">${centro(t, ex, ey, s, `${t.id}-metal`)}</g>` +
    `<text x="${w / 2}" y="${h * 0.8}" text-anchor="middle" font-family="Cinzel" font-weight="700" font-size="${f(Math.min(w * 0.14, (w * 0.84) / (t.nome.length * 0.78)))}" fill="#0E1012" letter-spacing="6" filter="url(#st-gravado)">${t.nome.toUpperCase()}</text>` +
    acabamento(w, h);
}

/** Papel de parede no estilo escolhido. */
export function gerarSvgEstilo(t: Time, estilo: Estilo, w: number, h: number, escudoOficial?: string): string {
  oficialAtual = escudoOficial ?? null;
  const corpo = { asas: estiloAsas, torcida: estiloTorcida, chuva: estiloChuva, colagem: estiloColagem, neon: estiloNeon, metal: estiloMetal }[estilo](t, w, h);
  oficialAtual = null;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${corpo}</svg>`;
}
