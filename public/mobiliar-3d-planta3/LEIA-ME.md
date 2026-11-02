# Mobiliar – modelo 3D (planta 3: planta certa do Paulo)
**Modelo 3D ilustrativo – móveis virtuais.** Nada foi publicado.

## Abrir localmente
`cd visualizador && python3 -m http.server 8767`, depois abra http://localhost:8767/

Parâmetros no endereço:
- `#estilo=moderno` ou `#estilo=escandinavo`
- `&vista=<nome>`
- `&limpo=1`, que oculta a ajuda

## Vistas
Vista de cima, mais 13 vistas numeradas e a maquete:
1. Sala
2. Cozinha
3. Escritório
4. Suíte master
5. Banho master
6. Quarto 1
7. Quarto 2
8. Suíte
9. Banho social
10. Banho suíte
11. Área de serviço
12. Hall
13. Lavabo

## Arquivos
- `planta3.json`: transcrição da planta, gerada por `gerar_planta3.py`. Coordenadas em metros.
- `gerar_modelo.py`: gera o modelo. Uso: `blender -b --python gerar_modelo.py -- moderno|escandinavo [topo]`. Grava `visualizador/modelo_<estilo>.glb` e o `.blend`.
- `prints/`: prints de todos os cômodos no estilo escandinavo, mais topo, sala e suíte master no estilo moderno, e `vista_cima_sobreposta.jpg`.
- `prints.sh`: refaz os prints.
- `avisos.md`: escala e medidas estimadas. Ler antes de usar.
- Pacote: `/workspace/imoveis/mobiliar-3d-planta3.tgz`, com a pasta `mobiliar-3d-planta3/` (index.html, lib/ e GLBs, caminhos relativos).
