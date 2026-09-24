import { ArrowDown, ArrowUpRight, ScanLine } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useReducedMotion } from '../hooks/useMotion';
import {
  animateMotion,
  createMotionAnimatable,
  createMotionScroll,
  createMotionTimeline,
  motionEasings,
  motionTokens,
  MotionRegistry,
  settleMotionTargets,
  stagger,
} from '../lib/motion';
import { SushiAssembly } from './SushiAssembly';
import styles from './HeroV2.module.css';

const INTRO_KEY = 'lunare:brand-intro-seen';

const shouldPlayIntro = () => {
  try {
    return sessionStorage.getItem(INTRO_KEY) !== 'true';
  } catch {
    return false;
  }
};

const selectAll = <T extends Element>(root: ParentNode, selector: string) => Array.from(root.querySelectorAll<T>(selector));

export function HeroV2() {
  const trackRef = useRef<HTMLElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);
  const [introVisible, setIntroVisible] = useState(shouldPlayIntro);
  const introRequested = useRef(introVisible);
  const reduced = useReducedMotion();

  useEffect(() => {
    const track = trackRef.current;
    const scene = sceneRef.current;
    const visual = visualRef.current;
    if (!track || !scene || !visual) return;

    const registry = new MotionRegistry();
    const revealTargets = selectAll<HTMLElement>(scene, '[data-hero-reveal]');
    const intro = scene.querySelector<HTMLElement>('[data-brand-intro]');
    const animatedTargets = selectAll<HTMLElement | SVGElement>(visual, [
      '[data-scale]', '[data-clean-surface]', '[data-fish-render]', '[data-fish-core]', '[data-fish-tail]', '[data-fish-detail]',
      '[data-cut-line]', '[data-cut-glow]', '[data-fillet-plane]', '[data-fillet-stripes]', '[data-slice]',
      '[data-rice-base]', '[data-rice-grain]', '[data-glaze]', '[data-final-mark]', '[data-tech-ring]',
      '[data-tech-line]', '[data-orbit-frame]', 'svg',
    ].join(','));

    if (reduced) {
      settleMotionTargets([...revealTargets, visual, ...(intro ? [intro] : [])]);
      setIntroVisible(false);
      return;
    }

    animatedTargets.forEach((target) => { target.style.willChange = 'transform, opacity, clip-path, stroke-dashoffset'; });
    const clearHints = () => animatedTargets.forEach((target) => { target.style.willChange = ''; });

    const observer = registry.add(createMotionScroll({
      target: track,
      enter: 'top top',
      leave: 'bottom bottom',
      sync: 0.15,
    }));
    const timeline = registry.add(createMotionTimeline({
      autoplay: observer ?? false,
      defaults: { ease: motionEasings.smooth },
    }));

    const scales = selectAll<SVGElement>(visual, '[data-scale]');
    const techRings = selectAll<SVGElement>(visual, '[data-tech-ring]');
    const techLines = selectAll<SVGElement>(visual, '[data-tech-line]');
    const cutLines = selectAll<SVGElement>(visual, '[data-cut-line]');
    const filletPlanes = selectAll<SVGElement>(visual, '[data-fillet-plane]');
    const riceGrains = selectAll<SVGElement>(visual, '[data-rice-grain]');
    const artwork = visual.querySelector<SVGElement>('svg');
    const menuCta = scene.querySelector<HTMLElement>('[data-menu-cta]');
    const menuArrow = scene.querySelector<SVGElement>('[data-menu-arrow]');

    try {
      timeline
        ?.add(techRings, { opacity: [.38, .62], rotate: [0, 7], duration: 160 }, 0)
        .add(visual.querySelectorAll('[data-fish-core],[data-fish-tail],[data-fish-detail]'), {
          opacity: [0, .22],
          duration: 130,
        }, 175)
        .add(visual.querySelectorAll('[data-clean-surface]'), {
          opacity: [0, .9],
          clipPath: ['inset(0 100% 0 0)', 'inset(0 0% 0 0)'],
          duration: 170,
        }, 145)
        .add(scales, {
          opacity: [0, .35, 0],
          translateY: [0, -34],
          translateX: [0, 9],
          rotate: [0, 14],
          scale: [1, .35],
          delay: stagger(1.1, { from: 'last' }),
          duration: 125,
        }, 165)
        .add(techLines, { strokeDashoffset: [1, 0], opacity: [.2, .75], duration: 180 }, 260)
        .add(cutLines, { strokeDashoffset: [1, 0], opacity: [0, 1], delay: stagger(22), duration: 170 }, 320)
        .add(visual.querySelectorAll('[data-cut-glow]'), { opacity: [0, .75, 0], translateX: [-18, 16], duration: 170 }, 350)
        .add(visual.querySelectorAll('[data-fish-render]'), {
          opacity: [1, 0],
          scaleX: [1, .91],
          duration: 190,
        }, 365)
        .add(visual.querySelectorAll('[data-fish-tail],[data-fish-detail]'), {
          opacity: [.22, 0],
          translateX: [0, -28],
          scale: [1, .92],
          duration: 150,
        }, 380)
        .add(filletPlanes, {
          opacity: [0, 1],
          scaleX: [.72, 1],
          scaleY: [.84, 1],
          delay: stagger(18),
          duration: 155,
        }, 390)
        .add(visual.querySelectorAll('[data-fillet-stripes]'), { opacity: [0, 1], duration: 120 }, 430)
        .add(filletPlanes, {
          translateX: [0, 10],
          translateY: stagger(15, { from: 'center' }),
          duration: 130,
        }, 450)
        .add(visual.querySelectorAll('[data-fish-core]'), {
          opacity: [.22, 0],
          scaleX: [1, .8],
          duration: 145,
        }, 430)
        .add(visual.querySelectorAll('[data-clean-surface]'), {
          opacity: [.9, 0],
          scaleX: [1, .8],
          duration: 145,
        }, 430)
        .add(artwork ?? visual, { rotate: [0, 1.25], scale: [1, 1.025], duration: 160 }, 390)
        .add(cutLines, { opacity: [1, 0], duration: 70 }, 500)
        .add(visual.querySelectorAll('[data-slice]'), {
          opacity: [0, 1],
          translateX: [78, 48],
          translateY: [-74, -62],
          rotate: [-11, -6],
          scale: [.76, .84],
          duration: 150,
        }, 525)
        .add(riceGrains, {
          opacity: [0, 1],
          translateY: [58, 0],
          translateX: [-16, 0],
          scale: [.42, 1],
          delay: stagger(5, { from: 'center' }),
          duration: 145,
        }, 545)
        .add(visual.querySelectorAll('[data-rice-base]'), {
          opacity: [0, .96],
          scaleX: [.7, 1],
          scaleY: [.55, 1],
          duration: 145,
        }, 620)
        .add(filletPlanes, { opacity: [1, 0], translateX: [10, -18], duration: 120 }, 610)
        .add(visual.querySelectorAll('[data-fillet-stripes]'), { opacity: [1, 0], duration: 80 }, 620)
        .add(visual.querySelectorAll('[data-slice]'), {
          translateX: [48, 0],
          translateY: [-62, 0],
          rotate: [-6, 0],
          scaleX: [.84, 1.02, 1],
          scaleY: [.84, .96, 1],
          duration: 180,
          ease: motionEasings.expressive,
        }, 700)
        .add(visual.querySelectorAll('[data-rice-base]'), { scaleX: [1, .96], scaleY: [1, .9], translateY: [0, 6], duration: 175 }, 710)
        .add(riceGrains, { translateY: [0, 5], scale: [1, .94], duration: 175 }, 710)
        .add(artwork ?? visual, { rotate: [1.25, -.65], scale: [1.025, 1.045], duration: 190 }, 690)
        .add(visual.querySelectorAll('[data-glaze]'), { opacity: [0, 1, .7], strokeDashoffset: [1, 0], duration: 125 }, 825)
        .add(visual.querySelectorAll('[data-final-mark]'), { opacity: [0, .8], scale: [.96, 1], duration: 95 }, 870)
        .add(visual.querySelectorAll('[data-orbit-frame]'), { opacity: [1, .55], scale: [1, 1.08], duration: 120 }, 875)
        .add(techRings, { opacity: [.62, .2], scale: [1, 1.06], duration: 120 }, 875)
        .add(artwork ?? visual, { rotate: [-.65, 0], scale: [1.045, 1.085], translateY: [0, -5], duration: 125 }, 875)
        .add(menuCta ?? scene, { scale: [1, 1.035, 1], duration: 115, ease: motionEasings.out }, 885)
        .add(menuArrow ?? scene, { translateX: [0, 5, 0], translateY: [0, -3, 0], duration: 115 }, 885);
    } catch {
      settleMotionTargets(animatedTargets);
    }

    if (introRequested.current && intro) {
      try {
        sessionStorage.setItem(INTRO_KEY, 'true');
      } catch {
        // The intro remains non-essential when storage is unavailable.
      }
      const paths = intro.querySelectorAll<SVGGeometryElement>('[data-intro-path]');
      const wordmark = intro.querySelector<HTMLElement>('[data-intro-wordmark]');
      const introTimeline = registry.add(createMotionTimeline({
        defaults: { ease: motionEasings.expressive },
        onComplete: () => setIntroVisible(false),
      }));
      try {
        introTimeline
          ?.add(paths, { strokeDashoffset: [1, 0], opacity: [.16, 1], duration: 420, delay: stagger(55) }, 0)
          .add(wordmark ?? intro, { opacity: [0, 1], translateY: [9, 0], duration: 280 }, 140)
          .add(revealTargets, { opacity: [0, 1], translateY: [20, 0], duration: 480, delay: stagger(58) }, 250)
          .add(visual, { opacity: [0, 1], scale: [1.025, 1], clipPath: ['inset(0 0 100% 0)', 'inset(0 0 0% 0)'], duration: 590 }, 205)
          .add(intro, { opacity: [1, 0], scale: [1, 1.02], duration: 230 }, 690);
      } catch {
        settleMotionTargets([...revealTargets, visual, intro]);
        setIntroVisible(false);
      }
    } else {
      const revealTimeline = registry.add(createMotionTimeline({ defaults: { ease: motionEasings.expressive } }));
      try {
        revealTimeline
          ?.add(revealTargets, { opacity: [0, 1], translateY: [18, 0], duration: 500, delay: stagger(62) }, 0)
          .add(visual, { opacity: [0, 1], scale: [1.018, 1], clipPath: ['inset(0 0 14% 0)', 'inset(0 0 0% 0)'], duration: 560 }, 70);
      } catch {
        settleMotionTargets([...revealTargets, visual]);
      }
    }

    return () => {
      registry.clear();
      clearHints();
    };
  }, [reduced]);

  useEffect(() => {
    const visual = visualRef.current;
    const orbit = visual?.querySelector<HTMLElement>('[data-orbit-spin]');
    if (!visual || !orbit || reduced) return;
    const animation = animateMotion(orbit, {
      rotate: [0, 360],
      duration: 32000,
      loop: true,
      ease: motionEasings.linear,
    }, 'transform');
    return () => { animation?.revert(); };
  }, [reduced]);

  useEffect(() => {
    const scene = sceneRef.current;
    const target = visualRef.current?.querySelector<HTMLElement>('[data-art-stage]');
    if (!scene || !target || reduced || !window.matchMedia('(min-width: 901px) and (pointer: fine)').matches) return;
    const parallax = createMotionAnimatable(target, {
      translateX: { unit: 'px', duration: motionTokens.micro, ease: motionEasings.out },
      translateY: { unit: 'px', duration: motionTokens.micro, ease: motionEasings.out },
    });
    const move = (event: PointerEvent) => {
      const bounds = scene.getBoundingClientRect();
      parallax?.translateX(((event.clientX - bounds.left) / bounds.width - .5) * 7);
      parallax?.translateY(((event.clientY - bounds.top) / bounds.height - .5) * 5);
    };
    const reset = () => {
      parallax?.translateX(0);
      parallax?.translateY(0);
    };
    scene.addEventListener('pointermove', move, { passive: true });
    scene.addEventListener('pointerleave', reset);
    return () => {
      scene.removeEventListener('pointermove', move);
      scene.removeEventListener('pointerleave', reset);
      parallax?.revert();
    };
  }, [reduced]);

  return (
    <section
      className={`${styles.track} ${reduced ? styles.reduced : ''}`}
      ref={trackRef}
      aria-labelledby="lunare-hero-title"
      data-reduced-motion={reduced ? 'true' : undefined}
    >
      <span id="destaques" className={styles.journeyMarker} aria-hidden="true" />
      <div className={styles.scene} ref={sceneRef}>
        {introVisible && (
          <div className={styles.brandIntro} data-brand-intro aria-hidden="true">
            <svg viewBox="0 0 160 160">
              <circle data-intro-path pathLength="1" cx="80" cy="80" r="54" />
              <path data-intro-path pathLength="1" d="M42 97c9 27 42 38 65 20 17-13 22-37 10-56" />
              <path data-intro-path pathLength="1" d="M46 54c20-18 46-20 70-4-20 15-45 15-70 4Z" />
            </svg>
            <div data-intro-wordmark>LUNARE<small>Premium Japanese Food</small></div>
          </div>
        )}

        <div className={styles.glow} aria-hidden="true" />
        <div className={styles.copy}>
          <p className={styles.eyebrow} data-hero-reveal><span /> Premium Japanese Food · Campos Gerais — MG</p>
          <h1 id="lunare-hero-title" data-hero-reveal>O segredo está<br />nos <em>detalhes.</em></h1>
          <p className={styles.intro} data-hero-reveal>Precisão no preparo, frescor a validar com a casa e uma apresentação pensada para transformar cada escolha em experiência.</p>
          <div className={styles.ctas} data-hero-reveal>
            <Link className="button button-primary" to="/cardapio" data-menu-cta>
              Explorar cardápio <ArrowUpRight data-menu-arrow size={18} />
            </Link>
            <a className="button button-ghost" href="#destaques"><ScanLine size={17} /> Ver transformação</a>
          </div>
          <p className="sr-only">Ao rolar, acompanhe o percurso visual do peixe inteiro ao nigiri final.</p>
        </div>

        <div className={styles.visual} ref={visualRef} data-hero-reveal>
          <SushiAssembly />
        </div>

        <a className={styles.scroll} href="#destaques" aria-label="Avançar para a montagem do nigiri">
          <ArrowDown size={17} /> Role para transformar
        </a>
      </div>
    </section>
  );
}
