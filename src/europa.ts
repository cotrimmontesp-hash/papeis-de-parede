// Times famosos da Europa (escudo oficial; fontes em assets/escudos/FONTES.md). `uf` guarda a cidade.
import type { Time } from './times';

export const EUROPA: Time[] = [
  { id: 'real-madrid', nome: 'Real Madrid', uf: 'MADRID', cores: ['#FFFFFF', '#00529F', '#FEBE10'], padrao: 'faixa-diag' },
  { id: 'barcelona', nome: 'Barcelona', uf: 'BARCELONA', cores: ['#A50044', '#004D98'], padrao: 'listras-v' },
  { id: 'manchester-united', nome: 'Manchester United', uf: 'MANCHESTER', cores: ['#DA291C', '#111111', '#FBE122'], padrao: 'gradiente' },
  { id: 'liverpool', nome: 'Liverpool', uf: 'LIVERPOOL', cores: ['#C8102E', '#00B2A9'], padrao: 'gradiente' },
  { id: 'bayern', nome: 'Bayern', uf: 'MÜNCHEN', cores: ['#DC052D', '#FFFFFF', '#0066B2'], padrao: 'listras-v' },
  { id: 'juventus', nome: 'Juventus', uf: 'TORINO', cores: ['#111111', '#FFFFFF'], padrao: 'listras-v' },
  { id: 'psg', nome: 'PSG', uf: 'PARIS', cores: ['#004170', '#DA291C', '#FFFFFF'], padrao: 'faixa-v' },
  { id: 'chelsea', nome: 'Chelsea', uf: 'LONDON', cores: ['#034694', '#FFFFFF', '#DBA111'], padrao: 'gradiente' },
];
