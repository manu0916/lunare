import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { HeroV2 } from '../components/HeroV2';
import { useReducedMotion } from '../hooks/useMotion';
import { animateMotion, motionEasings, motionTokens, type MotionInstance } from '../lib/motion';
import styles from './HomePageV2.module.css';
import './HomePageV2.motion.css';

const preloadMenuPage = () => import('./MenuPageV2');

export function HomePageV2() {
  const navigate = useNavigate();
  const transitionRef = useRef<HTMLDivElement>(null);
  const transitionMotion = useRef<MotionInstance | null>(null);
  const transitioning = useRef(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    const preload = () => { void preloadMenuPage().catch(() => undefined); };
    const timer = window.setTimeout(preload, 140);
    return () => window.clearTimeout(timer);
  }, []);

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
      void preloadMenuPage().catch(() => undefined);
      const animation = animateMotion(transitionRef.current, {
        opacity: [.78, 1],
        translateY: ['108%', '0%'],
        duration: motionTokens.standard,
        ease: motionEasings.smooth,
        onComplete: () => navigate(route),
      }, 'transform, opacity');
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

  return (
    <div className={styles.page}>
      <HeroV2 />
      <div ref={transitionRef} className="route-eclipse" aria-hidden="true" />
    </div>
  );
}
