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

- Arquivo atual: `../build/papeis-de-parede-v4.apk` (versão 1.3.0, versionCode 4; inclui v3 a v7: cartões, Heróis, Times web, Desenhos; arm64, minSdk 24). 89.876.898 bytes (86 MB), sha256 `79babfa33c3f284c640f38fa021d0120b7538cd6e17b1ae6e0b8e030844859e7`. Mesma chave do v1 a v3: instala por cima. 223 imagens embutidas.
  **Aviso:** contém imagens de terceiros (fan art, escudos): só uso pessoal, não distribuir publicamente.
- v3: `../build/papeis-de-parede-v3.apk` (1.2.0, versionCode 3), sha256 `0969116a9fc112012dbc4c0e24f9e273d5c978f6b007a5024e1133b2ba4c2aeb`.
- v2: `../build/papeis-de-parede-v2.apk` (1.1.0, versionCode 2), sha256 `b316840430b6df6c26db463b8f4715c87da3501c461dfe786ecccc588716db25`.
- Anterior: `../build/papeis-de-parede-v1.apk` (1.0.0, versionCode 1, 60 imagens).
- Como gerar (só ferramentas gratuitas, na box): `. /opt/tools/env.sh && npx expo prebuild -p android --no-install && cd android && ./gradlew assembleRelease`. O prebuild reescreve `android/`: depois dele, recoloque o `signingConfigs.release` (propriedades `PAPEIS_*`) em `android/app/build.gradle` e `reactNativeArchitectures=arm64-v8a` em `android/gradle.properties`. A cada versão, aumente `version` e `android.versionCode` no `app.json`.
- Assinatura: keystore própria gerada na box (`/opt/tools/keys/`, senha em `~/.gradle/gradle.properties`). Nenhum segredo no repositório; `android/` é gerado e fica fora do git.
- No app nativo as imagens vão embutidas (v2: 188 imagens, 32 itens) (`src/imagens.native.ts`, gerado por `scripts/preparar-imagens.py`) e o botão salva o original 1080×2400 na Galeria. Os outros tamanhos ficam só na versão web.
- Para instalar: copie o APK para o celular e permita "Instalar apps desconhecidos" para o app que abrir o arquivo (Arquivos/Drive).

## v2: categorias (branch `v2-categorias`)

- Abas no topo: Times do Brasil (Série A), Times da Europa, Desenhos, Filmes e Outras artes. Categoria sem imagens aparece como "em breve". Busca dentro da aba; download igual ao v1 (web: 4 tamanhos; nativo: 1080x2400 na Galeria); PWA mantido (cache `v3`).
- Itens e categorias em `src/categorias.ts`. Lote 3 (Cruzeiro, Fluminense, Grêmio, Internacional, Mirassol) com escudos oficiais: `scripts/gerar-lote.mjs lote3 ...`.
- Desenhos e Filmes: arte ORIGINAL gerada por `scripts/gerar-temas.mjs` (robô, gato no espaço, detetive, nave) em 5 estilos: neon, aquarela, minimalista, retrô e pixel. Regra: sem personagens, logos, pôsteres ou nomes de filmes/desenhos protegidos nas imagens; o nome só aparece como categoria.
- Depois de gerar imagens: `python3 scripts/preparar-imagens.py` (atualiza catálogo, web e mapa nativo). APK v2 gerado em 01/11 (ver seção APK).

### Lote 4 e Europa (01/11)

- Lote 4 fecha a Série A (20 times): Red Bull Bragantino, Remo, Santos, São Paulo e Vitória (`prints/lote4/`).
- Aba Europa com 8 clubes em `src/europa.ts` (Real Madrid, Barcelona, Manchester United, Liverpool, Bayern, Juventus, PSG, Chelsea), 6 estilos cada, em lotes de até 5 (`prints/europa1/`, `prints/europa2/`). Escudos oficiais da Wikimedia/Wikipedia com fonte e licença em `assets/escudos/FONTES.md`.
- `scripts/preparar-imagens.py` agora lê `prints/lote*` e `prints/europa*`. Catálogo: 32 itens, 188 imagens (cerca de 54 MB na web).

## v3: tela inicial em cartões (branch `v3-cartoes`)

- Só a tela inicial mudou (`src/Inicio.tsx`): fundo off-white, cartões brancos arredondados com sombra, 2 por linha (1 por linha abaixo de 360 px). Cada categoria tem cor e ícone próprios, barra fina de cor no topo, prévia real em moldura, título, quantidade de papéis, etiqueta ("20 times", "Novo", "Em breve" em laranja) e botão redondo com seta que abre a página da categoria.
- A busca fica no topo da tela inicial e procura em todas as categorias. As páginas de categoria, o download e o PWA continuam iguais, com o botão "‹ Início" para voltar. Cache do service worker passou para `v4`.
- Testado na web (`npx expo export -p web` + servidor local). Prints em `../prints/v3/`. APK v3 gerado em 02/11 (ver seção APK).

## v4: categoria Heróis, lote 1 (branch `v4-herois`) — REPROVADO, arte por código descartada na v5

- Cartão "Heróis" (verde-azulado, ícone de raio, subtítulo "Inspirados") com 8 heróis em 3 estilos (épico com raios, quadrinhos com retícula, neon de rua): Aço Vermelho, Deus do Trovão, Escalador de Teias, Guardião das Sombras, Protetor dos Céus, Escudo Estrelado, Gigante Esmeralda e Felino da Noite. São 24 imagens 1080x2400, geradas com `RESVG=... node scripts/gerar-herois.mjs herois1` e depois `python3 scripts/preparar-imagens.py`.
- Regra de direitos: os personagens que inspiram as figuras são da Marvel/DC. As figuras são ORIGINAIS, feitas por código: silhuetas genéricas, só com cores e acessórios que lembram o tema. Não usar logos, símbolos oficiais, rostos, poses ou arte copiada, nem nomes registrados nas imagens; os títulos são próprios.
- Amostras em `../prints/herois1/`: `herois1-geral.png`, `<herói>-folha.png`, tela inicial e página da categoria. Lote para o Paulo aprovar o estilo; sem APK.

## v5: Heróis com imagens da web (branch `v5-herois-web`)

- A arte por código dos heróis saiu do app (script e imagens); os PNGs antigos ficam só em `../prints/herois1/`, fora do app.
- São 8 wallpapers verticais de terceiros (fan art e arte de quadrinhos/jogos) para 7 heróis: Homem-Aranha (2), Homem de Ferro, Thor, Batman, Superman, Hulk e Wolverine. Vieram da API pública do Wallhaven (SFW), baixados com curl e conferidos um a um. Cada um foi recortado no centro para 1080x2400 e salvo em JPEG. Fontes, autores e resoluções em `assets/herois/FONTES.md`.
- **Aviso:** imagens de terceiros, só para uso pessoal. Os personagens são da Marvel/DC e as artes, dos autores. NÃO publicar no site/Vercel público nem em loja sem revisão de direitos.
- Amostras em `../prints/herois2/`: `herois2-geral.png`, `herois2-categoria.png`, `herois2-tela-inicial.png`. Sem APK.

## v6: Times com imagens da web (branch `v6-times-web`)

- 9 wallpapers verticais de terceiros (Vasco, Flamengo x2, Corinthians x2, Palmeiras x2, Santos, Cruzeiro) entram em **Times do Brasil** como estilo "Arte da torcida" dentro de cada time; a arte por código continua igual.
- Fontes (Wallhaven API + wallpapercave.com, via curl) em `assets/times-web/FONTES.md`; recorte cover 1080x2400; amostras em `prints/times-web1/`.
- **Aviso:** imagens de terceiros, só uso pessoal; escudos são marcas dos clubes. NÃO publicar no site/Vercel público sem revisão de direitos.

## v7: Desenhos e mais Heróis com imagens da web (branch `v7-desenhos-herois`)

- **Desenhos:** 10 wallpapers verticais de fãs, em 3 temas novos: Bart Simpson (4, streetwear e psicodélico), Os Simpsons (3) e Scooby-Doo (3). Robô amigo e Gato no espaço continuam por enquanto. Fontes em `assets/desenhos-web/FONTES.md`.
- **Heróis:** 8 novas imagens, com 2 temas novos, Capitão América (2) e Pantera Negra (2), e +1 para Homem-Aranha, Batman, Superman e Hulk. Fontes em `assets/herois/FONTES.md`; evitei foto de ator e marca d'água.
- **Extras horizontais:** 4 imagens para tablet em `assets/extras-horizontais/`, fora do catálogo.
- Fonte das 18 verticais: wallpapercave.com, via curl. Os 4 extras horizontais vieram da API do Wallhaven.
- Recorte cover 1080x2400. Amostras em `prints/desenhos-web1/` e `prints/herois3/`.
- **Aviso:** imagens de terceiros, só uso pessoal. NÃO publicar no site/Vercel público sem revisão de direitos.

## v8: mais Heróis e Neymar (branch `v8-mais-herois`)

- Entraram 15 imagens da web aprovadas pelo Paulo em 04/11:
  - Arlequina, Coringa e Mulher-Gato: 3 cada, como temas novos em Heróis.
  - Batman: +3 (Imagens 3 a 5).
  - Neymar: 3, como tema novo em Times do Brasil.
- Fontes: `assets/herois/FONTES.md` (lote herois4). As amostras estão em `../prints/herois4/`.
- **Aviso:** imagens de terceiros, só uso pessoal. As fotos do Neymar envolvem direito de imagem do jogador. NÃO publicar no site/Vercel público sem revisão de direitos.

## v9: Arlequina humana, Coringa e craques (branch `v9-mais-herois`)

- Entraram 15 imagens da web aprovadas pelo Paulo em 04/11:
  - Em Heróis: +3 Arlequina (versão humana) e +3 Coringa.
  - Em Times do Brasil: +3 Neymar e os temas novos Messi e Cristiano Ronaldo, com 3 cada. O cartão mostra "20 times · 3 craques".
- Fontes: `assets/herois/FONTES.md` (lote herois5).
- **Aviso:** imagens de terceiros, só uso pessoal. As fotos de jogadores envolvem direito de imagem. NÃO publicar sem revisão de direitos.
