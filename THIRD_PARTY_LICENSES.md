# Licenças de terceiros e proveniência

Inventário preparado em 23/09/2026 a partir das versões resolvidas em `package-lock.json` e dos manifestos instalados. Cada projeto conserva seus próprios direitos autorais, avisos e termos; os textos integrais estão nos arquivos `LICENSE` dos pacotes em `node_modules` e nos repositórios vinculados.

## Dependências de execução

| Projeto | Versão instalada | Licença | Projeto oficial |
| --- | ---: | --- | --- |
| Anime.js | 4.5.0 | MIT | <https://animejs.com> |
| Lucide React | 0.468.0 | ISC | <https://lucide.dev> |
| React | 18.3.1 | MIT | <https://react.dev> |
| React DOM | 18.3.1 | MIT | <https://react.dev> |
| React Router DOM | 7.18.4 | MIT | <https://reactrouter.com> |
| Zustand | 5.0.15 | MIT | <https://github.com/pmndrs/zustand> |

Os ícones de interface são fornecidos por Lucide e permanecem sob a licença ISC do projeto.

## Ferramentas de desenvolvimento e testes

| Projeto | Versão instalada | Licença |
| --- | ---: | --- |
| Vite | 6.4.3 | MIT |
| `@vitejs/plugin-react` | 4.7.0 | MIT |
| TypeScript | 5.7.3 | Apache-2.0 |
| ESLint / `@eslint/js` | 9.39.5 | MIT |
| typescript-eslint | 8.70.1 | MIT |
| eslint-plugin-react-hooks | 5.2.0 | MIT |
| eslint-plugin-react-refresh | 0.4.26 | MIT |
| Vitest | 5.0.1 | MIT |
| jsdom | 25.0.1 | MIT |
| Testing Library React | 16.3.3 | MIT |
| Testing Library jest-dom | 6.9.1 | MIT |
| Testing Library user-event | 14.6.7 | MIT |
| `@types/react` | 18.3.31 | MIT |
| `@types/react-dom` | 18.3.7 | MIT |
| globals | 15.15.0 | MIT |

Dependências transitivas também permanecem sob suas licenças individuais. Para uma distribuição, preserve o `package-lock.json` e gere o inventário completo da árvore instalada como parte do processo de release.

## Mídias e identidade

- As fotografias, os vídeos e o emblema originais em `public/media` foram fornecidos pelo usuário em 23/09/2026 especificamente para esta demonstração.
- Os WebP em `public/images/food` são conversões locais dos mesmos arquivos. A conversão não concede novos direitos de uso.
- Os WebP em `public/images/menu` foram copiados localmente em 23/09/2026 de uma exportação da página pública `https://pedido.takeat.app/lunare` entregue pelo usuário. Não há hotlink; a cópia local também não concede novos direitos de uso.
- A autorização comercial, a autoria e eventuais créditos obrigatórios **não foram verificados de forma independente**. O proprietário deve confirmá-los antes de qualquer publicação.
- `public/icons/lunare-favicon.svg` é uma interpretação técnica provisória do emblema fornecido, criada para este protótipo. Ela não substitui o arquivo oficial da marca e precisa de aprovação.
- `public/images/brand/washi-seigaiha-midnight.jpg` é uma textura abstrata gerada por IA para este protótipo. Não contém marca de terceiro nem tenta substituir o logotipo ou fotografias reais; sua aprovação de uso ainda cabe ao proprietário.
- O projeto usa fontes do sistema; não incorpora arquivos de fontes comerciais ou remotas.

## Referências externas

Instagram serviu como referência pública de contexto. O Takeat foi usado como fonte da correspondência entre nomes e fotografias do cardápio, a partir do HTML salvo pelo usuário. Nenhum asset é carregado dessas páginas em tempo de execução, não existe hotlink e nenhum código ou interação proprietária foi copiado. Os links externos devem ser validados pelo proprietário.

## Antes de redistribuir

- [ ] Confirmar os avisos de todas as dependências diretas e transitivas do build final.
- [ ] Preservar os textos das licenças MIT, ISC e Apache-2.0 exigidos pelos respectivos projetos.
- [ ] Obter autorização escrita para logo, fotografias e vídeos.
- [ ] Confirmar créditos ou restrições aplicáveis às mídias.
- [ ] Trocar ou aprovar o favicon provisório.
