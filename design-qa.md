# Design QA — Lunare

**Resultado final: aprovado.** A implementação reproduz a direção escolhida “Editorial Bento Atelier” no cardápio completo e mantém o fluxo de compra reutilizável.

## Evidências visuais

- Referência escolhida: [`qa/design-reference-option-1.png`](./qa/design-reference-option-1.png)
- Desktop 1440 px: [`qa/cardapio-1440.png`](./qa/cardapio-1440.png)
- Tablet 1024 px: [`qa/cardapio-1024.png`](./qa/cardapio-1024.png)
- Tablet 768 px: [`qa/cardapio-768.png`](./qa/cardapio-768.png)
- Mobile 390 px: [`qa/cardapio-390.png`](./qa/cardapio-390.png)
- Mobile 360 px: [`qa/cardapio-360.png`](./qa/cardapio-360.png)
- Mobile 390 px com movimento reduzido: [`qa/cardapio-390-reduced-motion.png`](./qa/cardapio-390-reduced-motion.png)
- Página estendida em desktop: [`qa/cardapio-desktop-tall.png`](./qa/cardapio-desktop-tall.png)
- Página estendida em mobile: [`qa/cardapio-mobile-tall.png`](./qa/cardapio-mobile-tall.png)
- Ficha configurável em desktop: [`qa/product-dialog-desktop.png`](./qa/product-dialog-desktop.png)
- Auditoria de viewport e console: [`qa/browser-audit.json`](./qa/browser-audit.json)

## Comparação com a referência

| Critério | Resultado |
| --- | --- |
| Composição | Hero dividido em azul noturno e fotografia real; barra de busca/categorias sobreposta; seleção do chef editorial; fileira compacta de mais pedidos e catálogo por seções. |
| Tipografia | Serif editorial de alto contraste nos títulos e sans-serif legível em controles, preços e metadados. |
| Cores e materiais | Azul meia-noite, marfim quente, grafite e dourado-champanhe fosco, com textura discreta no hero. |
| Cards e ficha | Cards compactos reutilizáveis, estados configurável/indisponível e modal desktop em duas colunas; no mobile, sheet e CTA fixo. |
| Conteúdo | Nomes, preços, opções e imagens locais do cardápio preservados; dados ainda não confirmados continuam marcados como provisórios. |

As diferenças intencionais em relação ao conceito visual são funcionais: a implementação usa o logotipo fornecido, as fotografias reais disponíveis e todo o conteúdo do cardápio, em vez de textos ou imagens inventados apenas para a composição.

## Inspeção e correções

- **P1 corrigido:** o título do hero podia exceder a largura em viewport mobile estreito. A coluna recebeu contenção de largura e a escala tipográfica mobile foi recalibrada.
- **P1 corrigido:** o deploy intermediário da Vercel encontrou `OverlaysV2.tsx` sem `Overlays.module.css`. O arquivo foi restaurado e o build de produção voltou a resolver o import normalmente.
- **P2 validado:** os itens que aparecem fora do retângulo visível pertencem somente aos carrosséis horizontais de categorias e destaques. O documento não cria rolagem horizontal acidental.
- Nenhuma imagem quebrada, fallback de rota pendente ou erro de console foi encontrado nas cinco larguras.
- Cada viewport apresentou exatamente um `h1`, 41 artigos renderizados no catálogo e largura do documento igual à largura útil do viewport.
- O modo `prefers-reduced-motion: reduce` foi emulado e permaneceu funcional, sem overflow ou fallback de carregamento.

## Breakpoints verificados

| Largura | Resultado |
| ---: | --- |
| 360 px | Aprovado; navegação inferior, hero empilhado, métricas legíveis e busca sem overflow do documento. |
| 390 px | Aprovado; título em duas linhas, categorias roláveis e CTA/controles com área de toque adequada. |
| 768 px | Aprovado; hero em duas colunas e catálogo responsivo. |
| 1024 px | Aprovado; navegação desktop e composição editorial equilibrada. |
| 1440 px | Aprovado; largura editorial, mídia de destaque e densidade do catálogo coerentes com a referência. |

Esta revisão usa capturas reais do Microsoft Edge headless contra o servidor Vite local. A auditoria de navegador registra os valores medidos e não substitui uma homologação futura em aparelhos físicos e leitores de tela reais.
