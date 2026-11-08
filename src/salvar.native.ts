// App nativo (Android): grava o original 1080x2400 na Galeria.
// No APK de release o asset chega como nome de drawable, não como arquivo.
// Sem copiar para file://, a Galeria não recebe a imagem.
import { Asset as Arquivo } from 'expo-asset';
import { Asset as Midia, requestPermissionsAsync } from 'expo-media-library';
import { uriArquivoLocal } from './uri-arquivo';

export async function salvarNaGaleria(modulo: number): Promise<void> {
  const [arq] = await Arquivo.loadAsync(modulo);
  let uri = uriArquivoLocal(arq.localUri);
  if (!uri) {
    arq.downloaded = false;
    arq.localUri = null;
    await arq.downloadAsync();
    uri = uriArquivoLocal(arq.localUri);
  }
  if (!uri) throw new Error('arquivo indisponível');
  const { granted } = await requestPermissionsAsync(true, ['photo']);
  if (!granted) throw new Error('sem permissão');
  await Midia.create(uri);
}
