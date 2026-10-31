import { useMemo, useState } from 'react';
import { FlatList, Image, Modal, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, useWindowDimensions, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { TIMES, type Time } from './src/times';
import { TAMANHOS } from './src/arte';
import { CATALOGO } from './src/catalogo';
import { baixarImagem } from './src/baixar';

const NOME_ESTILO: Record<string, string> = {
  asas: 'Asas', torcida: 'Torcida', chuva: 'Vidro e chuva', colagem: 'Colagem', neon: 'Neon', metal: 'Metal',
};
const mini = (id: string, e: string) => `/papeis/${id}/${e}-mini.webp`;
const original = (id: string, e: string) => `/papeis/${id}/${e}.jpg`;
const semAcento = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

export default function App() {
  const { width } = useWindowDimensions();
  const [busca, setBusca] = useState('');
  const [sel, setSel] = useState<Time | null>(null);
  const [estilo, setEstilo] = useState('');
  const [msg, setMsg] = useState('');
  const largura = Math.min(width, 900);
  const cols = largura > 700 ? 5 : largura > 480 ? 4 : 3;
  const cw = (largura - 16 * 2 - 10 * (cols - 1)) / cols;

  const times = useMemo(() => {
    const q = semAcento(busca.trim());
    return TIMES.filter((t) => CATALOGO[t.id]?.length && (!q || semAcento(t.nome).includes(q)));
  }, [busca]);

  function abrir(t: Time) { setSel(t); setEstilo(CATALOGO[t.id][0]); setMsg(''); }
  async function baixar(i: number) {
    if (!sel) return;
    setMsg('Gerando…');
    try { await baixarImagem(original(sel.id, estilo), TAMANHOS[i], `${sel.id}-${estilo}`); setMsg('Pronto! Veja em Downloads.'); }
    catch { setMsg('Não deu certo. Tente de novo.'); }
  }
  const estilos = sel ? CATALOGO[sel.id] : [];
  const mw = Math.min((largura - 32 - 8 * 5) / 6, 70);

  return (
    <SafeAreaView style={s.tela}>
      <StatusBar style="light" />
      <View style={[s.conteudo, { width: largura }]}>
        <Text style={s.titulo}>Papéis de Parede</Text>
        <Text style={s.sub}>Série A 2026 · {times.length} times · toque num time</Text>
        <TextInput value={busca} onChangeText={setBusca} placeholder="Buscar time…" placeholderTextColor="#6B7380"
          style={s.busca} accessibilityLabel="Buscar time" autoCorrect={false} />
        <FlatList
          key={cols}
          data={times}
          numColumns={cols}
          keyExtractor={(t) => t.id}
          columnWrapperStyle={{ gap: 10 }}
          contentContainerStyle={{ gap: 10, paddingBottom: 24 }}
          ListEmptyComponent={<Text style={s.sub}>Nenhum time encontrado.</Text>}
          renderItem={({ item }) => (
            <Pressable onPress={() => abrir(item)} style={[s.card, { width: cw }]} accessibilityLabel={item.nome}>
              <Image source={{ uri: mini(item.id, CATALOGO[item.id][0]) }} style={{ width: cw, height: cw * 20 / 9 }} />
              <Text style={s.nomeCard} numberOfLines={1}>{item.nome}</Text>
            </Pressable>
          )}
        />
      </View>

      <Modal visible={!!sel} animationType="slide" onRequestClose={() => setSel(null)}>
        <SafeAreaView style={s.tela}>
          <ScrollView contentContainerStyle={s.previa}>
            <Text style={s.titulo}>{sel?.nome}</Text>
            {sel && <Image source={{ uri: mini(sel.id, estilo) }} style={s.grande} />}
            <Text style={s.sub}>Estilo: {NOME_ESTILO[estilo] ?? estilo}</Text>
            <View style={s.estilos}>
              {sel && estilos.map((e) => (
                <Pressable key={e} onPress={() => { setEstilo(e); setMsg(''); }} accessibilityLabel={NOME_ESTILO[e]}
                  style={[s.chip, e === estilo && s.chipSel]}>
                  <Image source={{ uri: mini(sel.id, e) }} style={{ width: mw, height: mw * 20 / 9, borderRadius: 6 }} />
                  <Text style={s.chipTxt}>{NOME_ESTILO[e]}</Text>
                </Pressable>
              ))}
            </View>
            <Text style={s.sub}>Baixar:</Text>
            {TAMANHOS.map((t, i) => (
              <Pressable key={t.id} style={s.botao} onPress={() => baixar(i)}>
                <Text style={s.botaoTxt}>⬇ {t.rotulo}</Text>
              </Pressable>
            ))}
            {!!msg && <Text style={s.sub}>{msg}</Text>}
            <Pressable style={[s.botao, s.voltar]} onPress={() => setSel(null)}>
              <Text style={s.botaoTxt}>Voltar</Text>
            </Pressable>
            <Text style={s.aviso}>Escudos são marcas registradas dos clubes. Uso pessoal; não é um app oficial.</Text>
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
  aviso: { color: '#6B7380', fontSize: 12, marginTop: 12, textAlign: 'center' },
});
