import { ArrowRight, Plus, Search, SlidersHorizontal, Sparkles, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { categories, fallbackImage, findCategory, formatCurrency, products } from '../data/menu';
import { useReducedMotion, useSectionReveals } from '../hooks/useMotion';
import { animateMotion, motionEasings, motionTokens, MotionRegistry, settleMotionTargets, stagger } from '../lib/motion';
import { useOrderStore } from '../store/useOrderStore';
import type { CategoryId, Product } from '../types';
import { ResponsiveImage } from './ui/ResponsiveImage';
import styles from './MenuCatalogV2.module.css';

export function MenuCatalogV2() {
  const [params, setParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const initial = params.get('categoria') as CategoryId | null;
  const [initialCategory] = useState<CategoryId | null>(categories.some((item) => item.id === initial) ? initial : null);
  const [active, setActive] = useState<CategoryId>(initialCategory ?? 'entradas');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchFocused, setSearchFocused] = useState(false);
  const catalogRef = useRef<HTMLElement>(null);
  const categoriesRef = useRef<HTMLElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const reducedMotion = useReducedMotion();
  const selectProduct = useOrderStore((state) => state.selectProduct);
  const addItem = useOrderStore((state) => state.addItem);
  const demoMode = useOrderStore((state) => state.demoMode);
  const setClosedOpen = useOrderStore((state) => state.setClosedOpen);
  const storeStatus = useOrderStore((state) => state.storeStatus);

  const normalized = query.trim().toLocaleLowerCase('pt-BR');
  const visible = useMemo(
    () => products.filter((product) => !normalized || [product.name, product.description, ...product.tags].join(' ').toLocaleLowerCase('pt-BR').includes(normalized)),
    [normalized],
  );
  const featured = useMemo(() => products.filter((product) => product.featured && product.available).slice(0, 6), []);
  const chefPick = featured[1] ?? featured[0];
  const mostOrdered = featured.filter((product) => product.id !== chefPick?.id).slice(0, 4);

  useSectionReveals(catalogRef, loading ? 'loading' : 'ready');

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 220);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (loading || !initialCategory) return;
    const frame = window.requestAnimationFrame(() => {
      document.getElementById(`categoria-${initialCategory}`)?.scrollIntoView?.({ block: 'start' });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [loading, initialCategory]);

  useEffect(() => {
    if (loading || normalized || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver((entries) => {
      const visibleEntry = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visibleEntry) setActive(visibleEntry.target.id.replace('categoria-', '') as CategoryId);
    }, { rootMargin: '-30% 0px -58% 0px', threshold: [0, 0.2, 0.5] });
    categories.forEach((category) => {
      const element = document.getElementById(`categoria-${category.id}`);
      if (element) observer.observe(element);
    });
    return () => observer.disconnect();
  }, [loading, normalized]);

  useEffect(() => {
    const strip = categoriesRef.current;
    if (!strip) return;
    const activeButton = Array.from(strip.querySelectorAll<HTMLButtonElement>('[data-category]'))
      .find((button) => button.dataset.category === active);
    if (!activeButton) return;
    activeButton.scrollIntoView?.({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'nearest', inline: 'center' });
    const halo = activeButton.querySelector<HTMLElement>('[data-category-halo]');
    if (!halo || reducedMotion) return;
    const registry = new MotionRegistry();
    registry.add(animateMotion(halo, {
      opacity: [0.35, 1],
      scaleX: [0.55, 1],
      duration: motionTokens.standard,
      ease: motionEasings.expressive,
    }));
    return () => registry.clear();
  }, [active, reducedMotion]);

  useEffect(() => {
    const target = searchRef.current;
    if (!target || reducedMotion) return;
    const registry = new MotionRegistry();
    registry.add(animateMotion(target, {
      scale: [searchFocused ? 0.994 : 1.002, 1],
      duration: searchFocused ? motionTokens.standard : motionTokens.micro,
      ease: motionEasings.out,
    }));
    return () => registry.clear();
  }, [searchFocused, reducedMotion]);

  useEffect(() => {
    if (loading || !normalized) return;
    const results = Array.from(catalogRef.current?.querySelectorAll<HTMLElement>('[data-search-result]') ?? []);
    if (reducedMotion) {
      settleMotionTargets(results);
      return;
    }
    const animatedResults = results.slice(0, 12);
    settleMotionTargets(results.slice(12));
    const registry = new MotionRegistry();
    if (animatedResults.length > 0) {
      registry.add(animateMotion(animatedResults, {
        opacity: [0, 1],
        translateY: [10, 0],
        duration: motionTokens.standard,
        delay: stagger(24),
        ease: motionEasings.out,
      }));
    }
    return () => registry.clear();
  }, [loading, normalized, reducedMotion, visible.length]);

  const openProduct = (product: Product) => {
    if (!product.available) return;
    selectProduct(product.id);
    const next = new URLSearchParams(params);
    next.set('produto', product.id);
    navigate({ pathname: location.pathname, search: next.toString() }, { preventScrollReset: true });
  };

  const quickAdd = (product: Product) => {
    if (!product.available) return;
    if (product.variants.length > 0 || product.optionGroups.length > 0) {
      openProduct(product);
      return;
    }
    if (storeStatus === 'closed' && !demoMode) {
      setClosedOpen(true);
      return;
    }
    addItem({
      productId: product.id,
      quantity: 1,
      configuration: { variantId: null, optionIds: [], note: '' },
    });
  };

  const jumpTo = (categoryId: CategoryId) => {
    setActive(categoryId);
    const next = new URLSearchParams(params);
    next.set('categoria', categoryId);
    setParams(next, { replace: true });
    document.getElementById(`categoria-${categoryId}`)?.scrollIntoView?.({
      behavior: reducedMotion ? 'auto' : 'smooth',
      block: 'start',
    });
  };

  const clearSearch = () => {
    setQuery('');
    window.requestAnimationFrame(() => searchInputRef.current?.focus());
  };

  return (
    <section ref={catalogRef} className={styles.catalog} aria-labelledby="catalog-title">
      <div className={styles.commandBar}>
        <div ref={searchRef} className={`${styles.search} menu-search-shell ${searchFocused ? styles.searchActive : ''}`}>
          <label className="sr-only" htmlFor="menu-search">Buscar no cardápio</label>
          <Search size={19} aria-hidden="true" />
          <input
            id="menu-search"
            ref={searchInputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            placeholder="Buscar pratos, ingredientes ou categorias"
            aria-label="Buscar produto"
            type="search"
          />
          <span className={styles.resultCount} aria-live="polite">{visible.length} resultados</span>
          {query && <button className={styles.clearSearch} type="button" onClick={clearSearch} aria-label="Limpar busca">
            <X size={18} aria-hidden="true" />
          </button>}
        </div>

        {!query && <nav ref={categoriesRef} className={styles.categories} aria-label="Categorias do cardápio">
          {categories.map((category) => <button
            key={category.id}
            type="button"
            data-category={category.id}
            className={active === category.id ? styles.active : ''}
            aria-current={active === category.id ? 'location' : undefined}
            aria-controls={`categoria-${category.id}`}
            onClick={() => jumpTo(category.id)}
          >
            <span className={styles.categoryVisual}>
              <ResponsiveImage src={category.image} fallbackSrc={fallbackImage} alt="" sizes="42px" loading="lazy" />
            </span>
            <span>{category.name}</span>
            <i data-category-halo aria-hidden="true" />
          </button>)}
        </nav>}
      </div>

      {!query && chefPick && <>
        <article className={styles.chefPick} data-reveal>
          <button className={styles.chefVisual} type="button" onClick={() => openProduct(chefPick)} aria-label={`Abrir detalhes de ${chefPick.name}`}>
            <ResponsiveImage src={chefPick.image} fallbackSrc={fallbackImage} alt={chefPick.alt} sizes="(max-width: 760px) 100vw, 48vw" loading="eager" />
            <span><Sparkles aria-hidden="true" /> Seleção do chef</span>
          </button>
          <div className={styles.chefCopy} data-reveal-item>
            <small>{findCategory(chefPick.categoryId)?.name}</small>
            <h2 id="catalog-title">{chefPick.name}</h2>
            <p>{chefPick.description}</p>
            <strong>{formatCurrency(chefPick.priceCents)}</strong>
            <div>
              <button className="button button-primary" type="button" onClick={() => openProduct(chefPick)}>
                <Plus aria-hidden="true" /> Adicionar ao pedido
              </button>
              {(chefPick.variants.length > 0 || chefPick.optionGroups.length > 0) && <span><SlidersHorizontal aria-hidden="true" /> Personalizável</span>}
            </div>
          </div>
          <blockquote>“O equilíbrio está nos detalhes.”<b>LUNARE</b></blockquote>
        </article>

        <div className={styles.sectionHeading}>
          <h2>Mais pedidos</h2>
          <button type="button" onClick={() => jumpTo('entradas')}>Ver cardápio <ArrowRight aria-hidden="true" /></button>
        </div>
        <div className={styles.featured} aria-label="Produtos mais pedidos">
          {mostOrdered.map((product) => <article key={product.id} className={styles.featureCard}>
            <button className={styles.featureMain} type="button" onClick={() => openProduct(product)} aria-label={`Abrir detalhes de ${product.name}`}>
              <ResponsiveImage src={product.image} fallbackSrc={fallbackImage} alt={product.alt} sizes="(max-width: 700px) 104px, 118px" loading="lazy" />
              <span><small>{findCategory(product.categoryId)?.name}</small><strong>{product.name}</strong><em>{product.description}</em><b>{formatCurrency(product.priceCents)}</b></span>
            </button>
            <button className={styles.featureAdd} type="button" onClick={() => quickAdd(product)} aria-label="Adicionar rapidamente" aria-describedby={`feature-name-${product.id}`}><Plus aria-hidden="true" /></button>
            <span id={`feature-name-${product.id}`} className="sr-only">{product.name}</span>
          </article>)}
        </div>
      </>}

      {loading
        ? <div className={styles.skeletons} aria-label="Carregando cardápio" aria-busy="true">{Array.from({ length: 8 }, (_, index) => <i key={index} />)}</div>
        : <div className={styles.sections}>
          {normalized && <div className={styles.searchHeading}><span>Resultados da busca</span><h2 id="catalog-title">{visible.length} {visible.length === 1 ? 'prato encontrado' : 'pratos encontrados'}</h2></div>}
          {categories.map((category) => {
            const list = visible.filter((product) => product.categoryId === category.id);
            if (!list.length) return null;
            return <section key={category.id} id={`categoria-${category.id}`} className={styles.section} aria-labelledby={`titulo-${category.id}`} data-reveal>
              <div className={styles.sectionTitle}>
                <div><h2 id={`titulo-${category.id}`}>{category.name}</h2><p>{category.description}</p></div>
                <small>{list.length} opções</small>
              </div>
              <div className={styles.productGrid}>
                {list.map((product) => {
                  const configurable = product.variants.length > 0 || product.optionGroups.length > 0;
                  return <article
                    key={product.id}
                    className={`${styles.product} ${!product.available ? styles.unavailable : ''}`}
                    data-reveal-item
                    data-search-result={normalized ? 'true' : undefined}
                  >
                    <button
                      className={styles.productMain}
                      type="button"
                      onClick={() => openProduct(product)}
                      disabled={!product.available}
                      aria-label={`Abrir detalhes de ${product.name}`}
                    >
                      <ResponsiveImage src={product.image} fallbackSrc={fallbackImage} alt={product.alt} sizes="(max-width: 700px) 106px, 122px" loading="lazy" />
                      <span className={styles.productCopy}>
                        <span className={styles.cardMeta}>{product.featured ? 'Mais pedido' : product.tags.slice(0, 1).join('')}</span>
                        <strong>{product.name}</strong>
                        <span>{product.description}</span>
                      </span>
                    </button>
                    <div className={styles.productFooter}>
                      <b>A partir de {formatCurrency(product.priceCents)}</b>
                      {configurable && product.available && <span><SlidersHorizontal aria-hidden="true" /> Personalizável</span>}
                      {product.available ? <button type="button" onClick={() => quickAdd(product)} aria-label="Adicionar rapidamente" aria-describedby={`product-name-${product.id}`}><Plus aria-hidden="true" /></button> : <em>Indisponível</em>}
                      <span id={`product-name-${product.id}`} className="sr-only">{product.name}</span>
                    </div>
                  </article>;
                })}
              </div>
            </section>;
          })}
          {visible.length === 0 && <div className={styles.empty} role="status">
            <Search size={34} aria-hidden="true" />
            <h2>Nenhum produto encontrado</h2>
            <p>Tente outro nome, descrição ou tag.</p>
            <button className="button button-secondary" type="button" onClick={clearSearch}>Limpar busca</button>
          </div>}
        </div>}
    </section>
  );
}
