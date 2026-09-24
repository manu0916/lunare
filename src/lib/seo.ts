const DEFAULT_TITLE = 'Lunare — experiência japonesa | Demonstração';
const DEFAULT_DESCRIPTION = 'Protótipo conceitual do Lunare Restaurante, com cardápio e pedido demonstrativos. Nenhum pedido ou pagamento é enviado.';
const SOCIAL_IMAGE_PATH = '/images/food/w1440/atmosfera-lunare.webp';

type RouteSeo = Readonly<{ title: string; description: string }>;

const ROUTE_SEO: Readonly<Record<string, RouteSeo>> = {
  '/': {
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
  },
  '/cardapio': {
    title: 'Cardápio demonstrativo | Lunare',
    description: 'Explore o cardápio conceitual do Lunare e monte um pedido inteiramente fictício, sem envio ou pagamento.',
  },
  '/checkout': {
    title: 'Revisar pedido demonstrativo | Lunare',
    description: 'Revise uma simulação de pedido do Lunare. Esta demonstração não coleta pagamento nem transmite o pedido.',
  },
  '/pedido-demo/sucesso': {
    title: 'Simulação concluída | Lunare',
    description: 'Confirmação local de uma simulação do Lunare. Nenhum pedido foi enviado e nenhuma cobrança foi realizada.',
  },
};

function configuredCanonicalBase(): URL | null {
  const configured = import.meta.env.VITE_CANONICAL_URL?.trim();
  if (!configured) return null;

  try {
    const url = new URL(configured);
    return url.protocol === 'https:' || url.protocol === 'http:' ? url : null;
  } catch {
    return null;
  }
}

function absoluteUrl(path: string, canonicalBase: URL | null): string {
  const base = canonicalBase ?? new URL(window.location.origin);
  return new URL(path, base).toString();
}

function upsertMeta(attribute: 'name' | 'property', key: string, content: string): void {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.append(element);
  }
  element.content = content;
}

function updateCanonical(pathname: string, canonicalBase: URL | null): string {
  const canonical = absoluteUrl(pathname, canonicalBase);
  let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.rel = 'canonical';
    document.head.append(link);
  }
  link.href = canonical;
  return canonical;
}

function updateRestaurantSchema(canonicalBase: URL | null): void {
  const schema: Record<string, string> = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: 'Lunare Restaurante',
    servesCuisine: 'Japanese',
    currenciesAccepted: 'BRL',
  };
  if (canonicalBase) schema.url = canonicalBase.toString();

  let script = document.head.querySelector<HTMLScriptElement>('#lunare-restaurant-schema');
  if (!script) {
    script = document.createElement('script');
    script.id = 'lunare-restaurant-schema';
    script.type = 'application/ld+json';
    document.head.append(script);
  }
  script.textContent = JSON.stringify(schema).replaceAll('<', '\\u003c');
}

export function applyRouteSeo(pathname: string): void {
  const route = ROUTE_SEO[pathname] ?? {
    title: 'Página não encontrada | Lunare — demonstração',
    description: DEFAULT_DESCRIPTION,
  };
  const canonicalBase = configuredCanonicalBase();
  const canonical = updateCanonical(pathname, canonicalBase);
  const socialImage = absoluteUrl(SOCIAL_IMAGE_PATH, canonicalBase);

  document.title = route.title;
  upsertMeta('name', 'description', route.description);
  upsertMeta('name', 'robots', 'noindex, nofollow');
  upsertMeta('name', 'googlebot', 'noindex, nofollow');
  upsertMeta('property', 'og:title', route.title);
  upsertMeta('property', 'og:description', route.description);
  upsertMeta('property', 'og:url', canonical);
  upsertMeta('property', 'og:image', socialImage);
  upsertMeta('name', 'twitter:title', route.title);
  upsertMeta('name', 'twitter:description', route.description);
  upsertMeta('name', 'twitter:image', socialImage);
  updateRestaurantSchema(canonicalBase);
}
