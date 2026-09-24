import { ArrowDown, ArrowUpRight, Play } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useReducedMotion } from '../hooks/useMotion';
import {
  animateMotion,
  createMotionAnimatable,
  createMotionTimeline,
  motionEasings,
  motionTokens,
  MotionRegistry,
  settleMotionTargets,
  stagger,
} from '../lib/motion';
import { ResponsiveImage } from './ui/ResponsiveImage';
import styles from './HeroV2.module.css';

const INTRO_KEY = 'lunare:brand-intro-seen';

const shouldPlayIntro = () => {
  try {
    return sessionStorage.getItem(INTRO_KEY) !== 'true';
  } catch {
    return false;
  }
};

export function HeroV2() {
  const root = useRef<HTMLElement>(null);
  const visual = useRef<HTMLDivElement>(null);
  const [introVisible, setIntroVisible] = useState(shouldPlayIntro);
  const introRequested = useRef(introVisible);
  const reduced = useReducedMotion();

  useEffect(() => {
    const hero = root.current;
    if (!hero) return;
    const revealTargets = Array.from(hero.querySelectorAll<HTMLElement>('[data-hero-reveal]'));
    const visualTarget = visual.current;
    const intro = hero.querySelector<HTMLElement>('[data-brand-intro]');
    const registry = new MotionRegistry();

    if (reduced) {
      settleMotionTargets([...revealTargets, ...(visualTarget ? [visualTarget] : []), ...(intro ? [intro] : [])]);
      setIntroVisible(false);
      return;
    }

    const clearHints = () => {
      [...revealTargets, ...(visualTarget ? [visualTarget] : [])].forEach((target) => { target.style.willChange = ''; });
    };
    [...revealTargets, ...(visualTarget ? [visualTarget] : [])].forEach((target) => { target.style.willChange = 'transform, opacity, clip-path'; });

    if (introRequested.current && intro) {
      try {
        sessionStorage.setItem(INTRO_KEY, 'true');
      } catch {
        // The intro remains non-essential when storage is unavailable.
      }
      const paths = intro.querySelectorAll<SVGGeometryElement>('[data-intro-path]');
      const wordmark = intro.querySelector<HTMLElement>('[data-intro-wordmark]');
      const timeline = registry.add(createMotionTimeline({
        defaults: { ease: motionEasings.expressive },
        onComplete: () => {
          clearHints();
          setIntroVisible(false);
        },
      }));
      try {
        timeline
          ?.add(paths, { strokeDashoffset: [1, 0], opacity: [0.18, 1], duration: 440, delay: stagger(55) }, 0)
          .add(wordmark ?? intro, { opacity: [0, 1], translateY: [9, 0], duration: 300 }, 150)
          .add(revealTargets, { opacity: [0, 1], translateY: [22, 0], duration: 500, delay: stagger(65) }, 280)
          .add(visualTarget ?? hero, { opacity: [0, 1], scale: [1.025, 1], clipPath: ['inset(0 0 100% 0 round 220px 220px 26px 26px)', 'inset(0 0 0% 0 round 220px 220px 26px 26px)'], duration: 620 }, 220)
          .add(intro, { opacity: [1, 0], scale: [1, 1.025], duration: 240 }, 700);
      } catch {
        clearHints();
        settleMotionTargets([...revealTargets, visualTarget ?? hero, intro]);
        setIntroVisible(false);
      }
    } else {
      const timeline = registry.add(createMotionTimeline({
        defaults: { ease: motionEasings.expressive },
        onComplete: clearHints,
      }));
      try {
        timeline
          ?.add(revealTargets, { opacity: [0, 1], translateY: [20, 0], duration: 520, delay: stagger(70) }, 0)
          .add(visualTarget ?? hero, { opacity: [0, 1], scale: [1.018, 1], clipPath: ['inset(0 0 18% 0 round 220px 220px 26px 26px)', 'inset(0 0 0% 0 round 220px 220px 26px 26px)'], duration: 600 }, 80);
      } catch {
        clearHints();
        settleMotionTargets([...revealTargets, visualTarget ?? hero]);
      }
    }

    registry.add(animateMotion(hero.querySelectorAll('[data-orbit]'), {
      rotate: [0, 360],
      duration: 28000,
      loop: true,
      ease: motionEasings.linear,
    }, 'transform'));

    return () => {
      clearHints();
      registry.clear();
    };
  }, [reduced]);

  useEffect(() => {
    const hero = root.current;
    const target = visual.current;
    if (!hero || !target || reduced || !window.matchMedia('(min-width: 901px) and (pointer: fine)').matches) return;
    const parallax = createMotionAnimatable(target, {
      translateX: { unit: 'px', duration: motionTokens.micro, ease: motionEasings.out },
      translateY: { unit: 'px', duration: motionTokens.micro, ease: motionEasings.out },
    });
    const move = (event: PointerEvent) => {
      const bounds = hero.getBoundingClientRect();
      const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 7;
      const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 5;
      parallax?.translateX(x);
      parallax?.translateY(y);
    };
    const reset = () => {
      parallax?.translateX(0);
      parallax?.translateY(0);
    };
    hero.addEventListener('pointermove', move, { passive: true });
    hero.addEventListener('pointerleave', reset);
    return () => {
      hero.removeEventListener('pointermove', move);
      hero.removeEventListener('pointerleave', reset);
      parallax?.revert();
    };
  }, [reduced]);

  return <section className={styles.hero} ref={root}>
    {introVisible && <div className={styles.brandIntro} data-brand-intro aria-hidden="true">
      <svg viewBox="0 0 160 160">
        <circle data-intro-path pathLength="1" cx="80" cy="80" r="54" />
        <path data-intro-path pathLength="1" d="M42 97c9 27 42 38 65 20 17-13 22-37 10-56" />
        <path data-intro-path pathLength="1" d="M46 54c20-18 46-20 70-4-20 15-45 15-70 4Z" />
      </svg>
      <div data-intro-wordmark>LUNARE<small>Premium Japanese Food</small></div>
    </div>}
    <div className={styles.glow} />
    <div className={styles.copy}>
      <p className={styles.eyebrow} data-hero-reveal><span /> Premium Japanese Food · Campos Gerais — MG</p>
      <h1 data-hero-reveal>O segredo está<br />nos <em>detalhes.</em></h1>
      <p className={styles.intro} data-hero-reveal>Precisão no preparo, frescor a validar com a casa e uma apresentação pensada para transformar cada escolha em experiência.</p>
      <div className={styles.ctas} data-hero-reveal>
        <Link className="button button-primary" to="/cardapio">Explorar cardápio <ArrowUpRight size={18} /></Link>
        <a className="button button-ghost" href="#experiencia"><Play size={17} /> Conhecer a experiência</a>
      </div>
    </div>
    <div className={styles.visual} ref={visual}>
      <div className={styles.orbit} data-orbit><i /><i /><i /></div>
      <ResponsiveImage src="/media/combinado-caixas.jpg" alt="Combinados Lunare apresentados em embalagens azuis" sizes="(max-width: 900px) 92vw, 44vw" loading="eager" fetchPriority="high" />
      <div className={styles.caption}><span>01</span><p>Composição, contraste<br />e sabor em órbita.</p></div>
    </div>
    <a className={styles.scroll} href="#experiencia"><ArrowDown size={17} /> Descubra</a>
  </section>;
}
