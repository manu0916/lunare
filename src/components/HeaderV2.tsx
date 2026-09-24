import { Clock3, Info, MapPin, Menu, ShoppingBag, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useReducedMotion } from '../hooks/useMotion';
import { animateMotion, motionEasings, motionTokens, stagger } from '../lib/motion';
import { useOrderStore } from '../store/useOrderStore';
import { cartSubtotal } from '../utils/order';
import { formatCurrency } from '../data/menu';
import styles from './HeaderV2.module.css';

export function HeaderV2() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [compact, setCompact] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const badgeRef = useRef<HTMLElement>(null);
  const cart = useOrderStore((state) => state.cart);
  const status = useOrderStore((state) => state.storeStatus);
  const setCartOpen = useOrderStore((state) => state.setCartOpen);
  const setInfoOpen = useOrderStore((state) => state.setInfoOpen);
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartSubtotal(cart);
  const previousCount = useRef(count);
  const reduced = useReducedMotion();

  useEffect(() => {
    const update = () => setCompact(window.scrollY > 72);
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMobileOpen(false);
    };
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [mobileOpen]);

  useEffect(() => {
    const header = headerRef.current;
    if (!header || reduced) return;
    const animation = animateMotion(header, {
      backgroundColor: compact ? 'rgba(9,13,20,.975)' : 'rgba(9,13,20,.94)',
      borderColor: compact ? 'rgba(255,255,255,.13)' : 'rgba(255,255,255,.08)',
      boxShadow: compact ? '0 12px 34px rgba(0,7,24,.22)' : '0 0 0 rgba(0,7,24,0)',
      duration: motionTokens.standard,
      ease: motionEasings.out,
    }, 'background-color, border-color, box-shadow');
    return () => { animation?.revert(); };
  }, [compact, reduced]);

  useEffect(() => {
    if (!mobileOpen || reduced || !navRef.current) return;
    const animation = animateMotion(navRef.current.querySelectorAll('a,button'), {
      opacity: [0, 1], translateY: [-6, 0], duration: motionTokens.micro,
      delay: stagger(32), ease: motionEasings.out,
    });
    return () => { animation?.revert(); };
  }, [mobileOpen, reduced]);

  useEffect(() => {
    const badge = badgeRef.current;
    const increased = count > previousCount.current;
    previousCount.current = count;
    if (!badge || !increased || reduced) return;
    const animation = animateMotion(badge, {
      scale: [1, 1.24, 1], duration: motionTokens.micro, ease: 'outBack(1.4)',
    }, 'transform');
    return () => { animation?.revert(); };
  }, [count, reduced]);

  return <header ref={headerRef} className={`${styles.header} ${compact ? styles.compact : ''}`}>
    <Link className={styles.brand} to="/" aria-label="Lunare — início">
      <img src="/media/lunare-emblema.jpg" width="42" height="42" alt="" />
      <span>LUNARE<small>Premium Japanese Food</small></span>
    </Link>
    <nav id="mobile-navigation" ref={navRef} className={`${styles.nav} ${mobileOpen ? styles.open : ''}`} aria-label="Navegação principal">
      <Link to="/#destaques" onClick={() => setMobileOpen(false)}>A jornada</Link>
      <NavLink to="/cardapio" onClick={() => setMobileOpen(false)}>Cardápio</NavLink>
      <button type="button" onClick={() => { setInfoOpen(true); setMobileOpen(false); }}><Info size={16} /> Informações</button>
    </nav>
    <div className={styles.actions}>
      <span className={styles.location}><MapPin aria-hidden="true" />Campos Gerais — MG</span>
      <span className={styles.estimate}><Clock3 aria-hidden="true" />Previsão a confirmar</span>
      <span className={`${styles.status} ${status === 'open' ? styles.statusOpen : ''}`}><i />{status === 'open' ? 'Aberto' : 'Fechado'}</span>
      <button className={styles.cart} type="button" onClick={() => setCartOpen(true)} aria-label={`Abrir carrinho com ${count} itens`}>
        <span className={styles.cartIcon}><ShoppingBag size={20} />{count > 0 && <b ref={badgeRef}>{count}</b>}</span>
        <span className={styles.cartCopy}><strong>Seu pedido</strong><small>{count} {count === 1 ? 'item' : 'itens'} · {formatCurrency(subtotal)}</small></span>
      </button>
      <button className={styles.menu} type="button" onClick={() => setMobileOpen((value) => !value)} aria-expanded={mobileOpen} aria-controls="mobile-navigation" aria-label={mobileOpen ? 'Fechar menu' : 'Abrir menu'}>{mobileOpen ? <X /> : <Menu />}</button>
    </div>
  </header>;
}
