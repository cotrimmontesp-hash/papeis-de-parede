import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { CATEGORIAS, ITENS, JOGADORES, type CategoriaId } from './categorias';
import { CATALOGO } from './catalogo';
import { fonteMini } from './imagens';

type Visual = { cor: string; claro: string; etiqueta?: string; icone: (c: string) => React.ReactNode };

const VISUAL: Record<CategoriaId, Visual> = {
  brasil: { cor: '#16A34A', claro: '#DCFCE7', icone: (c) => (<>
    <Path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6z" stroke={c} strokeWidth={2} strokeLinejoin="round" fill="none" />
    <Path d="M9 12l2 2 4-4" stroke={c} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none" /></>) },
  europa: { cor: '#2563EB', claro: '#DBEAFE', icone: (c) => (<>
    <Circle cx={12} cy={12} r={9} stroke={c} strokeWidth={2} fill="none" />
    <Path d="M3 12h18M12 3c3 3.2 3 14.8 0 18M12 3c-3 3.2-3 14.8 0 18" stroke={c} strokeWidth={2} fill="none" /></>) },
  desenhos: { cor: '#8B5CF6', claro: '#EDE9FE', etiqueta: 'Novo', icone: (c) => (<>
    <Path d="M4 20l1-4L16 5l3 3L8 19z" stroke={c} strokeWidth={2} strokeLinejoin="round" fill="none" />
    <Path d="M14 7l3 3" stroke={c} strokeWidth={2} /></>) },
  filmes: { cor: '#E11D48', claro: '#FFE4E6', etiqueta: 'Novo', icone: (c) => (<>
    <Rect x={3} y={8} width={18} height={12} rx={2} stroke={c} strokeWidth={2} fill="none" />
    <Path d="M3 8l17-4 1 3.5M8 7l2-3.5M14 5.5l2-3" stroke={c} strokeWidth={2} strokeLinejoin="round" fill="none" /></>) },
  herois: { cor: '#0D9488', claro: '#CCFBF1', etiqueta: 'Novo', icone: (c) => (
    <Path d="M13 2L4 14h7l-1 8 9-12h-7z" stroke={c} strokeWidth={2} strokeLinejoin="round" fill="none" />) },
  outras: { cor: '#F59E0B', claro: '#FEF3C7', icone: (c) => (<>
    <Path d="M11 3l1.8 5.2L18 10l-5.2 1.8L11 17l-1.8-5.2L4 10l5.2-1.8z" stroke={c} strokeWidth={2} strokeLinejoin="round" fill="none" />
    <Path d="M18 15v5M15.5 17.5h5" stroke={c} strokeWidth={2} strokeLinecap="round" /></>) },
};

export const COR_CATEGORIA = (c: CategoriaId) => VISUAL[c].cor;

export function Cartoes({ largura, abrir }: { largura: number; abrir: (c: CategoriaId) => void }) {
  const cols = largura < 360 ? 1 : 2;
  const gap = 14;
  const cw = (largura - 16 * 2 - gap * (cols - 1)) / cols;
  const estreito = cw < 220;
  return (
    <View style={[s.grade, { gap }]}>
      {CATEGORIAS.map((c) => {
        const v = VISUAL[c.id];
        const itens = ITENS.filter((t) => t.cat === c.id && CATALOGO[t.id]?.length);
        const papeis = itens.reduce((n, t) => n + CATALOGO[t.id].length, 0);
        const times = c.id === 'brasil' || c.id === 'europa';
        const breve = itens.length === 0;
        const etiqueta = breve ? 'Em breve' : v.etiqueta ?? (() => { const j = itens.filter((t) => JOGADORES.includes(t.id)).length; return times ? `${itens.length - j} times${j ? ` · ${j} craques` : ''}` : `${itens.length} temas`; })();
        const previa = itens[0];
        return (
          <Pressable key={c.id} onPress={() => abrir(c.id)} style={[s.cartao, { width: cw }]}
            accessibilityRole="button" accessibilityLabel={`Abrir ${c.nome}`}>
            <View style={[s.barra, { backgroundColor: v.cor }]} />
            <View style={s.topo}>
              <View style={[s.icone, { backgroundColor: v.claro }]}>
                <Svg width={28} height={28} viewBox="0 0 24 24">{v.icone(v.cor)}</Svg>
              </View>
              <View style={s.moldura}>
                {previa
                  ? <Image source={fonteMini(previa.id, CATALOGO[previa.id][0])} style={s.mini} />
                  : <View style={[s.mini, s.vazio]}>{[0, 1, 2, 3, 4, 5].map((i) => <View key={i} style={[s.bloco, { backgroundColor: v.claro }]} />)}</View>}
              </View>
            </View>
            <Text style={[s.nome, estreito && { fontSize: 18 }]} numberOfLines={1}>{c.nome}</Text>
            <Text style={s.sub} numberOfLines={1}>{breve ? (estreito ? 'Chegando' : `${c.sub} · chegando`) : estreito ? `${papeis} papéis` : `${c.sub} · ${papeis} papéis`}</Text>
            <View style={s.rodape}>
              <Text style={[s.etiqueta, breve && s.etiquetaBreve, !breve && v.etiqueta && { backgroundColor: v.cor, color: '#fff' }]}>{etiqueta}</Text>
              <View style={[s.seta, { backgroundColor: v.cor }]}>
                <Svg width={20} height={20} viewBox="0 0 24 24"><Path d="M9 6l6 6-6 6" stroke="#fff" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" fill="none" /></Svg>
              </View>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

const s = StyleSheet.create({
  grade: { flexDirection: 'row', flexWrap: 'wrap', paddingBottom: 24 },
  cartao: { backgroundColor: '#fff', borderRadius: 26, padding: 16, paddingTop: 20, overflow: 'hidden',
    shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 3 },
  barra: { position: 'absolute', top: 0, left: 0, right: 0, height: 5 },
  topo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 },
  icone: { width: 52, height: 52, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  moldura: { padding: 3, backgroundColor: '#fff', borderWidth: 1, borderColor: '#E7E5E0', borderRadius: 4 },
  mini: { width: 34, height: 76, borderRadius: 2 },
  vazio: { flexDirection: 'row', flexWrap: 'wrap', gap: 3, padding: 3, alignContent: 'flex-start' },
  bloco: { width: 12, height: 20, borderRadius: 2 },
  nome: { fontSize: 21, fontWeight: '600', color: '#1F2328' },
  sub: { fontSize: 14, color: '#6B7280', marginTop: 2 },
  rodape: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 14 },
  etiqueta: { backgroundColor: '#F1F1EF', color: '#374151', fontSize: 13, fontWeight: '500', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8, overflow: 'hidden' },
  etiquetaBreve: { backgroundColor: '#F59E0B', color: '#fff' },
  seta: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
});
