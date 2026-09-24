import { useEffect, useSyncExternalStore, type RefObject } from 'react';
import {
  animateMotion,
  motionEasings,
  motionTokens,
  MotionRegistry,
  prefersReducedMotion,
  settleMotionTargets,
  stagger,
} from '../lib/motion';

type MotionListener = () => void;
const motionListeners = new Set<MotionListener>();
let motionMedia: MediaQueryList | null = null;
let motionObserver: MutationObserver | null = null;

const notifyMotionListeners = () => motionListeners.forEach((listener) => listener());

const subscribeToMotion = (listener: MotionListener) => {
  motionListeners.add(listener);
  if (motionListeners.size === 1 && typeof window !== 'undefined') {
    motionMedia = window.matchMedia?.('(prefers-reduced-motion: reduce)') ?? null;
    motionMedia?.addEventListener('change', notifyMotionListeners);
    if (typeof MutationObserver !== 'undefined') {
      motionObserver = new MutationObserver(notifyMotionListeners);
      motionObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-reduced-motion'] });
    }
  }
  return () => {
    motionListeners.delete(listener);
    if (motionListeners.size !== 0) return;
    motionMedia?.removeEventListener('change', notifyMotionListeners);
    motionObserver?.disconnect();
    motionMedia = null;
    motionObserver = null;
  };
};

export function useReducedMotion() {
  return useSyncExternalStore(subscribeToMotion, prefersReducedMotion, () => true);
}

export function useSectionReveals<T extends HTMLElement>(root: RefObject<T | null>, refreshKey = '') {
  const reduced = useReducedMotion();

  useEffect(() => {
    const container = root.current;
    if (!container) return;
    const sections = Array.from(container.querySelectorAll<HTMLElement>('[data-reveal]'));
    if (reduced) {
      sections.forEach((section) => settleMotionTargets([section, ...section.querySelectorAll<HTMLElement>('[data-reveal-item]')]));
      return;
    }

    const registry = new MotionRegistry();
    const settleRevealed = () => sections
      .filter((section) => section.dataset.motionRevealed === 'true')
      .forEach((section) => settleMotionTargets([section, ...section.querySelectorAll<HTMLElement>('[data-reveal-item]')]));
    const reveal = (section: HTMLElement) => {
      if (section.dataset.motionRevealed === 'true') return;
      section.dataset.motionRevealed = 'true';
      const items = Array.from(section.querySelectorAll<HTMLElement>('[data-reveal-item]'));
      const targets = items.length ? items : [section];
      registry.add(animateMotion(targets, {
        opacity: [0, 1],
        translateY: [18, 0],
        duration: motionTokens.reveal,
        delay: stagger(48),
        ease: motionEasings.expressive,
      }));
    };

    if (typeof IntersectionObserver === 'undefined') {
      sections.forEach(reveal);
      return () => {
        registry.clear();
        settleRevealed();
      };
    }

    sections.forEach((section) => {
      if (section.dataset.motionRevealed !== 'true') {
        section.style.opacity = '1';
        const items = section.querySelectorAll<HTMLElement>('[data-reveal-item]');
        items.forEach((item) => {
          item.style.opacity = '0';
          item.style.transform = 'translateY(18px)';
        });
      }
    });
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        reveal(entry.target as HTMLElement);
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -9% 0px', threshold: 0.12 });
    sections.forEach((section) => observer.observe(section));
    return () => {
      observer.disconnect();
      registry.clear();
      settleRevealed();
    };
  }, [reduced, refreshKey, root]);
}
