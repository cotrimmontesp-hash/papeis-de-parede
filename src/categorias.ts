import { TIMES } from './times';
import { EUROPA } from './europa';

export type CategoriaId = 'brasil' | 'europa' | 'desenhos' | 'filmes' | 'outras';
export type Item = { id: string; nome: string; cat: CategoriaId };

export const CATEGORIAS: { id: CategoriaId; nome: string; sub: string }[] = [
  { id: 'brasil', nome: 'Times do Brasil', sub: 'Série A 2026' },
  { id: 'europa', nome: 'Times da Europa', sub: 'Clubes famosos' },
  { id: 'desenhos', nome: 'Desenhos', sub: 'Arte original' },
  { id: 'filmes', nome: 'Filmes', sub: 'Arte original' },
  { id: 'outras', nome: 'Outras artes', sub: 'Variados' },
];

// Temas de arte ORIGINAL (sem personagens, logos ou pôsteres reais); imagens de scripts/gerar-temas.mjs
const TEMAS: Item[] = [
  { id: 'robo-amigo', nome: 'Robô amigo', cat: 'desenhos' },
  { id: 'gato-astronauta', nome: 'Gato no espaço', cat: 'desenhos' },
  { id: 'detetive-neon', nome: 'Detetive de neon', cat: 'filmes' },
  { id: 'nave-espacial', nome: 'Nave espacial', cat: 'filmes' },
];

export const ITENS: Item[] = [...TIMES.map((t) => ({ id: t.id, nome: t.nome, cat: 'brasil' as const })), ...EUROPA.map((t) => ({ id: t.id, nome: t.nome, cat: 'europa' as const })), ...TEMAS];

export const NOME_ESTILO: Record<string, string> = {
  asas: 'Asas', torcida: 'Torcida', chuva: 'Vidro e chuva', colagem: 'Colagem', neon: 'Neon', metal: 'Metal',
  aquarela: 'Aquarela', minimalista: 'Minimalista', retro: 'Retrô', pixel: 'Pixel',
};
