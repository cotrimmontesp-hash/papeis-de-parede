// Série A 2026 — fonte em FONTE_TIMES.md. Cores aproximadas; arte original, sem escudos.
export type Padrao =
  | 'listras-v' | 'listras-h' | 'listras-diag' | 'faixa-h' | 'faixa-v'
  | 'faixa-diag' | 'metade' | 'gradiente' | 'estrela' | 'estrelas';

export type Time = { id: string; nome: string; uf: string; cores: string[]; padrao: Padrao };

export const TIMES: Time[] = [
  { id: 'athletico-pr', nome: 'Athletico-PR', uf: 'PR', cores: ['#C8102E', '#111111'], padrao: 'listras-v' },
  { id: 'atletico-mg', nome: 'Atlético-MG', uf: 'MG', cores: ['#111111', '#FFFFFF'], padrao: 'listras-v' },
  { id: 'bahia', nome: 'Bahia', uf: 'BA', cores: ['#FFFFFF', '#0047AB', '#D52B1E'], padrao: 'faixa-h' },
  { id: 'botafogo', nome: 'Botafogo', uf: 'RJ', cores: ['#111111', '#FFFFFF'], padrao: 'estrela' },
  { id: 'chapecoense', nome: 'Chapecoense', uf: 'SC', cores: ['#00843D', '#FFFFFF'], padrao: 'metade' },
  { id: 'corinthians', nome: 'Corinthians', uf: 'SP', cores: ['#FFFFFF', '#111111'], padrao: 'faixa-v' },
  { id: 'coritiba', nome: 'Coritiba', uf: 'PR', cores: ['#FFFFFF', '#00543C'], padrao: 'listras-h' },
  { id: 'cruzeiro', nome: 'Cruzeiro', uf: 'MG', cores: ['#003DA5', '#FFFFFF'], padrao: 'estrelas' },
  { id: 'flamengo', nome: 'Flamengo', uf: 'RJ', cores: ['#C8102E', '#111111'], padrao: 'listras-h' },
  { id: 'fluminense', nome: 'Fluminense', uf: 'RJ', cores: ['#7A1E3A', '#FFFFFF', '#006B3F', '#FFFFFF'], padrao: 'listras-v' },
  { id: 'gremio', nome: 'Grêmio', uf: 'RS', cores: ['#0D80BF', '#111111', '#FFFFFF', '#111111'], padrao: 'listras-v' },
  { id: 'internacional', nome: 'Internacional', uf: 'RS', cores: ['#E30613', '#7A0009'], padrao: 'gradiente' },
  { id: 'mirassol', nome: 'Mirassol', uf: 'SP', cores: ['#FFD200', '#00843D'], padrao: 'listras-diag' },
  { id: 'palmeiras', nome: 'Palmeiras', uf: 'SP', cores: ['#006437', '#00230F'], padrao: 'gradiente' },
  { id: 'bragantino', nome: 'Bragantino', uf: 'SP', cores: ['#FFFFFF', '#D50032', '#111111'], padrao: 'faixa-h' },
  { id: 'remo', nome: 'Remo', uf: 'PA', cores: ['#0A1E50', '#FFFFFF'], padrao: 'faixa-diag' },
  { id: 'santos', nome: 'Santos', uf: 'SP', cores: ['#FFFFFF', '#111111'], padrao: 'listras-diag' },
  { id: 'sao-paulo', nome: 'São Paulo', uf: 'SP', cores: ['#FFFFFF', '#E30613', '#111111'], padrao: 'faixa-h' },
  { id: 'vasco', nome: 'Vasco', uf: 'RJ', cores: ['#111111', '#FFFFFF'], padrao: 'faixa-diag' },
  { id: 'vitoria', nome: 'Vitória', uf: 'BA', cores: ['#E30613', '#111111'], padrao: 'metade' },
];
