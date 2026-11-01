# Papéis de Parede

App (Expo + TypeScript) de papéis de parede com arte original nas cores dos times da Série A 2026. Toque no time, veja a prévia e baixe PNG em 4 tamanhos (celular 1080×1920, celular alto 1080×2400, tablet 1600×2560 e 2560×1600). Na web, instala como app (PWA).

## Rodar
```bash
npm install
npx expo start --web        # desenvolvimento
npx expo export -p web      # gera a pasta dist/ (Vercel usa vercel.json)
```

## Limites v1
- Download só na versão web (no app nativo, aviso para usar a web).
- Sem escudos, logos ou fotos oficiais (têm direitos). Fonte da lista: FONTE_TIMES.md.

## APK (Android)

- Arquivo: `../build/papeis-de-parede-v1.apk` (arm64, para celulares como o Samsung A14). Uso pessoal; não publicado em loja.
- Como gerar (só ferramentas gratuitas, na box): `. /opt/tools/env.sh && npx expo prebuild -p android && cd android && ./gradlew assembleRelease`.
- Assinatura: keystore própria gerada na box (`/opt/tools/keys/`, senha em `~/.gradle/gradle.properties`). Nenhum segredo no repositório; `android/` é gerado e fica fora do git.
- No app nativo as 60 imagens vão embutidas (`src/imagens.native.ts`, gerado por `scripts/preparar-imagens.py`) e o botão salva o original 1080×2400 na Galeria. Os outros tamanhos ficam só na versão web.
- Para instalar: copie o APK para o celular e permita "Instalar apps desconhecidos" para o app que abrir o arquivo (Arquivos/Drive).

## v2: categorias (branch `v2-categorias`)

- Abas no topo: Times do Brasil (Série A), Times da Europa, Desenhos, Filmes e Outras artes. Categoria sem imagens aparece como "em breve". Busca dentro da aba; download igual ao v1 (web: 4 tamanhos; nativo: 1080x2400 na Galeria); PWA mantido (cache `v3`).
- Itens e categorias em `src/categorias.ts`. Lote 3 (Cruzeiro, Fluminense, Grêmio, Internacional, Mirassol) com escudos oficiais: `scripts/gerar-lote.mjs lote3 ...`.
- Desenhos e Filmes: arte ORIGINAL gerada por `scripts/gerar-temas.mjs` (robô, gato no espaço, detetive, nave) em 5 estilos: neon, aquarela, minimalista, retrô e pixel. Regra: sem personagens, logos, pôsteres ou nomes de filmes/desenhos protegidos nas imagens; o nome só aparece como categoria.
- Depois de gerar imagens: `python3 scripts/preparar-imagens.py` (atualiza catálogo, web e mapa nativo). O APK não foi refeito no v2.

### Lote 4 e Europa (01/11)

- Lote 4 fecha a Série A (20 times): Red Bull Bragantino, Remo, Santos, São Paulo e Vitória (`prints/lote4/`).
- Aba Europa com 8 clubes em `src/europa.ts` (Real Madrid, Barcelona, Manchester United, Liverpool, Bayern, Juventus, PSG, Chelsea), 6 estilos cada, em lotes de até 5 (`prints/europa1/`, `prints/europa2/`). Escudos oficiais da Wikimedia/Wikipedia com fonte e licença em `assets/escudos/FONTES.md`.
- `scripts/preparar-imagens.py` agora lê `prints/lote*` e `prints/europa*`. Catálogo: 32 itens, 188 imagens (cerca de 54 MB na web).
