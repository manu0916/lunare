# Lunare — sistema visual do protótipo

## Produto e experiência

Site front-end em português do Brasil para o Lunare Restaurante / Lunare Sushi, em Campos Gerais — MG. A experiência combina home editorial premium, catálogo móvel eficiente e um fluxo de pedido explicitamente simulado. O trabalho principal do usuário é descobrir pratos, filtrar categorias, abrir um item, configurar quantidade/observação, revisar o carrinho e concluir uma demonstração sem envio ou pagamento real.

## Direção autoral

- Composição: no desktop, narrativa editorial escura e imersiva que desemboca em um catálogo claro, compacto e escaneável; no mobile, hierarquia orientada ao pedido com categorias sticky e navegação inferior.
- Grid: hero assimétrico em 12 colunas, mídia dominante com recortes verticais; destaques em trilho horizontal; catálogo em uma coluna com texto à esquerda e miniatura à direita. Não reproduzir a referência pixel a pixel.
- Tipografia: `Manrope`, `Inter` e fallback system sans, com display condensado por peso e tracking — sem serifas decorativas. Títulos editoriais fluidos, interface compacta e legível.
- Movimento: Anime.js com entradas por máscara/opacidade, órbitas lentas e microfeedback de 180–420ms. Respeitar `prefers-reduced-motion`; nada de parallax agressivo.

## Paleta

- Cosmos 950 `#041025`: fundo principal noturno.
- Cosmos 900 `#071A38`: superfícies escuras.
- Cobalto 700 `#174AA6`: cor de marca funcional.
- Cobalto 500 `#3979F6`: foco e controles ativos.
- Nebulosa `#7857D6`: acento atmosférico usado com parcimônia.
- Prata `#D8E2F2`: linhas e texto frio.
- Luz `#F8FAFF`: fundo do catálogo.
- Tinta `#111827`: texto do catálogo.
- Salmão `#F47F62`: acento gastronômico, nunca como grande fundo.
- Ouro `#C8A96A`: detalhes premium discretos.
- Sucesso `#61D6B1`, alerta/fechado `#FFB36B`.

## Superfícies e forma

Catálogo majoritariamente claro, com cards brancos e divisores `#E7EAF0`. Raios: 10px em controles compactos, 18px em cards, 24–32px em painéis editoriais. A área escura usa bordas brancas translúcidas e sombras azuladas profundas. Evitar glassmorphism excessivo, gradientes arco-íris e visual de SaaS.

## Componentes essenciais

- Header: emblema real + wordmark LUNARE, links editoriais e CTA “Ver cardápio”.
- Hero: frase “O segredo está nos detalhes!”, posicionamento “Premium Japanese Food”, CTAs para cardápio e experiência, mídia oficial fornecida e aviso conceitual discreto.
- Status da loja: “Estamos fechados”, pedido mínimo “R$ 10,00” e “Campos Gerais — MG”; todos marcados para validação.
- Categorias: trilho horizontal com estado ativo claro e comportamento sticky.
- Destaques: próximo card parcialmente visível no mobile.
- Item: nome, descrição curta, preço e thumbnail; clique abre ficha em bottom sheet no mobile/modal lateral no desktop.
- Busca: expansão suave, placeholder “Buscar produto”, filtro instantâneo e estado “Nenhum produto encontrado”.
- Carrinho/checkout: apenas demonstração local, com entrega/retirada fictícia, sem dados sensíveis nem transmissão.
- Bottom nav mobile: Início, Promoções, Desconto e Pedidos.

## Conteúdo e guardrails

Usar somente as mídias locais fornecidas, o emblema lunar fornecido e ícones Lucide. Não inventar prêmios, avaliações, depoimentos, tempo de entrega, alegações nutricionais ou aprovação oficial. Preços, horários, endereço e descrições: “validar com o estabelecimento”. Exibir sempre “Protótipo conceitual — nenhum pedido será enviado.” e, ao concluir, “Demonstração concluída: nenhum pedido ou pagamento foi processado.”

## Responsividade e acessibilidade

Mobile-first a partir de 360px; desktop editorial a partir de 960px. Alvos mínimos de 44px, foco visível, contraste WCAG AA, modais com foco gerenciado e Escape, textos alternativos descritivos, rolagem horizontal acessível e animação reduzida quando solicitada.
