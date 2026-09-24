# Lunare Restaurante

## Business Context
- **Type/Industry:** Japanese sushi restaurant delivery ordering
- **What they do:** Accept online orders for sushi, rolls, appetizers, and beverages with delivery to Campos Gerais, MG
- **Target audience:** Local customers ordering food delivery via mobile/web
- **Page goal:** Browse menu categories, view dish details with images and prices, add items to cart

# Page Layout & Structure

### Header / Navigation
Dark blue horizontal bar (background) with left-aligned logo (white circle with "LUNARE" text, 60px diameter), restaurant name "Lunare Restaurante" as h3 below logo on white background. Status line: cyan "Delivery aberto" badge + "Mínimo: R$ 10,00" + dark gray "Informações" link. Location text "Campos Gerais - MG" with pin icon. Search icon (white pill button, top right). Not sticky.

### Hero
None — page opens directly to header + category nav.

### Category Navigation
Horizontal scrollable row of 10 category buttons, each: circular image (60px, dark blue background), label below in dark gray. Categories: ENTRADAS, COMBINA…, HOSSOMAKI, URAMAKI, HOT ROLL, JYO, SASHIMI, NIGUIRI, TEMAKI, BEBIDAS. Sticky below header.

### Destaques (Featured)
- **Purpose:** Highlight 2 premium dishes above the category sections.
- **Layout:** 2-card grid, each card = rounded image (tall 0.80:1) + h3 dish name + description (dark gray, 2 lines) + price (dark gray). Cards sit on white background.

### Menu Sections ×13
Converged structure: category h2 (dark gray, bold) + product list (h2 per dish). Each product = left-aligned text block (h2 name + description in dark gray + price in dark gray) + right-aligned rounded product image (0.56:1 or 1.00:1 ratio, depending on dish). Divider line (light gray) below each dish. No background alternation between sections.

### Bottom Navigation
Fixed footer bar (white background, dark blue icons + text): 4 buttons in uniform grid — "Início" (home icon, blue text), "Promoções" (gear icon, dark gray), "Desconto" (tag icon, dark gray), "Pedidos" (checkmark icon, dark gray). Positioned above page fold on all screens.

### Footer
Single-line centered text: "Desenvolvido por" (gray) + "Takeat" logo (gray italic).

**Notable patterns:** 
- Category navigation sticky below header throughout all menu sections.
- Product listings: text left, rounded image right; consistent 0.56:1 and 1.00:1 thumbnails.
- No grid — all product rows are 2-column (text / image) aligned horizontally.
- Bottom nav is fixed and persistent.
- Color scheme: white page background, dark blue header, cyan accent for status, dark gray text, rounded corners on images and category buttons.