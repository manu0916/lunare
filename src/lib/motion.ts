import {
  animate,
  createAnimatable,
  createTimeline,
  stagger,
  type AnimatableObject,
  type AnimatableParams,
  type AnimationParams,
  type JSAnimation,
  type TargetsParam,
  type Timeline,
  type TimelineParams,
} from 'animejs';

export const motionTokens = {
  instant: 120,
  micro: 190,
  standard: 320,
  reveal: 600,
  intro: 980,
} as const;

export const motionEasings = {
  out: 'outQuad',
  smooth: 'inOutQuad',
  expressive: 'outExpo',
  linear: 'linear',
} as const;

export type MotionInstance = JSAnimation | Timeline | AnimatableObject;

const asElements = (targets: TargetsParam): Element[] => {
  if (typeof targets === 'string') return Array.from(document.querySelectorAll(targets));
  if (targets instanceof Element) return [targets];
  if (targets instanceof NodeList) return Array.from(targets).filter((target): target is Element => target instanceof Element);
  if (Array.isArray(targets)) return targets.filter((target): target is Element => target instanceof Element);
  return [];
};

const clearWillChange = (elements: Element[]) => {
  elements.forEach((element) => {
    if (element instanceof HTMLElement || element instanceof SVGElement) element.style.willChange = '';
  });
};

export const settleMotionTargets = (targets: TargetsParam) => {
  asElements(targets).forEach((element) => {
    if (!(element instanceof HTMLElement || element instanceof SVGElement)) return;
    element.style.opacity = '';
    element.style.transform = '';
    element.style.translate = '';
    element.style.scale = '';
    element.style.rotate = '';
    element.style.clipPath = '';
    element.style.willChange = '';
  });
};

export const prefersReducedMotion = () => {
  if (typeof window === 'undefined') return true;
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true
    || document.documentElement.dataset.reducedMotion === 'true';
};

export function animateMotion(
  targets: TargetsParam,
  parameters: AnimationParams,
  willChange = 'transform, opacity',
): JSAnimation | null {
  const elements = asElements(targets);
  if (elements.length === 0) return null;
  const onComplete = parameters.onComplete;
  elements.forEach((element) => {
    if (element instanceof HTMLElement || element instanceof SVGElement) element.style.willChange = willChange;
  });
  try {
    return animate(elements, {
      ...parameters,
      onComplete: (animation) => {
        clearWillChange(elements);
        if (typeof onComplete === 'function') onComplete(animation);
      },
    });
  } catch {
    clearWillChange(elements);
    settleMotionTargets(targets);
    return null;
  }
}

export function createMotionTimeline(parameters: TimelineParams = {}): Timeline | null {
  try {
    return createTimeline(parameters);
  } catch {
    return null;
  }
}

export function createMotionAnimatable(targets: TargetsParam, parameters: AnimatableParams): AnimatableObject | null {
  try {
    return createAnimatable(targets, parameters);
  } catch {
    settleMotionTargets(targets);
    return null;
  }
}

export class MotionRegistry {
  private instances = new Set<MotionInstance>();

  add<T extends MotionInstance | null>(instance: T): T {
    if (instance) this.instances.add(instance);
    return instance;
  }

  clear() {
    this.instances.forEach((instance) => {
      try {
        instance.revert();
      } catch {
        // A detached target can already have been disposed by React.
      }
    });
    this.instances.clear();
  }
}

export { stagger };
