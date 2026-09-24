import { BadgePercent, Home, ShoppingBag, Sparkles } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { useReducedMotion } from '../hooks/useMotion';
import { animateMotion, motionEasings, motionTokens, MotionRegistry } from '../lib/motion';
import { useOrderStore } from '../store/useOrderStore';
import styles from './BottomNav.module.css';

export function BottomNavV2() {
  const setCartOpen = useOrderStore((state) => state.setCartOpen);
  const setPanel = useOrderStore((state) => state.setUtilityPanel);
  const itemCount = useOrderStore((state) => state.cart.reduce((total, item) => total + item.quantity, 0));
  const badgeRef = useRef<HTMLSpanElement>(null);
  const previousCountRef = useRef(itemCount);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const increased = itemCount > previousCountRef.current;
    previousCountRef.current = itemCount;
    if (!increased || reducedMotion || !badgeRef.current) return;
    const registry = new MotionRegistry();
    registry.add(animateMotion(badgeRef.current, {
      scale: [1, 1.24, 1],
      duration: motionTokens.standard,
      ease: motionEasings.out,
    }));
    return () => registry.clear();
  }, [itemCount, reducedMotion]);

  return <nav className={styles.nav} aria-label="Navegação móvel">
    <NavLink end to="/" className={({ isActive }) => isActive ? styles.active : undefined}>
      <Home aria-hidden="true" /><span>Início</span>
    </NavLink>
    <button type="button" onClick={() => setPanel('promotions')} aria-label="Abrir painel de promoções em breve">
      <Sparkles aria-hidden="true" /><span>Em breve</span>
    </button>
    <button type="button" onClick={() => setPanel('discount')} aria-label="Abrir desconto demonstrativo">
      <BadgePercent aria-hidden="true" /><span>Desconto</span>
    </button>
    <button type="button" onClick={() => setCartOpen(true)} aria-label={`Abrir carrinho, ${itemCount} ${itemCount === 1 ? 'item' : 'itens'}`}>
      <span className={styles.cartIcon}>
        <ShoppingBag aria-hidden="true" />
        {itemCount > 0 && <span ref={badgeRef} className={styles.badge} aria-hidden="true">{itemCount > 99 ? '99+' : itemCount}</span>}
      </span>
      <span>Pedidos</span>
    </button>
  </nav>;
}
