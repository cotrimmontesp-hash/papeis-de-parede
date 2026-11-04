import { useMemo, useState } from 'react';
import { FlatList, Image, Modal, Platform, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, useWindowDimensions, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { CATEGORIAS, ITENS, JOGADORES, NOME_ESTILO, type CategoriaId, type Item } from './src/categorias';
import { TAMANHOS } from './src/arte';
import { CATALOGO } from './src/catalogo';
import { baixarImagem } from './src/baixar';
import { fonteGrande, fonteMini, original } from './src/imagens';
import { salvarNaGaleria } from './src/salvar';
import { Cartoes } from './src/Inicio';

const WEB = Platform.OS === 'web';

const semAcento = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

export default function App() {
  const { width } = useWindowDimensions();
  const [busca, setBusca] = useState('');
  const [aba, setAba] = useState<CategoriaId | null>(null);
  const [sel, setSel] = useState<Item | null>(null);
  const [estilo, setEstilo] = useState('');
  const [msg, setMsg] = useState('');
  const largura = Math.min(width, 900);
  const cols = largura > 700 ? 5 : largura > 480 ? 4 : 3;
  const cw = (largura - 16 * 2 - 10 * (cols - 1)) / cols;

  const cat = CATEGORIAS.find((c) => c.id === aba) ?? CATEGORIAS[0];
  const daAba = useMemo(() => ITENS.filter((t) => t.cat === aba && CATALOGO[t.id]?.length), [aba]);
  const itens = useMemo(() => {
    const q = semAcento(busca.trim());
    return daAba.filter((t) => !q || semAcento(t.nome).includes(q));
  }, [busca, daAba]);
  const achados = useMemo(() => {
    const q = semAcento(busca.trim());
    return q ? ITENS.filter((t) => CATALOGO[t.id]?.length && semAcento(t.nome).includes(q)) : [];
  }, [busca]);
  const total = (c: CategoriaId) => ITENS.filter((t) => t.cat === c && CATALOGO[t.id]?.length).length;

  function abrir(t: Item) { setSel(t); setEstilo(CATALOGO[t.id][0]); setMsg(''); }
  async function baixar(i: number) {
    if (!sel) return;
    setMsg('Gerando…');
    try {
      if (WEB) { await baixarImagem(original(sel.id, estilo) as string, TAMANHOS[i], `${sel.id}-${estilo}`); setMsg('Pronto! Veja em Downloads.'); }
      else { await salvarNaGaleria(original(sel.id, estilo)); setMsg('Salvo na Galeria!'); }
    }
    catch { setMsg('Não deu certo. Tente de novo.'); }
  }
  const estilos = sel ? CATALOGO[sel.id] : [];
  const mw = Math.min((largura - 32 - 8 * 5) / 6, 70);

  return (
    <SafeAreaView style={s.tela}>
      <StatusBar style={aba ? 'light' : 'dark'} />
      {aba === null ? (
        <View style={s.inicio}>
          <ScrollView contentContainerStyle={{ width: largura, paddingHorizontal: 16, alignSelf: 'center' }}>
            <Text style={[s.titulo, s.tituloClaro]}>Papéis de Parede</Text>
            <Text style={s.subClaro}>Escolha uma categoria</Text>
            <TextInput value={busca} onChangeText={setBusca} placeholder="Buscar time ou tema…" placeholderTextColor="#8A8F98"
              style={s.buscaClara} accessibilityLabel="Buscar" autoCorrect={false} />
            {busca.trim() ? (
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, paddingBottom: 24 }}>
                {achados.length === 0 && <Text style={s.subClaro}>Nada encontrado.</Text>}
                {achados.map((item) => (
                  <Pressable key={item.id} onPress={() => abrir(item)} style={[s.card, s.cardClaro, { width: cw }]} accessibilityLabel={item.nome}>
                    <Image source={fonteMini(item.id, CATALOGO[item.id][0])} style={{ width: cw, height: cw * 20 / 9 }} />
                    <Text style={[s.nomeCard, { color: '#1F2328' }]} numberOfLines={1}>{item.nome}</Text>
                  </Pressable>
                ))}
              </View>
            ) : <Cartoes largura={largura} abrir={(c) => { setAba(c); setBusca(''); }} />}
          </ScrollView>
        </View>
      ) : (
      <View style={[s.conteudo, { width: largura }]}>
        <Pressable onPress={() => { setAba(null); setBusca(''); }} accessibilityRole="button" accessibilityLabel="Voltar ao início" style={s.inicioBtn}>
          <Text style={s.inicioTxt}>‹ Início</Text>
        </Pressable>
        <Text style={[s.titulo, { marginTop: 4 }]}>Papéis de Parede</Text>
        <View style={s.abas} accessibilityRole="tablist">
          {CATEGORIAS.map((c) => (
            <Pressable key={c.id} onPress={() => { setAba(c.id); setBusca(''); }} accessibilityRole="tab"
              accessibilityState={{ selected: c.id === aba }} style={[s.aba, c.id === aba && s.abaSel]}>
              <Text style={[s.abaTxt, c.id === aba && s.abaTxtSel]}>{c.nome}{total(c.id) ? '' : ' · em breve'}</Text>
            </Pressable>
          ))}
        </View>
        {daAba.length === 0 ? (
          <View style={s.breve}>
            <Text style={s.breveTit}>{cat.nome}: em breve</Text>
            <Text style={s.sub}>Esta categoria ainda não tem papéis de parede.</Text>
          </View>
        ) : (<>
        <Text style={s.sub}>{cat.sub} · {itens.length} {aba === 'brasil' || aba === 'europa' ? 'times' : 'temas'} · toque para abrir</Text>
        <TextInput value={busca} onChangeText={setBusca} placeholder={aba === 'brasil' || aba === 'europa' ? 'Buscar time…' : 'Buscar tema…'} placeholderTextColor="#6B7380"
          style={s.busca} accessibilityLabel="Buscar" autoCorrect={false} />
        <FlatList
          key={cols}
          data={itens}
          numColumns={cols}
          keyExtractor={(t) => t.id}
          columnWrapperStyle={{ gap: 10 }}
          contentContainerStyle={{ gap: 10, paddingBottom: 24 }}
          ListEmptyComponent={<Text style={s.sub}>Nada encontrado.</Text>}
          renderItem={({ item }) => (
            <Pressable onPress={() => abrir(item)} style={[s.card, { width: cw }]} accessibilityLabel={item.nome}>
              <Image source={fonteMini(item.id, CATALOGO[item.id][0])} style={{ width: cw, height: cw * 20 / 9 }} />
              <Text style={s.nomeCard} numberOfLines={1}>{item.nome}</Text>
            </Pressable>
          )}
        />
        </>)}
      </View>
      )}

      <Modal visible={!!sel} animationType="slide" onRequestClose={() => setSel(null)}>
        <SafeAreaView style={s.tela}>
          <ScrollView contentContainerStyle={s.previa}>
            <Text style={s.titulo}>{sel?.nome}</Text>
            {sel && <Image source={fonteGrande(sel.id, estilo)} style={s.grande} />}
            <Text style={s.sub}>Estilo: {NOME_ESTILO[estilo] ?? estilo}</Text>
            <View style={s.estilos}>
              {sel && estilos.map((e) => (
                <Pressable key={e} onPress={() => { setEstilo(e); setMsg(''); }} accessibilityLabel={NOME_ESTILO[e]}
                  style={[s.chip, e === estilo && s.chipSel]}>
                  <Image source={fonteMini(sel.id, e)} style={{ width: mw, height: mw * 20 / 9, borderRadius: 6 }} />
                  <Text style={s.chipTxt}>{NOME_ESTILO[e]}</Text>
                </Pressable>
              ))}
            </View>
            <Text style={s.sub}>{WEB ? 'Baixar:' : 'Salvar na Galeria (1080×2400):'}</Text>
            {TAMANHOS.filter((t) => WEB || t.id === 'cel-alto').map((t) => (
              <Pressable key={t.id} style={s.botao} onPress={() => baixar(TAMANHOS.indexOf(t))}>
                <Text style={s.botaoTxt}>⬇ {WEB ? t.rotulo : 'Salvar na Galeria'}</Text>
              </Pressable>
            ))}
            {!!msg && <Text style={s.sub}>{msg}</Text>}
            <Pressable style={[s.botao, s.voltar]} onPress={() => setSel(null)}>
              <Text style={s.botaoTxt}>Voltar</Text>
            </Pressable>
            <Text style={s.aviso}>{sel && JOGADORES.includes(sel.id) ? 'Imagem de terceiros (foto/edição de fã). Direito de imagem do jogador e marcas dos clubes. Só uso pessoal.'
              : estilo.startsWith('web') ? 'Imagem de terceiros (arte de torcida da web). Escudo é marca do clube. Só uso pessoal.'
              : sel?.cat === 'brasil' || sel?.cat === 'europa'
              ? 'Escudos são marcas registradas dos clubes. Uso pessoal; não é um app oficial.'
              : sel?.cat === 'herois' ? 'Imagem de terceiros (fan art). Personagens são da Marvel/DC. Só uso pessoal.'
              : estilo.startsWith('foto') ? 'Imagem de terceiros (fan art). Personagens são dos seus donos. Só uso pessoal.'
              : 'Arte original inspirada no tema; não usa personagens, logos ou pôsteres reais.'}</Text>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  tela: { flex: 1, backgroundColor: '#0E1116', alignItems: 'center' },
  conteudo: { flex: 1, paddingHorizontal: 16 },
  titulo: { color: '#fff', fontSize: 26, fontWeight: '800', marginTop: 16 },
  sub: { color: '#A8B0BC', fontSize: 15, marginVertical: 8 },
  busca: { backgroundColor: '#1B2028', color: '#fff', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 16, marginBottom: 12 },
  card: { borderRadius: 12, overflow: 'hidden', backgroundColor: '#1B2028' },
  nomeCard: { color: '#fff', fontSize: 13, fontWeight: '700', padding: 6, textAlign: 'center' },
  previa: { alignItems: 'center', padding: 20, gap: 8 },
  grande: { width: 220, height: 489, borderRadius: 16 },
  estilos: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center', maxWidth: 520 },
  chip: { alignItems: 'center', padding: 4, borderRadius: 10, borderWidth: 2, borderColor: 'transparent' },
  chipSel: { borderColor: '#2FBF71' },
  chipTxt: { color: '#C8CED6', fontSize: 11, marginTop: 3 },
  botao: { backgroundColor: '#1F8A4C', paddingVertical: 14, paddingHorizontal: 18, borderRadius: 12, width: 300, alignItems: 'center' },
  voltar: { backgroundColor: '#333A45', marginTop: 8 },
  botaoTxt: { color: '#fff', fontSize: 16, fontWeight: '700' },
  abas: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginVertical: 8 },
  aba: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 999, backgroundColor: '#1B2028' },
  abaSel: { backgroundColor: '#1F8A4C' },
  abaTxt: { color: '#C8CED6', fontSize: 14, fontWeight: '600' },
  abaTxtSel: { color: '#fff' },
  breve: { marginTop: 40, alignItems: 'center', padding: 24, borderRadius: 16, backgroundColor: '#1B2028' },
  breveTit: { color: '#fff', fontSize: 20, fontWeight: '800' },
  inicio: { flex: 1, alignSelf: 'stretch', backgroundColor: '#F6F5F1' },
  tituloClaro: { color: '#1F2328' },
  subClaro: { color: '#6B7280', fontSize: 15, marginVertical: 8 },
  buscaClara: { backgroundColor: '#fff', color: '#1F2328', borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12, fontSize: 16, marginBottom: 16, borderWidth: 1, borderColor: '#E7E5E0' },
  cardClaro: { backgroundColor: '#fff' },
  inicioBtn: { marginTop: 12, alignSelf: 'flex-start', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 999, backgroundColor: '#1B2028' },
  inicioTxt: { color: '#C8CED6', fontSize: 15, fontWeight: '700' },
  aviso: { color: '#6B7380', fontSize: 12, marginTop: 12, textAlign: 'center' },
});
