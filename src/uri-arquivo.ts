/**
 * No APK, o `require` da imagem vira um id de drawable (sem ":"), e o expo-asset
 * marca isso como já baixado. A Galeria só abre arquivo `file://` de verdade.
 * `file:///android_res/` também não é um arquivo legível pelo MediaStore.
 */
export function uriArquivoLocal(uri: string | null | undefined): string | null {
  if (!uri || !uri.startsWith('file://') || uri.startsWith('file:///android_res/')) return null;
  return uri;
}

/** Texto da tela quando salvar na Galeria falha. */
export function mensagemFalhaGaleria(erro: unknown): string {
  const m = erro instanceof Error ? erro.message : '';
  if (m === 'sem permissão') return 'Sem permissão para a Galeria. Ative o acesso às fotos e tente de novo.';
  if (m === 'arquivo indisponível') return 'Não deu certo. A imagem não pôde ser preparada para a Galeria.';
  return 'Não deu certo. Tente de novo.';
}
