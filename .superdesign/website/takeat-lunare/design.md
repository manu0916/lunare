---
version: "superdesign-alpha"
name: "Ledger Row Commerce"
description: "A light, list-driven ordering system: a single square navy bar, circular category icons, and dense white/pale-gray menu rows carrying square-cropped media bleeding against the right edge."
colors:
  background: "#F6F6F6"
  surface: "#FFFFFF"
  navbar: "#2B4B8B"
  text-primary: "#0A0A0A"
  text-secondary: "#545454"
  text-tertiary: "#7A7A7A"
  accent: "#2EC9B7"
  accent-blue: "#3C81F5"
  border: "#EDEDED"
  border-strong: "#202020"
typography:
  headline-md:
    fontFamily: "Poppins"
    fontSize: "20px"
    fontWeight: 600
    lineHeight: "1.2"
  body-md:
    fontFamily: "Poppins"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: "1.43"
  label-md:
    fontFamily: "Poppins"
    fontSize: "18px"
    fontWeight: 600
    lineHeight: "1.33"
  body-reading:
    fontFamily: "Poppins"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: "1.5"
  ui-fallback:
    fontFamily: "ui-sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: "1.43"
spacing:
  base: "4px"
  gap-sm: "8px"
  gap-md: "12px"
  gap-lg: "16px"
section-padding: "12px"
rounded:
  control: "8px"
  card: "12px"
  avatar-logo: "50px"
  pill: "50px"
  panel-sharp: "8px"
components:
  button-primary-hero:
    background: "#2EC9B7"
    text-color: "#FFFFFF"
    radius: "8px"
    height: "40px"
    note: "observed — approximate fill/radius from screenshot, not separately measured"
  category-icon:
    background: "#FFFFFF"
    radius: "50px"
    height: "56px"
    border: "1px solid #EDEDED"
  menu-row-card:
    background: "transparent"
    radius: "0px"
    padding: "0px 0px 12px"
    border-bottom: "1px solid #EDEDED"
  highlight-card:
    background: "#FFFFFF"
    radius: "12px"
    padding: "0px"
    border: "1px solid #EDEDED"
  navbar-bar:
    background: "#2B4B8B"
    radius: "0px 0px 0px 0px"
    height: "90px"
---
# Ledger Row Commerce
Source: https://pedido.takeat.app/lunare

## Overview
This is a light-mode, information-first ordering interface — closer to Swiss-adjacent ledger typography than to marketing-site spectacle. Its entire character is carried by dense repeated rows: a heading, a one-line description in muted gray, a price in bold black, and a small square photograph bled to the right edge of each row. Color is almost absent — the page reads as roughly 70% pure white and 25% pale gray field, with a single saturated navy plane confined to the top bar. There is no gradient hero, no bento grid, no glass; the aesthetic is utilitarian catalog design, structured entirely by horizontal dividers and consistent left-text/right-image rhythm.

## Composition
The first screen opens with a full-width square navy bar holding only a circular logo mark at the left. Below it, plain-text status/location metadata sits directly on the white page, followed by a horizontal scrolling rail of circular category icons (10 across), then a two-up highlight grid of white cards holding a top-half photo and text below. From there the page becomes one long vertical list: a bold section label, then unbroken rows of item-title / description / price with a small thumbnail on the right, divided by hairline rules — repeating for roughly a dozen sections. The deliberate choice is a single-column ledger of rows rather than a multi-column card grid for the bulk of the catalog; this rejects a uniform image-forward card grid in favor of text-led scanability, with imagery demoted to a small identifying thumbnail rather than a hero visual.

## Colors
Background is white (`#FFFFFF`, ~46% declared area) paired with a near-identical pale gray (`#F6F6F6`, ~53% declared area) used to alternate section backgrounds — together these two near-white tones dominate the rendered pixel field (~70% white, ~25% light gray), confirming the page is fundamentally a white-surface system, not a dark or tinted one. The single saturated color, navy (`#2B4B8B`), is rationed entirely to the top navigation bar — a thin full-width band at the very top of the page, well under 5% of total area — and reappears nowhere else as a fill. Text ink runs `#0A0A0A` for titles and prices, `#545454` for descriptive body copy, and `#7A7A7A` for tertiary/meta labels. Borders are hairline `#EDEDED` (row dividers) and `#202020` (stronger structural rules). A teal (`#2EC9B7`) exists as an available accent/token but is not visibly load-bearing across the screenshots — treat it as reserved for a primary action rather than decorative use. Nothing else is colored: icons, thumbnails' surrounding chrome, and section backgrounds are left neutral so the (uncolored) food photography supplies all remaining color incident.

## Typography
Everything is set in Poppins, a geometric sans, with hierarchy built entirely from weight and size rather than family changes — there is no serif or mono accent anywhere in this system. Item titles use a semibold label style (`18px/600`, lh 1.33) or headline weight (`20px/600`, lh 1.2) for section headers. Body/description copy sits at `14px/400` (lh 1.43) in the secondary gray tone, with a slightly larger `16px/400` reading size for denser paragraph copy. Prices are bold black, set at body scale but weighted for emphasis through color contrast (`#0A0A0A` against `#545454` neighbors) rather than a larger size. No italic, no display-scale text, no letter-spacing tricks — the whole system relies on a tight three-step weight/size ladder repeated hundreds of times.

## Layout
The structure is a single-column, full-bleed list layout, not a column grid: each menu section is a stack of rows, each row a two-part split of flexible text block (left) plus a fixed small square image (right), divided by 1px hairlines. Highlighted items at the top of the page use a genuine 2-up card grid (rows of [2]), while further down a wider showcase section shows rows of 8 and 7 equal-width items (99% each — effectively full-bleed single-file panels, one per row visually but grouped as sets). Padding is tight and consistent: rows carry `0px 0px 12px` bottom padding only, meaning vertical rhythm is achieved by padding-bottom plus a border, not by boxed card padding on all sides. Corner radius is 0px throughout the row list — flat, sharp-edged panels — while only the top highlight cards and category icons carry radius (`12px` cards, `50px` circular icons). There is no max-width containment visible; content runs the full viewport width with no side gutters beyond the default text inset. Density is high: rows are compact, single-line-description, with no whitespace buffer between adjacent sections beyond the divider itself.

## Components
- **Navbar**: edge-to-edge square bar, 90px tall, full viewport width (0px left/right inset), all four corners 0px radius (perfectly square, no rounding at any corner), fill `#2B4B8B`, static/non-scrolling behavior implied by placement; holds a single circular logo mark at the left and no nav links or CTA in the measured state (0 items) — this is a minimal identity bar, not a link-bearing navigation.
- **Category icon rail**: appears directly below page metadata, arranged as a horizontal scrolling rail (~10 up), each a circular (`50px` radius) white/photo-filled disc roughly 56px in diameter with a text label below in small caps-style gray type; no border shown beyond implied hairline separation from background.
- **Highlight card** (top of page): ×2 in a row, white fill, `12px` radius, thin `#EDEDED` border, no declared padding on the outer shell; anatomy top to bottom — a top-half photographic image filling roughly 60% of card height, then a bold title, a 2–3 line gray description, and a bold black price at the base.
- **Menu row card** (bulk of page, repeated ×15/×14/×9/×8/×7 per measured section): transparent background, `0px` radius, `0px 0px 12px` padding, bottom hairline divider; anatomy left-to-right — a bold title, a single-line gray description beneath it, a bold black price below that — paired with a small square thumbnail image bled to the right edge of the row, uncropped card boundary (full-width panel + right-bleed media pattern). No CTA, chip, or button sits inside these rows; the row itself is presumably the tap target.
- **Section label**: a bold uppercase-style heading (`20px/600`) sitting flush left above each row group, no background treatment, acting as a plain divider between menu categories.
- **Bottom utility list** (e.g. beverage rows near page end): same row-card pattern but with a thumbnail sometimes omitted, showing the anatomy can degrade to title + price only when no distinguishing image exists.
- **Bottom tab bar** (mobile chrome, seen at first screen): four equal icon+label items in a row, flat white background, plain gray/navy iconography, no pill or elevation treatment — a simple fixed utility strip rather than a styled component.

## Graphics & Effects
No gradients, glass, or blur are present anywhere in this system — every surface is a flat fill. The only imagery is direct food/product photography, square- or near-square-cropped, used at two scales: large (top-half of highlight cards) and small (thumbnail bled to the row's right edge in the list). Photography carries all chromatic richness in the layout (oranges, reds of food) against the otherwise neutral gray/white/navy shell. No noise, grain, or pattern texture is visible; surfaces are clean and computational rather than textured. Elevation is communicated only through hairline borders and background-tone shifts (white vs `#F6F6F6`), never through drop shadow — this is a flat, non-elevated visual language.

## Motion
Interactive transitions use `all 0.3s ease-in-out` as the general-purpose state change (hover/press feedback on rows and icons) with a slower `width 0.4s ease-in-out` reserved for expanding elements (likely search or filter controls). Ambient keyframes available in the system — `ping`, `pulse`, `spin`, `enter`, `exit` — support small utility indicators (a live "open" status dot, loading spinners) rather than decorative motion; there is no scroll-triggered or parallax animation implied anywhere in this catalog-style layout. Motion here is strictly functional feedback, not spectacle.

## Guardrails
- Do not introduce a dark or gradient hero — the field is white/pale-gray dominant; navy is confined to a single flat top bar only.
- Do not round the menu-row cards — they are strictly `0px` radius, sharp full-width panels divided by hairlines, not boxed cards with padding on all sides.
- Do not upsize the row thumbnails into hero media — they are small right-bled squares subordinate to the text block, not the visual focus.
- Do not add drop shadows or glass blur — elevation is expressed only through hairline borders and background-tone alternation.
- Do not treat the teal accent as a large fill — it is a reserved token, not an observed dominant color in this catalog.
- Preserve the navbar's exact square, edge-to-edge, un-rounded, minimal (logo-only) geometry — do not turn it into a link-filled generic navbar.