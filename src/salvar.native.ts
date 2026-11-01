// App nativo (Android): salva o original 1080x2400 embutido na galeria do aparelho.
import { Asset as Arquivo } from 'expo-asset';
import { Asset as Midia, requestPermissionsAsync } from 'expo-media-library';

export async function salvarNaGaleria(modulo: number): Promise<void> {
  const [arq] = await Arquivo.loadAsync(modulo);
  const uri = arq.localUri ?? arq.uri;
  const { granted } = await requestPermissionsAsync(true, ['photo']);
  if (!granted) throw new Error('sem permissão');
  await Midia.create(uri);
}
