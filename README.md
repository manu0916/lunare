# Lunare — experiência digital demonstrativa

Protótipo front-end do Lunare Restaurante com home editorial, cardápio configurável e jornada completa de pedido fictício. O projeto é uma demonstração conceitual: **não é o site oficial**, não envia pedidos, não processa pagamentos e não persiste dados pessoais.

## Executar localmente

Pré-requisito: Node.js compatível com Vite 6 e npm.

```bash
npm ci
npm run dev
```

O terminal informa o endereço local do Vite. Para apresentar os controles de demonstração, acrescente `?demo=1` à URL, por exemplo `http://localhost:5173/?demo=1`.

### Comandos disponíveis

| Comando | Finalidade |
| --- | --- |
| `npm run dev` | inicia o servidor de desenvolvimento |
| `npm run typecheck` | valida TypeScript em modo estrito |
| `npm run lint` | executa ESLint sem aceitar avisos |
| `npm run test` | executa a suíte Vitest uma vez |
| `npm run test:watch` | executa testes em modo interativo |
| `npm run build` | faz typecheck e gera o bundle em `dist/` |

Para conferir a entrega completa antes de publicar:

```bash
npm run typecheck
npm run lint
npm run test
npm run build
```

## Rotas e estados demonstráveis

- `/`: apresentação da marca, experiência, favoritos, manifesto, categorias, galeria e informações da casa.
- `/cardapio`: dez categorias, mais de 30 itens mockados, busca, navegação por seção, destaques, indisponibilidade, ficha configurável e carrinho.
- `/checkout`: retirada ou entrega, cupom fictício `LUNARE10`, formas de pagamento apenas visuais e revisão dos totais.
- `/pedido-demo/sucesso`: confirmação explícita de que a simulação terminou localmente.
- Qualquer rota desconhecida: página 404 da marca.

O painel `?demo=1` alterna loja aberta/fechada, preenche um carrinho de amostra, ativa movimento reduzido, reinicia o estado e facilita a navegação da apresentação.

## Arquitetura

O projeto usa React 18, TypeScript estrito, React Router, Zustand, Anime.js, CSS Modules, Lucide e Vitest/Testing Library.

```text
src/
  app/              definição das rotas com carregamento sob demanda
  components/       layout, navegação, diálogos e componentes visuais
    ui/              primitivas reutilizáveis, como imagem responsiva
  data/              cardápio, restaurante e cupom demonstrativo
  lib/               moeda, preço, storage e metadados de SEO
  pages/             composição das rotas
  store/             estado do pedido e persistência local versionada
  styles/            tokens de marca e estilos globais
  test/              testes unitários, de componente, fluxo e acessibilidade
  AppV2.tsx          shell, efeitos de navegação e overlays globais
public/
  icons/             favicon local
  images/food/       imagens WebP responsivas
  images/menu/       fotos locais associadas ao cardápio salvo do Takeat
  media/             arquivos originais fornecidos para o protótipo
```

Responsabilidades importantes:

- preços são inteiros em centavos e os cálculos ficam em funções puras;
- `src/data/menu.ts` e `src/data/restaurant.ts` centralizam conteúdo substituível;
- o Zustand persiste somente carrinho, modalidade, cupom e sinalizadores da demo em `localStorage`; dados digitados no checkout e o último pedido não são persistidos;
- o storage possui versão, validação e recuperação para conteúdo inválido;
- as animações são progressivas: conteúdo e ações continuam disponíveis quando motion é reduzido ou JavaScript de animação falha;
- não há cliente HTTP de pedidos, SDK de pagamento, analytics ou chamada a backend.

## Decisões autorais

1. A linguagem visual parte do azul noturno e de órbitas discretas para criar uma atmosfera própria, sem transformar a interface em uma reprodução das referências.
2. A home tem ritmo editorial; o cardápio muda para uma densidade mais operacional, preservando a mesma identidade.
3. Mobile usa navegação inferior, cards compactos, sheet e CTA acessível; desktop privilegia grid, respiro e drawer lateral.
4. Motion usa Anime.js nas coreografias principais, com tokens compartilhados, transform/opacity e alternativa quase imediata para `prefers-reduced-motion`.
5. O fluxo inteiro explicita que é uma simulação. Cupom, taxa, pagamento e confirmação existem apenas para demonstrar a experiência.
6. Informações não confirmadas são marcadas no modelo ou omitidas do SEO estruturado.
7. O cardápio segue a direção “Editorial Bento Atelier”: hero dividido, marfim quente, azul meia-noite, dourado fosco e componentes compactos, aplicados ao catálogo inteiro — não a um único produto.

## SEO e compartilhamento

`index.html` contém idioma `pt-BR`, descrição transparente, favicon local, Open Graph, Twitter Card e JSON-LD mínimo de `Restaurant`. Endereço, telefone e horário foram omitidos do JSON-LD porque ainda precisam de validação.

Enquanto o projeto for uma demo, `robots` permanece em `noindex,nofollow`. O componente `Seo` atualiza título, descrição e canonical por rota. Configure apenas a origem pública aprovada no build:

```bash
VITE_CANONICAL_URL=https://dominio-aprovado.example npm run build
```

No PowerShell:

```powershell
$env:VITE_CANONICAL_URL = 'https://dominio-aprovado.example'
npm run build
```

Sem essa variável, o navegador usa a origem atual. A remoção de `noindex,nofollow` deve ocorrer somente depois da aprovação do proprietário e da troca do protótipo por uma publicação oficial.

### Publicação na Vercel

O repositório inclui `vercel.json` com o preset do Vite e fallback de SPA para que acessos diretos a `/cardapio`, `/checkout` e `/pedido-demo/sucesso` abram o React Router corretamente. A Vercel pode usar o comando `npm run build` e o diretório de saída `dist`, detectados pelo preset. A pasta de evidências visuais `qa/` é mantida no projeto, mas excluída do pacote de deploy por `.vercelignore`.

## Conteúdo, assets e licenças

As fotografias, vídeos e o emblema foram fornecidos pelo usuário para esta demonstração. As variantes WebP em `public/images/food` são derivados técnicos desses arquivos, sem alteração de titularidade. As fotos em `public/images/menu` vieram da página do Takeat salva e entregue pelo usuário; ficam locais no projeto e não usam hotlink. Autorização comercial, associação final de cada foto ao produto e versão definitiva da marca continuam pendentes.

Consulte:

- [`ASSETS.md`](./ASSETS.md) para o inventário de mídia;
- [`MENU_IMAGE_MAPPING.md`](./MENU_IMAGE_MAPPING.md) para a correspondência entre produtos e fotos do cardápio salvo;
- [`THIRD_PARTY_LICENSES.md`](./THIRD_PARTY_LICENSES.md) para dependências, ícones e proveniência;
- [`OWNER_VALIDATION_CHECKLIST.md`](./OWNER_VALIDATION_CHECKLIST.md) para tudo que precisa de aprovação antes de publicar.
- [`design-qa.md`](./design-qa.md) para a comparação visual, breakpoints inspecionados e evidências da revisão final.

## Limitações reais desta V1

- Cardápio, preços, disponibilidade, alérgenos, endereço, horários, taxa e pedido mínimo são conteúdo de demonstração até validação formal.
- O checkout não consulta CEP, área de entrega, estoque, cozinha ou capacidade operacional.
- Pagamentos não são tokenizados nem transmitidos; as opções são apenas representações visuais.
- O carrinho pertence somente ao navegador atual e pode ser apagado pelo usuário.
- Não há autenticação, painel administrativo, telemetria, monitoramento ou recuperação remota de pedidos.
- Testes automatizados em JSDOM não substituem a validação manual em aparelhos reais, leitores de tela e condições de rede variadas.
- O asset social atual é WebP vertical; a publicação oficial deve receber uma arte 1200×630 aprovada para previews mais previsíveis.

## Fase futura de backend

Somente após aprovação do protótipo, a evolução recomendada é integrar uma fonte oficial de cardápio/estoque, cálculo de área e taxa de entrega, criação idempotente de pedidos, autenticação administrativa, observabilidade e provedor de pagamento compatível com PCI. Essa fase também deve definir LGPD, consentimento, retenção, exclusão, política de privacidade, termos e responsáveis pelo tratamento antes de coletar qualquer dado pessoal.
