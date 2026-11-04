import { TIMES } from './times';
import { EUROPA } from './europa';

export type CategoriaId = 'brasil' | 'europa' | 'desenhos' | 'filmes' | 'herois' | 'outras';
export type Item = { id: string; nome: string; cat: CategoriaId };

export const CATEGORIAS: { id: CategoriaId; nome: string; sub: string }[] = [
  { id: 'brasil', nome: 'Times do Brasil', sub: 'Série A 2026' },
  { id: 'europa', nome: 'Times da Europa', sub: 'Clubes famosos' },
  { id: 'desenhos', nome: 'Desenhos', sub: 'Fan art e arte original' },
  { id: 'filmes', nome: 'Filmes', sub: 'Arte original' },
  { id: 'herois', nome: 'Heróis', sub: 'Fan art' },
  { id: 'outras', nome: 'Outras artes', sub: 'Variados' },
];

// Temas de arte ORIGINAL (sem personagens, logos ou pôsteres reais); imagens de scripts/gerar-temas.mjs
const TEMAS: Item[] = [
  // Desenhos: wallpapers de terceiros (fan art) da web; fontes em assets/desenhos-web/FONTES.md. Só uso pessoal.
  { id: 'bart-simpson', nome: 'Bart Simpson', cat: 'desenhos' },
  { id: 'simpsons', nome: 'Os Simpsons', cat: 'desenhos' },
  { id: 'scooby-doo', nome: 'Scooby-Doo', cat: 'desenhos' },
  { id: 'robo-amigo', nome: 'Robô amigo', cat: 'desenhos' },
  { id: 'gato-astronauta', nome: 'Gato no espaço', cat: 'desenhos' },
  { id: 'detetive-neon', nome: 'Detetive de neon', cat: 'filmes' },
  { id: 'nave-espacial', nome: 'Nave espacial', cat: 'filmes' },
  // Heróis: wallpapers de terceiros (fan art) baixados da web; fontes em assets/herois/FONTES.md. Só uso pessoal.
  { id: 'homem-aranha', nome: 'Homem-Aranha', cat: 'herois' },
  { id: 'homem-de-ferro', nome: 'Homem de Ferro', cat: 'herois' },
  { id: 'thor', nome: 'Thor', cat: 'herois' },
  { id: 'batman', nome: 'Batman', cat: 'herois' },
  { id: 'superman', nome: 'Superman', cat: 'herois' },
  { id: 'hulk', nome: 'Hulk', cat: 'herois' },
  { id: 'wolverine', nome: 'Wolverine', cat: 'herois' },
  { id: 'capitao-america', nome: 'Capitão América', cat: 'herois' },
  { id: 'pantera-negra', nome: 'Pantera Negra', cat: 'herois' },
  { id: 'arlequina', nome: 'Arlequina', cat: 'herois' },
  { id: 'coringa', nome: 'Coringa', cat: 'herois' },
  { id: 'mulher-gato', nome: 'Mulher-Gato', cat: 'herois' },
  // Neymar: fotos/edições de terceiros (direito de imagem do jogador); fontes em assets/herois/FONTES.md. Só uso pessoal.
  { id: 'neymar', nome: 'Neymar', cat: 'brasil' },
  { id: 'messi', nome: 'Messi', cat: 'brasil' },
  { id: 'cristiano', nome: 'Cristiano Ronaldo', cat: 'brasil' },
];

export const ITENS: Item[] = [...TIMES.map((t) => ({ id: t.id, nome: t.nome, cat: 'brasil' as const })), ...EUROPA.map((t) => ({ id: t.id, nome: t.nome, cat: 'europa' as const })), ...TEMAS];

export const NOME_ESTILO: Record<string, string> = {
  asas: 'Asas', torcida: 'Torcida', chuva: 'Vidro e chuva', colagem: 'Colagem', neon: 'Neon', metal: 'Metal',
  aquarela: 'Aquarela', minimalista: 'Minimalista', retro: 'Retrô', pixel: 'Pixel',
  foto: 'Imagem 1', foto2: 'Imagem 2', foto3: 'Imagem 3', foto4: 'Imagem 4', foto5: 'Imagem 5', foto6: 'Imagem 6',
  web: 'Arte da torcida', web2: 'Arte da torcida 2',
};

// Jogadores reais (direito de imagem do jogador); não contam como times.
export const JOGADORES = ['neymar', 'messi', 'cristiano'];
