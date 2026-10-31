import { Alert, Platform } from 'react-native';
import type { Time } from './times';
import { gerarSvg, type Tamanho } from './arte';

/** Web: desenha o SVG num canvas no tamanho pedido e baixa PNG. */
export async function baixarPng(t: Time, tam: Tamanho): Promise<void> {
  if (Platform.OS !== 'web') {
    Alert.alert('Baixar', 'No v1, o download é pela versão web (abra o link no navegador).');
    return;
  }
  const svg = gerarSvg(t, tam.w, tam.h);
  const url = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  const img = new (globalThis as any).Image() as HTMLImageElement;
  img.width = tam.w;
  img.height = tam.h;
  await new Promise<void>((ok, erro) => { img.onload = () => ok(); img.onerror = erro; img.src = url; });
  const canvas = document.createElement('canvas');
  canvas.width = tam.w;
  canvas.height = tam.h;
  canvas.getContext('2d')!.drawImage(img, 0, 0, tam.w, tam.h);
  const blob: Blob = await new Promise((ok) => canvas.toBlob((b) => ok(b!), 'image/png'));
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `${t.id}-${tam.w}x${tam.h}.png`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 5000);
}

/**
 * Web: baixa o papel de parede no tamanho pedido a partir da imagem original 1080x2400.
 * Mesmo formato (1080x2400): arquivo direto. Outros tamanhos: canvas com a imagem inteira
 * centralizada ("contain") sobre uma cópia ampliada e desfocada dela mesma (sem cortar escudo/título).
 */
export async function baixarImagem(url: string, tam: Tamanho, nome: string): Promise<void> {
  if (Platform.OS !== 'web') {
    Alert.alert('Baixar', 'No v1, o download é pela versão web (abra o link no navegador).');
    return;
  }
  const img = new (globalThis as any).Image() as HTMLImageElement;
  img.crossOrigin = 'anonymous';
  await new Promise<void>((ok, erro) => { img.onload = () => ok(); img.onerror = erro; img.src = url; });
  const canvas = document.createElement('canvas');
  canvas.width = tam.w;
  canvas.height = tam.h;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingQuality = 'high';
  const iw = img.naturalWidth, ih = img.naturalHeight;
  const cover = Math.max(tam.w / iw, tam.h / ih), contain = Math.min(tam.w / iw, tam.h / ih);
  if (Math.abs(tam.w / tam.h - iw / ih) > 0.01) {
    ctx.filter = 'blur(40px) brightness(0.55)';
    const cw = iw * cover * 1.1, ch = ih * cover * 1.1;
    ctx.drawImage(img, (tam.w - cw) / 2, (tam.h - ch) / 2, cw, ch);
    ctx.filter = 'none';
  }
  const w = iw * contain, h = ih * contain;
  ctx.drawImage(img, (tam.w - w) / 2, (tam.h - h) / 2, w, h);
  const blob: Blob = await new Promise((ok) => canvas.toBlob((b) => ok(b!), 'image/jpeg', 0.92));
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `${nome}-${tam.w}x${tam.h}.jpg`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 5000);
}
