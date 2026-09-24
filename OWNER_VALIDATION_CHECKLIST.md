# Checklist de validação do proprietário — Lunare

Este documento separa a experiência já implementada dos dados que ainda são provisórios. Marque um item somente após conferir com a fonte oficial. **Não remover o aviso de protótipo nem o `noindex,nofollow` antes da aprovação final.**

## 1. Identidade da marca

- [ ] Confirmar o nome público exato: **Lunare Restaurante**, **Lunare Sushi** ou outra forma oficial.
- [ ] Aprovar ou corrigir o posicionamento “Premium Japanese Food”.
- [ ] Aprovar ou substituir o texto “O segredo está nos detalhes!”.
- [ ] Entregar logo oficial preferencialmente em SVG, com versões clara, escura e reduzida.
- [ ] Aprovar o emblema usado hoje e o favicon provisório derivado dele.
- [ ] Confirmar paleta, tipografia, área de respiro e regras de aplicação da marca.
- [ ] Informar razão social e CNPJ somente se esses dados realmente devam aparecer no site final.

## 2. Fotografias, vídeos e direitos

- [ ] Confirmar por escrito que o Lunare pode usar comercialmente todos os arquivos em `public/media`.
- [ ] Identificar autor/fotógrafo e créditos obrigatórios de cada arquivo, se houver.
- [ ] Confirmar que pessoas, marcas e embalagens visíveis têm autorização de publicação.
- [ ] Validar a correspondência entre cada foto e o produto/categoria em que ela aparece.
- [ ] Aprovar enquadramentos e cortes em 360, 390, 768, 1024 e 1440 px.
- [ ] Escolher a foto oficial do hero e fornecer uma alternativa horizontal se necessário.
- [ ] Fornecer uma arte social aprovada em 1200×630; o preview atual usa uma imagem WebP vertical provisória.
- [ ] Revisar e aprovar os textos alternativos das imagens informativas.
- [ ] Decidir quais vídeos permanecem no acervo e quais podem ser removidos do bundle final.

## 3. Cardápio

- [ ] Revisar as dez categorias: Entradas, Combinados, Hossomaki, Uramaki, Hot Roll, Jyo, Sashimi, Niguiri, Temaki e Bebidas.
- [ ] Aprovar nome, descrição, foto, preço em BRL e disponibilidade de **cada item** em `src/data/menu.ts`.
- [ ] Confirmar quantidades de peças e preços de todas as variantes.
- [ ] Confirmar adicionais, limites de seleção e respectivos preços.
- [ ] Confirmar quais escolhas são obrigatórias em cada ficha de produto.
- [ ] Informar ingredientes e modo de preparo suficientes para descrições corretas.
- [ ] Informar alergênicos, risco de contaminação cruzada e avisos aplicáveis a pescado cru.
- [ ] Confirmar itens vegetarianos/veganos, sem glúten ou sem lactose antes de publicar qualquer selo.
- [ ] Confirmar produtos temporariamente indisponíveis e a origem operacional desse status.
- [ ] Revisar ortografia e nomenclatura culinária, inclusive “Jyo”, “Hossomaki” e “Niguiri”.

Todos os produtos atuais estão marcados como conteúdo que exige validação do proprietário.

## 4. Operação, endereço e atendimento

- [ ] Confirmar cidade/UF exibida: **Campos Gerais — MG**.
- [ ] Confirmar endereço completo hoje mockado como **Rua Dom Inocêncio Engelke, 691 — Centro**.
- [ ] Confirmar horários hoje mockados como **segunda a sábado, 18h às 22h; domingo fechado**.
- [ ] Informar feriados, exceções, pausa entre turnos e horário-limite para pedidos.
- [ ] Confirmar as modalidades oferecidas: entrega e/ou retirada.
- [ ] Confirmar pedido mínimo; o protótipo usa **R$ 10,00**.
- [ ] Confirmar taxa de entrega; a demonstração usa **R$ 5,90** sem consultar endereço.
- [ ] Definir bairros/CEPs atendidos, raio, taxas por região e regras de área não atendida.
- [ ] Definir estimativas reais para preparo, entrega e retirada.
- [ ] Confirmar se pedidos podem ser agendados.
- [ ] Informar telefone e WhatsApp oficiais, com autorização para exibição e link direto.
- [ ] Definir o comportamento correto quando a loja estiver fechada.

## 5. Pagamento, promoções e pedido

- [ ] Confirmar métodos de pagamento realmente aceitos e em quais modalidades.
- [ ] Escolher o provedor de pagamento da fase futura e validar requisitos de PCI e antifraude.
- [ ] Definir política de troco, cancelamento, estorno e pedido não entregue.
- [ ] Confirmar se cupons existirão no produto real e quem poderá criá-los.
- [ ] Manter `LUNARE10` identificado como cupom fictício ou substituí-lo por uma regra oficial integrada ao backend.
- [ ] Validar arredondamento, taxa, desconto, mínimo, subtotal e total com o processo comercial real.
- [ ] Definir um identificador oficial de pedido; o número atual existe somente no navegador.

## 6. Links e presença digital

- [ ] Confirmar Instagram: <https://www.instagram.com/lunaresushi>.
- [ ] Confirmar referência atual de cardápio: <https://pedido.takeat.app/lunare>.
- [ ] Informar domínio oficial e variação preferida com ou sem `www`.
- [ ] Confirmar links de WhatsApp, Google Maps e demais redes sociais.
- [ ] Decidir se links externos abrem em nova aba e revisar seus nomes acessíveis.
- [ ] Remover qualquer destino antigo ou não administrado pelo Lunare.

## 7. Textos e alegações

- [ ] Aprovar todo o texto da primeira dobra, manifesto, experiência, princípios e informações da casa.
- [ ] Validar alegações como “premium”, “frescor”, “selecionado”, “autoral” e “preparado no momento”.
- [ ] Remover qualquer alegação que não possa ser comprovada operacionalmente.
- [ ] Aprovar mensagens de loja aberta/fechada, indisponibilidade, erros e sucesso.
- [ ] Aprovar a linguagem do checkout e deixar inequívoca a diferença entre retirada e entrega.
- [ ] Definir tom de voz oficial e pessoa responsável por futuras atualizações.

## 8. SEO, publicação e dados estruturados

- [ ] Configurar `VITE_CANONICAL_URL` com o domínio oficial aprovado.
- [ ] Aprovar title, meta description, Open Graph, Twitter Card e favicon.
- [ ] Validar nome, culinária e moeda já presentes no JSON-LD mínimo.
- [ ] Somente depois de validar, acrescentar ao JSON-LD endereço, horários, telefone, menu, faixa de preço e perfis oficiais.
- [ ] Testar o JSON-LD no validador de dados estruturados antes da publicação.
- [ ] Manter `noindex,nofollow` durante toda a fase de demonstração.
- [ ] Autorizar por escrito a indexação antes de alterar a diretiva de robôs.
- [ ] Confirmar que o lançamento não apresenta o protótipo como site oficial antes dessa autorização.

## 9. Privacidade, termos e segurança da fase futura

- [ ] Definir controlador, operadores e contato de privacidade conforme LGPD.
- [ ] Aprovar política de privacidade, termos de uso e política de cookies.
- [ ] Mapear dados realmente necessários para pedido e eliminar campos excessivos.
- [ ] Definir base legal, consentimentos, retenção, exclusão e resposta a titulares.
- [ ] Aprovar fornecedores de hospedagem, pedidos, pagamento, mapas, analytics e mensagens.
- [ ] Definir segurança, controle de acesso, logs, backups e resposta a incidentes.
- [ ] Revisar acessibilidade com teclado, zoom, leitor de tela e movimento reduzido antes do lançamento.

## 10. Aprovação final

- [ ] Todo conteúdo provisório foi substituído ou aprovado.
- [ ] Todas as ações e destinos foram testados no domínio de homologação.
- [ ] Preços e cálculos conferem com uma amostra do processo real.
- [ ] Direitos de logo, fotos, vídeos e ícones estão documentados.
- [ ] Responsável operacional aprovou o fluxo aberto/fechado, entrega e retirada.
- [ ] Responsável legal aprovou privacidade, termos e coleta de dados da fase futura.
- [ ] Proprietário autorizou a publicação oficial e, separadamente, a indexação.

### Registro de aprovação

| Campo | Preencher |
| --- | --- |
| Nome do responsável |  |
| Função |  |
| Versão/commit revisado |  |
| Domínio de homologação |  |
| Data |  |
| Observações e pendências |  |

