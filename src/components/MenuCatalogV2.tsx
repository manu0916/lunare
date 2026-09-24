import { ChevronRight, Info, Search, Sparkles, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { categories, fallbackImage, findCategory, formatCurrency, products } from '../data/menu';
import { restaurant } from '../data/restaurant';
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
  const setInfoOpen = useOrderStore((state) => state.setInfoOpen);
  const storeStatus = useOrderStore((state) => state.storeStatus);

  const normalized = query.trim().toLocaleLowerCase('pt-BR');
  const visible = useMemo(
    () => products.filter((product) => !normalized || [product.name, product.description, ...product.tags].join(' ').toLocaleLowerCase('pt-BR').includes(normalized)),
    [normalized],
  );
  const featured = useMemo(() => products.filter((product) => product.featured && product.available).slice(0, 6), []);

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
    }, { rootMargin: '-28% 0px -58% 0px', threshold: [0, 0.2, 0.5] });
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
      opacity: [0.28, 1],
      scale: [0.78, 1],
      duration: motionTokens.standard,
      ease: motionEasings.expressive,
    }));
    const activeImage = activeButton.querySelector<HTMLImageElement>('img');
    if (activeImage) {
      registry.add(animateMotion(activeImage, {
        scale: [0.96, 1],
        duration: motionTokens.micro,
        ease: motionEasings.out,
      }));
    }
    return () => registry.clear();
  }, [active, reducedMotion]);

  useEffect(() => {
    const target = searchRef.current;
    if (!target || reducedMotion) return;
    const registry = new MotionRegistry();
    registry.add(animateMotion(target, {
      scale: [searchFocused ? 0.992 : 1.004, 1],
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

  return <section ref={catalogRef} className={styles.catalog} aria-labelledby="catalog-title">
    <div className={styles.cobaltBand}>
      <ResponsiveImage src="/media/lunare-emblema.jpg" alt="Emblema orbital da Lunare" sizes="84px" loading="eager" />
      <span>Cardápio interativo</span>
    </div>

    <div className={styles.storeCard} data-reveal>
      <div data-reveal-item>
        <span className={styles.kicker}>Lunare Restaurante</span>
        <h2 id="catalog-title">Escolha sua próxima órbita</h2>
        <p>{restaurant.location}</p>
        <div className={`${styles.status} ${storeStatus === 'open' ? styles.open : ''}`}>
          <i aria-hidden="true" />
          <span>{storeStatus === 'open' ? 'Estamos abertos' : 'Estamos fechados'}</span>
          <b aria-hidden="true">•</b>
          <span>Mínimo {formatCurrency(restaurant.minimumOrderCents)}</span>
        </div>
      </div>
      <button className={styles.info} type="button" onClick={() => setInfoOpen(true)}>
        <Info size={18} aria-hidden="true" /> <span>Informações</span>
      </button>
    </div>

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
        placeholder="Buscar produto"
        aria-label="Buscar produto"
        type="search"
      />
      <span className={styles.resultCount} aria-live="polite">{visible.length} resultados</span>
      {query && <button className={styles.clearSearch} type="button" onClick={clearSearch} aria-label="Limpar busca">
        <X size={18} aria-hidden="true" />
      </button>}
    </div>

    {!query && <>
      <nav ref={categoriesRef} className={styles.categories} aria-label="Categorias do cardápio">
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
            <i data-category-halo aria-hidden="true" />
            <ResponsiveImage src={category.image} fallbackSrc={fallbackImage} alt="" sizes="58px" loading="lazy" />
          </span>
          <span>{category.name}</span>
        </button>)}
      </nav>
      <div className={styles.featureHead}>
        <div><Sparkles size={17} aria-hidden="true" /><span>Destaques</span></div>
        <small>Deslize para explorar</small>
      </div>
      <div className={styles.featured} aria-label="Produtos em destaque">
        {featured.map((product) => <button key={product.id} className={styles.featureCard} type="button" onClick={() => openProduct(product)}>
          <ResponsiveImage src={product.image} fallbackSrc={fallbackImage} alt={product.alt} sizes="(max-width: 700px) 78vw, 350px" loading="lazy" />
          <span>
            <small>{findCategory(product.categoryId)?.name}</small>
            <strong>{product.name}</strong>
            <b>A partir de {formatCurrency(product.priceCents)}</b>
          </span>
        </button>)}
      </div>
    </>}

    {loading
      ? <div className={styles.skeletons} aria-label="Carregando cardápio" aria-busy="true">{Array.from({ length: 6 }, (_, index) => <i key={index} />)}</div>
      : <div className={styles.sections}>
        {categories.map((category) => {
          const list = visible.filter((product) => product.categoryId === category.id);
          if (!list.length) return null;
          return <section key={category.id} id={`categoria-${category.id}`} className={styles.section} aria-labelledby={`titulo-${category.id}`} data-reveal>
            <div className={styles.sectionTitle}>
              <h3 id={`titulo-${category.id}`}>{category.name}</h3>
              <small>{list.length} opções</small>
            </div>
            <div className={styles.productGrid}>
              {list.map((product) => <button
                key={product.id}
                className={`${styles.product} ${!product.available ? styles.unavailable : ''}`}
                type="button"
                onClick={() => openProduct(product)}
                disabled={!product.available}
                data-reveal-item
                data-search-result={normalized ? 'true' : undefined}
              >
                <ResponsiveImage src={product.image} fallbackSrc={fallbackImage} alt={product.alt} sizes="(max-width: 700px) 92px, 104px" loading="lazy" />
                <span className={styles.productCopy}>
                  <small>{product.tags.slice(0, 2).join(' · ')}</small>
                  <strong>{product.name}</strong>
                  <span>{product.description}</span>
                  <b>A partir de {formatCurrency(product.priceCents)}</b>
                  {!product.available && <em>Indisponível</em>}
                </span>
                <ChevronRight className={styles.chevron} size={18} aria-hidden="true" />
              </button>)}
            </div>
          </section>;
        })}
        {visible.length === 0 && <div className={styles.empty} role="status">
          <Search size={34} aria-hidden="true" />
          <h3>Nenhum produto encontrado</h3>
          <p>Tente outro nome, descrição ou tag.</p>
          <button className="button button-secondary" type="button" onClick={clearSearch}>Limpar busca</button>
        </div>}
      </div>}
  </section>;
}
