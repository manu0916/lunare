# Inventário de assets

| Arquivo | Origem | Uso | Substituição |
| --- | --- | --- | --- |
| `lunare-emblema.jpg` | Fornecido pelo usuário | Marca no header, informações e footer | Trocar por logo oficial em alta resolução, mantendo o nome ou atualizando as referências |
| `atmosfera-lunare.jpg` | Fornecido pelo usuário | Atmosfera e thumbnails neutras | Substituir por campanha aprovada |
| `combinado-caixas.jpg` | Fornecido pelo usuário | Combinados e galeria | Substituir por foto oficial horizontal ou manter crop editorial |
| `experiencia-lunar.jpg` | Fornecido pelo usuário | Poster de vídeo | Substituir por still aprovado |
| `hot-dourado.jpg` | Fornecido pelo usuário | Destaque e produto | Substituir por fotografia aprovada do item correspondente |
| `hossomaki-detalhe.jpg` | Fornecido pelo usuário | Produto | Substituir por fotografia aprovada |
| `hot-roll.jpg` | Fornecido pelo usuário | Produto | Substituir por fotografia aprovada |
| `embalagem-lunare.jpg` | Fornecido pelo usuário | Marca e produto | Substituir se a embalagem mudar |
| `niguiri-especial.jpg` | Fornecido pelo usuário | Produto | Substituir por fotografia aprovada |
| `sashimi-flor.jpg` | Fornecido pelo usuário | Seção editorial e produto | Substituir por fotografia aprovada |
| `lunare-filme-01.mp4` | Fornecido pelo usuário | Acervo, não carregado pela aplicação | Manter apenas se aprovado para uso futuro |
| `lunare-filme-02.mp4` | Fornecido pelo usuário | Acervo, não carregado pela aplicação | Manter apenas se aprovado para uso futuro |
| `lunare-filme-03.mp4` | Fornecido pelo usuário | Acervo, não carregado pela aplicação | Pode ser removido ou aplicado em campanha futura |
| `public/images/menu/*.webp` | Cópias locais do cardápio Lunare salvo pelo usuário a partir do Takeat | Categorias e produtos do cardápio | Confirmar autorização comercial e correspondência final antes de publicar |
| `washi-seigaiha-midnight.jpg` | Textura decorativa gerada para este protótipo | Fundo sutil do hero do cardápio | Pode ser substituída por uma textura oficial aprovada pela marca |

As variantes WebP responsivas ficam em `public/images/food/w720` e `w1440`. Antes da publicação, preserve os originais fora do bundle, aprove os cortes e remova mídias que não forem usadas.

As 38 imagens em `public/images/menu` foram extraídas da página salva `Lunare Restaurante.html` e de sua pasta acompanhante `Lunare Restaurante_files`, sem hotlink ou requisição ao Takeat em tempo de execução. O vínculo entre nomes, arquivos e fallbacks está documentado em `MENU_IMAGE_MAPPING.md`.

`public/images/brand/washi-seigaiha-midnight.jpg` é uma textura abstrata original gerada por IA para a demonstração, sem logotipo, texto ou fotografia de alimento. Ela funciona apenas como acabamento de superfície e não substitui nenhum ativo real da Lunare.
