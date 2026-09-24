import { ArrowUpRight, Clock, MapPin, MoonStar, PackageCheck, Store } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HeroV2 } from '../components/HeroV2';
import { ResponsiveImage } from '../components/ui/ResponsiveImage';
import { categories, findCategory, formatCurrency, products } from '../data/menu';
import { restaurant } from '../data/restaurant';
import { useReducedMotion, useSectionReveals } from '../hooks/useMotion';
import { animateMotion, motionEasings, motionTokens, type MotionInstance } from '../lib/motion';
import { useOrderStore } from '../store/useOrderStore';
import styles from './HomePageV2.module.css';
import './HomePageV2.motion.css';

export function HomePageV2() {
  const navigate = useNavigate();
  const pageRef = useRef<HTMLDivElement>(null);
  const transitionRef = useRef<HTMLDivElement>(null);
  const transitionMotion = useRef<MotionInstance | null>(null);
  const transitioning = useRef(false);
  const selectProduct = useOrderStore((state) => state.selectProduct);
  const setInfoOpen = useOrderStore((state) => state.setInfoOpen);
  const status = useOrderStore((state) => state.storeStatus);
  const reduced = useReducedMotion();
  const favorites = products.filter((product) => product.featured && product.available).slice(0, 6);
  useSectionReveals(pageRef);

  useEffect(() => {
    const interceptMenuNavigation = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = (event.target as Element | null)?.closest<HTMLAnchorElement>('a[href]');
      if (!anchor || anchor.target === '_blank') return;
      const destination = new URL(anchor.href, window.location.href);
      if (destination.origin !== window.location.origin || destination.pathname !== '/cardapio') return;
      event.preventDefault();
      const route = `${destination.pathname}${destination.search}${destination.hash}`;
      if (reduced || !transitionRef.current) {
        navigate(route);
        return;
      }
      if (transitioning.current) return;
      transitioning.current = true;
      const animation = animateMotion(transitionRef.current, {
        opacity: [0, 1],
        scale: [0.08, 1.18],
        rotate: [-8, 0],
        duration: motionTokens.standard,
        ease: motionEasings.expressive,
        onComplete: () => navigate(route),
      });
      transitionMotion.current = animation;
      if (!animation) navigate(route);
    };
    document.addEventListener('click', interceptMenuNavigation, true);
    return () => {
      document.removeEventListener('click', interceptMenuNavigation, true);
      transitionMotion.current?.revert();
      transitionMotion.current = null;
      transitioning.current = false;
    };
  }, [navigate, reduced]);

  const openProduct = (id: string) => {
    selectProduct(id);
    navigate(`/?produto=${id}`, { preventScrollReset: true });
  };

  return <div ref={pageRef} className="home-page">
    <HeroV2 />
    <section className={styles.experience} id="experiencia" data-reveal>
      <div className={styles.sectionLabel} data-reveal-item>02 / Experiência Lunare</div>
      <div className={styles.experienceIntro} data-reveal-item><p className="eyebrow"><MoonStar /> Japonesa contemporânea</p><h2>Precisão que acolhe.<br />Detalhe que permanece.</h2><p>Uma direção conceitual inspirada na identidade pública do Lunare e nas mídias fornecidas, sem alegações operacionais não confirmadas.</p></div>
      <div className={styles.principles}>{[['01','Detalhe','Composição limpa, contraste e atenção ao gesto final.'],['02','Técnica','Uma linguagem visual precisa, sem promessas não verificadas.'],['03','Apresentação','Azul profundo, louça escura e a cor do alimento em primeiro plano.']].map(([number,title,copy])=><article key={number} data-reveal-item><span>{number}</span><h3>{title}</h3><p>{copy}</p></article>)}</div>
    </section>
    <section className={styles.favorites} id="favoritos" data-reveal>
      <header data-reveal-item><div><span>Favoritos da casa</span><h2>Peças em destaque</h2></div><Link to="/cardapio">Ver cardápio <ArrowUpRight /></Link></header>
      <div className={styles.favoriteGrid}>{favorites.map((product) => <button type="button" key={product.id} onClick={() => openProduct(product.id)} data-reveal-item><ResponsiveImage src={product.image} alt={product.alt} loading="lazy" sizes="(max-width: 600px) 82vw, (max-width: 900px) 46vw, 31vw" /><div><small>{findCategory(product.categoryId)?.name}</small><h3>{product.name}</h3><p>{product.description}</p><b>A partir de {formatCurrency(product.priceCents)}</b></div></button>)}</div>
    </section>
    <section className={styles.manifesto} data-reveal><div className={styles.eclipse} data-reveal-item><i /><i /></div><p data-reveal-item>Entre luz e sombra,<br /><em>cada detalhe encontra seu lugar.</em></p></section>
    <section className={styles.categorySection} data-reveal><header data-reveal-item><span>Navegue por categorias</span><h2>Encontre sua escolha</h2></header><div className={styles.categoryGrid}>{categories.map((category) => <Link key={category.id} to={`/cardapio?categoria=${category.id}`} data-reveal-item><ResponsiveImage src={category.image} alt="" loading="lazy" sizes="(max-width: 900px) 46vw, 19vw" /><span>{category.name}</span><ArrowUpRight /></Link>)}</div></section>
    <section className={styles.gallery} aria-labelledby="gallery-title" data-reveal><header data-reveal-item><span>Galeria editorial</span><h2 id="gallery-title">Azul, salmão e luz lunar</h2></header><div><figure className={styles.galleryTall} data-reveal-item><ResponsiveImage src="/media/sashimi-flor.jpg" alt="Sashimi de salmão disposto em forma floral" loading="lazy" sizes="(max-width: 600px) 94vw, 40vw" /></figure><figure data-reveal-item><ResponsiveImage src="/media/hot-dourado.jpg" alt="Hot rolls dourados em prato azul" loading="lazy" sizes="(max-width: 600px) 46vw, 28vw" /></figure><figure data-reveal-item><ResponsiveImage src="/media/embalagem-lunare.jpg" alt="Embalagem azul Lunare com sushi" loading="lazy" sizes="(max-width: 600px) 46vw, 28vw" /></figure><figure className={styles.galleryWide} data-reveal-item><ResponsiveImage src="/media/combinado-caixas.jpg" alt="Seleção de combinados em caixas azuis" loading="lazy" sizes="(max-width: 600px) 94vw, 56vw" /></figure></div></section>
    <section className={styles.house} id="informacoes" data-reveal><div data-reveal-item><span>Informações da casa</span><h2>Antes de entrar em órbita</h2><p>Todos os dados operacionais abaixo são provisórios e precisam de validação do estabelecimento.</p><button className="button button-secondary" type="button" onClick={() => setInfoOpen(true)}>Ver detalhes</button></div><div className={styles.houseCards}>{[[<Store key="store" />,'Status',status === 'open' ? 'Aberto — demonstração' : 'Estamos fechados'],[<PackageCheck key="package" />,'Modalidades','Entrega e retirada · demo'],[<MapPin key="map" />,'Localidade',restaurant.location],[<Clock key="clock" />,'Horários',`${restaurant.schedule[0].value} · validar`]].map(([icon,label,value])=><article key={String(label)} data-reveal-item>{icon}<span>{label}</span><b>{value}</b></article>)}</div></section>
    <footer className={styles.footer} role="contentinfo" data-reveal><div className={styles.footerBrand} data-reveal-item><img src="/media/lunare-emblema.jpg" width="52" height="52" alt="" /><span>LUNARE<small>{restaurant.positioning}</small></span></div><nav aria-label="Rodapé" data-reveal-item><Link to="/">Início</Link><Link to="/cardapio">Cardápio</Link><a href={restaurant.publicLinks.instagram} target="_blank" rel="noreferrer">Instagram</a><a href="/THIRD_PARTY_LICENSES.md">Créditos e licenças</a></nav><div data-reveal-item><p>{restaurant.location}<br />{restaurant.address.value} · validar</p><p>{restaurant.prototypeNotice}</p></div></footer>
    <div ref={transitionRef} className="route-eclipse" aria-hidden="true" />
  </div>;
}
