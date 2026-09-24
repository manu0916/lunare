import { RotateCcw } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../data/menu';
import { useReducedMotion } from '../hooks/useMotion';
import { createMotionTimeline, motionEasings, MotionRegistry, settleMotionTargets, stagger } from '../lib/motion';
import { useOrderStore } from '../store/useOrderStore';
import styles from './SuccessPageV2.module.css';

export function SuccessPageV2() {
  const order = useOrderStore((state) => state.lastOrder);
  const setLastOrder = useOrderStore((state) => state.setLastOrder);
  const pageRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const page = pageRef.current;
    if (!page) return;
    const paths = page.querySelectorAll<SVGGeometryElement>('[data-success-path]');
    const check = page.querySelector<SVGPathElement>('[data-success-check]');
    const mark = page.querySelector<HTMLElement>('[data-success-mark]');
    const reveal = page.querySelectorAll<HTMLElement>('[data-success-reveal]');
    const allTargets = [...Array.from(paths), ...(check ? [check] : []), ...(mark ? [mark] : []), ...Array.from(reveal)];
    if (reducedMotion) {
      settleMotionTargets(allTargets);
      return;
    }
    const registry = new MotionRegistry();
    const timeline = registry.add(createMotionTimeline({ defaults: { ease: motionEasings.expressive } }));
    try {
      timeline
        ?.add(mark ?? page, { opacity: [0, 1], scale: [0.88, 1], rotate: [-12, 0], duration: 480 }, 0)
        .add(paths, { strokeDashoffset: [1, 0], opacity: [0.2, 1], duration: 560, delay: stagger(70) }, 0)
        .add(check ?? mark ?? page, { strokeDashoffset: [1, 0], opacity: [0, 1], scale: [0.84, 1], duration: 360 }, 220)
        .add(reveal, { opacity: [0, 1], translateY: [12, 0], duration: 480, delay: stagger(45) }, 230);
    } catch {
      settleMotionTargets(allTargets);
    }
    return () => registry.clear();
  }, [reducedMotion]);

  return <div ref={pageRef} className={`${styles.page} success-page`}>
    <div className={styles.mark} data-success-mark aria-hidden="true">
      <svg viewBox="0 0 120 120">
        <circle className={styles.outerOrbit} data-success-path pathLength="1" cx="60" cy="60" r="51" />
        <path className={styles.innerOrbit} data-success-path pathLength="1" d="M28 66c6 20 28 31 47 23 19-8 29-31 20-50" />
        <circle className={styles.core} cx="60" cy="60" r="31" />
        <path className={styles.check} data-success-check pathLength="1" d="m45 60 10 10 21-24" />
      </svg>
    </div>
    <span data-success-reveal>Experiência finalizada</span>
    <h1 data-success-reveal>Demonstração concluída: nenhum pedido ou pagamento foi processado.</h1>
    {order
      ? <div className={styles.receipt} data-success-reveal>
        <p><span>Número fictício</span><b>{order.id}</b></p>
        <p><span>Modalidade</span><b>{order.fulfillment === 'pickup' ? 'Retirada' : 'Entrega'} · demo</b></p>
        <p><span>Total demonstrativo</span><b>{formatCurrency(order.totalCents)}</b></p>
      </div>
      : <p data-success-reveal>Nenhum resumo foi preservado nesta visita.</p>}
    <div className={styles.actions} data-success-reveal>
      <Link className="button button-primary" to="/cardapio" onClick={() => setLastOrder(null)}><RotateCcw aria-hidden="true" /> Reiniciar pedido</Link>
      <Link className="button button-secondary" to="/">Voltar à Home</Link>
    </div>
  </div>;
}
