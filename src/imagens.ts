// Web: imagens servidas de public/papeis (o app nativo usa imagens.native.ts, gerado).
export const fonteMini = (id: string, e: string) => ({ uri: `/papeis/${id}/${e}-mini.webp` });
export const fonteGrande = fonteMini; // na web a prévia usa a miniatura (leve)
export const original = (id: string, e: string): string => `/papeis/${id}/${e}.jpg`;
