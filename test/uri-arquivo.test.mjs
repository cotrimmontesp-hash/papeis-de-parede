import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { uriArquivoLocal, mensagemFalhaGaleria } from '../src/uri-arquivo.ts';

const ARQUIVO = 'file:///data/user/0/br.com.minanoideias.papeisdeparede/cache/ExponentAsset-abc123.jpg';

test('aceita arquivo local que a Galeria consegue ler', () => {
  assert.equal(uriArquivoLocal(ARQUIVO), ARQUIVO);
});

test('rejeita o id de drawable do APK de release', () => {
  assert.equal(uriArquivoLocal('public_papeis_flamengo_neon'), null);
  assert.equal(uriArquivoLocal('assets_public_papeis_flamengo_neon'), null);
});

test('rejeita recurso embutido e endereços que não são arquivo', () => {
  assert.equal(uriArquivoLocal('file:///android_res/drawable-xxhdpi/public_papeis_flamengo_neon.jpg'), null);
  assert.equal(uriArquivoLocal('http://127.0.0.1:8081/assets/public/papeis/flamengo/neon.jpg'), null);
  assert.equal(uriArquivoLocal('content://media/external/images/media/1'), null);
  assert.equal(uriArquivoLocal(null), null);
  assert.equal(uriArquivoLocal(undefined), null);
  assert.equal(uriArquivoLocal(''), null);
});

test('permissão negada tem texto claro; falha desconhecida não vaza detalhe', () => {
  assert.match(mensagemFalhaGaleria(new Error('sem permissão')), /Galeria/);
  assert.match(mensagemFalhaGaleria(new Error('sem permissão')), /fotos/);
  assert.match(mensagemFalhaGaleria(new Error('arquivo indisponível')), /preparada/);
  assert.equal(mensagemFalhaGaleria(new Error('E_UNABLE_TO_SAVE stack interno')), 'Não deu certo. Tente de novo.');
  assert.equal(mensagemFalhaGaleria('x'), 'Não deu certo. Tente de novo.');
});

test('o app nativo não manda o id cru do drawable para a Galeria', () => {
  const src = readFileSync(new URL('../src/salvar.native.ts', import.meta.url), 'utf8');
  assert.match(src, /uriArquivoLocal\(arq\.localUri\)/);
  assert.match(src, /arq\.downloaded = false/);
  assert.match(src, /await arq\.downloadAsync\(\)/);
  assert.match(src, /Midia\.create\(uri\)/);
  assert.doesNotMatch(src, /localUri \?\?/);
});
