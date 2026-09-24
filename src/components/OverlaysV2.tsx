import type { JSAnimation } from 'animejs';
import { Check, ChevronLeft, Minus, MoonStar, Pencil, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { findProduct, formatCurrency } from '../data/menu';
import { restaurant } from '../data/restaurant';
import { useReducedMotion } from '../hooks/useMotion';
import {
  animateMotion,
  motionEasings,
  motionTokens,
  settleMotionTargets,
  stagger,
} from '../lib/motion';
import { useOrderStore } from '../store/useOrderStore';
import { cartSubtotal, configuredUnitPrice } from '../utils/order';
import { ResponsiveImage } from './ui/ResponsiveImage';
import styles from './Overlays.module.css';
import './OverlaysV2.css';

interface DialogProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  label: string;
  side?: boolean;
}

const focusableSelector = [
  'button:not([disabled])',
  'a[href]:not([aria-disabled="true"])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[contenteditable="true"]',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

let bodyLockCount = 0;
let bodyOverflowBeforeLock = '';
const dialogStack: symbol[] = [];

function lockBody() {
  if (bodyLockCount === 0) {
    bodyOverflowBeforeLock = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
  }
  bodyLockCount += 1;

  return () => {
    bodyLockCount = Math.max(0, bodyLockCount - 1);
    if (bodyLockCount === 0) document.body.style.overflow = bodyOverflowBeforeLock;
  };
}

function Dialog({ open, onClose, children, label, side = false }: DialogProps) {
  const reduced = useReducedMotion();
  const [mounted, setMounted] = useState(open);
  const backdropRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const onCloseRef = useRef(onClose);
  const openRef = useRef(open);
  const closingRef = useRef(!open);
  const transitionRef = useRef(0);
  const runningRef = useRef<JSAnimation[]>([]);
  const dialogIdRef = useRef(Symbol('lunare-dialog'));

  onCloseRef.current = onClose;
  openRef.current = open;

  const stopRunningMotion = useCallback(() => {
    runningRef.current.forEach((animation) => animation.pause());
    runningRef.current = [];
  }, []);

  const requestClose = useCallback(() => {
    if (closingRef.current || !openRef.current) return;
    closingRef.current = true;
    onCloseRef.current();
  }, []);

  useLayoutEffect(() => {
    if (open && !mounted) setMounted(true);
  }, [mounted, open]);

  useLayoutEffect(() => {
    if (!mounted) return;
    const backdrop = backdropRef.current;
    const panel = panelRef.current;
    if (!backdrop || !panel) return;

    stopRunningMotion();
    const transition = ++transitionRef.current;
    const staggeredItems = Array.from(panel.querySelectorAll<HTMLElement>('[data-dialog-stagger]'));

    if (open) {
      closingRef.current = false;
      if (reduced) {
        settleMotionTargets([backdrop, panel, ...staggeredItems]);
        return;
      }

      const wide = window.matchMedia?.('(min-width: 700px)').matches ?? window.innerWidth >= 700;
      const backdropMotion = animateMotion(backdrop, {
        opacity: [0, 1],
        duration: motionTokens.standard,
        ease: motionEasings.out,
      });
      const panelMotion = side
        ? animateMotion(panel, {
            opacity: [0, 1],
            translateX: [42, 0],
            duration: motionTokens.standard,
            ease: motionEasings.expressive,
            onComplete: () => {
              if (transition === transitionRef.current && openRef.current) settleMotionTargets([backdrop, panel]);
            },
          })
        : animateMotion(panel, wide
          ? {
              opacity: [0, 1],
              translateY: [10, 0],
              scale: [0.975, 1],
              duration: motionTokens.standard,
              ease: motionEasings.expressive,
              onComplete: () => {
                if (transition === transitionRef.current && openRef.current) settleMotionTargets([backdrop, panel]);
              },
            }
          : {
              opacity: [0, 1],
              translateY: [46, 0],
              duration: motionTokens.standard,
              ease: motionEasings.expressive,
              onComplete: () => {
                if (transition === transitionRef.current && openRef.current) settleMotionTargets([backdrop, panel]);
              },
            });
      const itemMotion = staggeredItems.length > 0
        ? animateMotion(staggeredItems, {
            opacity: [0, 1],
            translateX: side ? [12, 0] : [0, 0],
            translateY: side ? [0, 0] : [8, 0],
            delay: stagger(34),
            duration: motionTokens.micro,
            ease: motionEasings.out,
          })
        : null;

      runningRef.current = [backdropMotion, panelMotion, itemMotion].filter(
        (animation): animation is JSAnimation => animation !== null,
      );
      if (!panelMotion) settleMotionTargets([backdrop, panel, ...staggeredItems]);
      return () => stopRunningMotion();
    }

    closingRef.current = true;
    if (reduced) {
      setMounted(false);
      return;
    }

    const wide = window.matchMedia?.('(min-width: 700px)').matches ?? window.innerWidth >= 700;
    const backdropMotion = animateMotion(backdrop, {
      opacity: 0,
      duration: motionTokens.standard,
      ease: motionEasings.out,
    });
    const completeExit = () => {
      if (transition !== transitionRef.current || openRef.current) return;
      runningRef.current = [];
      setMounted(false);
    };
    const panelMotion = side
      ? animateMotion(panel, {
          opacity: 0,
          translateX: 42,
          duration: motionTokens.standard,
          ease: motionEasings.out,
          onComplete: completeExit,
        })
      : animateMotion(panel, wide
        ? {
            opacity: 0,
            translateY: 8,
            scale: 0.98,
            duration: motionTokens.standard,
            ease: motionEasings.out,
            onComplete: completeExit,
          }
        : {
            opacity: 0,
            translateY: 42,
            duration: motionTokens.standard,
            ease: motionEasings.out,
            onComplete: completeExit,
          });

    runningRef.current = [backdropMotion, panelMotion].filter(
      (animation): animation is JSAnimation => animation !== null,
    );
    if (!panelMotion) setMounted(false);
    return () => stopRunningMotion();
  }, [mounted, open, reduced, side, stopRunningMotion]);

  useEffect(() => {
    if (!mounted || !open) return;
    const dialogId = dialogIdRef.current;
    previousFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    dialogStack.push(dialogId);
    const unlockBody = lockBody();
    const focusTimer = window.setTimeout(() => {
      const preferred = panelRef.current?.querySelector<HTMLElement>('[data-autofocus]');
      const first = preferred ?? panelRef.current?.querySelector<HTMLElement>(focusableSelector) ?? panelRef.current;
      first?.focus();
    }, 0);

    const onKeyDown = (event: KeyboardEvent) => {
      if (dialogStack.at(-1) !== dialogId) return;
      if (event.key === 'Escape') {
        event.preventDefault();
        requestClose();
        return;
      }
      if (event.key !== 'Tab' || !panelRef.current) return;
      const focusable = Array.from(panelRef.current.querySelectorAll<HTMLElement>(focusableSelector));
      if (focusable.length === 0) {
        event.preventDefault();
        panelRef.current.focus();
        return;
      }
      const first = focusable[0];
      const last = focusable.at(-1) ?? first;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener('keydown', onKeyDown);
      const stackIndex = dialogStack.lastIndexOf(dialogId);
      if (stackIndex >= 0) dialogStack.splice(stackIndex, 1);
      unlockBody();
      if (previousFocusRef.current?.isConnected) previousFocusRef.current.focus();
    };
  }, [mounted, open, requestClose]);

  useEffect(() => () => stopRunningMotion(), [stopRunningMotion]);

  if (!mounted) return null;
  return (
    <div
      ref={backdropRef}
      className={`${styles.backdrop} ${!open ? styles.closing : ''}`}
      role="presentation"
      aria-hidden={!open || undefined}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) requestClose();
      }}
    >
      <section
        ref={panelRef}
        className={`${side ? styles.drawer : styles.sheet} overlay-panel ${side ? 'overlay-drawer' : 'overlay-sheet'}`}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        tabIndex={-1}
      >
        {children}
      </section>
    </div>
  );
}

export function ProductDialog() {
  const id = useOrderStore((state) => state.selectedProductId);
  const editingKey = useOrderStore((state) => state.editingItemKey);
  const cart = useOrderStore((state) => state.cart);
  const selectProduct = useOrderStore((state) => state.selectProduct);
  const addItem = useOrderStore((state) => state.addItem);
  const removeItem = useOrderStore((state) => state.removeItem);
  const demoMode = useOrderStore((state) => state.demoMode);
  const storeStatus = useOrderStore((state) => state.storeStatus);
  const setClosedOpen = useOrderStore((state) => state.setClosedOpen);
  const setCartOpen = useOrderStore((state) => state.setCartOpen);
  const reduced = useReducedMotion();
  const location = useLocation();
  const navigate = useNavigate();
  const activeProduct = id ? findProduct(id) : undefined;
  const retainedProductRef = useRef(activeProduct);
  if (activeProduct) retainedProductRef.current = activeProduct;
  const product = activeProduct ?? retainedProductRef.current;
  const editing = editingKey ? cart.find((item) => item.key === editingKey) : undefined;
  const [variantId, setVariantId] = useState<string | null>(null);
  const [optionIds, setOptionIds] = useState<string[]>([]);
  const [note, setNote] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const feedbackTimerRef = useRef<number | null>(null);
  const cartTimerRef = useRef<number | null>(null);
  const addButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!id) return;
    setVariantId(editing?.configuration.variantId ?? null);
    setOptionIds(editing?.configuration.optionIds ?? []);
    setNote(editing?.configuration.note ?? '');
    setQuantity(editing?.quantity ?? 1);
    setAdded(false);
  }, [editing, id]);

  useEffect(() => {
    if (!added || reduced || !addButtonRef.current) return;
    const animation = animateMotion(addButtonRef.current, {
      scale: [0.98, 1.025, 1],
      duration: motionTokens.micro,
      ease: 'outBack(1.25)',
    });
    return () => {
      animation?.pause();
    };
  }, [added, reduced]);

  useEffect(() => () => {
    if (feedbackTimerRef.current !== null) window.clearTimeout(feedbackTimerRef.current);
    if (cartTimerRef.current !== null) window.clearTimeout(cartTimerRef.current);
  }, []);

  const close = () => {
    selectProduct(null);
    const next = new URLSearchParams(location.search);
    next.delete('produto');
    navigate({ pathname: location.pathname, search: next.toString() }, { replace: true, preventScrollReset: true });
  };

  const valid = useMemo(() => Boolean(product?.available)
    && (!product?.variants.length || Boolean(variantId))
    && Boolean(product?.optionGroups.every((group) => {
      const count = group.options.filter((option) => optionIds.includes(option.id)).length;
      return count >= group.min && count <= group.max;
    })), [optionIds, product, variantId]);

  if (!product) return null;
  const configuration = { variantId, optionIds, note: note.slice(0, 255) };
  const total = configuredUnitPrice(product, configuration) * quantity;

  const toggleOption = (groupId: string, optionId: string, max: number) => {
    const group = product.optionGroups.find((item) => item.id === groupId);
    if (!group) return;
    setOptionIds((current) => {
      const groupIds = group.options.map((option) => option.id);
      if (max === 1) return [...current.filter((currentId) => !groupIds.includes(currentId)), optionId];
      if (current.includes(optionId)) return current.filter((currentId) => currentId !== optionId);
      return groupIds.filter((currentId) => current.includes(currentId)).length >= max ? current : [...current, optionId];
    });
  };

  const add = () => {
    if (!valid || added) return;
    if (storeStatus === 'closed' && !demoMode) {
      setClosedOpen(true);
      return;
    }
    if (editingKey) removeItem(editingKey);
    addItem({ productId: product.id, quantity, configuration });
    setAdded(true);
    feedbackTimerRef.current = window.setTimeout(() => {
      close();
      cartTimerRef.current = window.setTimeout(
        () => setCartOpen(true),
        reduced ? motionTokens.instant : motionTokens.standard,
      );
    }, reduced ? motionTokens.instant : motionTokens.micro);
  };

  return (
    <Dialog open={Boolean(id)} onClose={close} label={`Detalhes de ${product.name}`}>
      <button className={`${styles.close} overlay-close`} type="button" onClick={close} aria-label="Fechar ficha" data-autofocus>
        <ChevronLeft />
      </button>
      <ResponsiveImage
        className={styles.heroImage}
        src={product.image}
        alt={product.alt}
        sizes="(max-width: 699px) 100vw, 600px"
        loading="eager"
      />
      <div className={`${styles.sheetBody} overlay-sheet-body`}>
        <small>{product.available ? 'Disponível na demonstração' : 'Indisponível'}</small>
        <h2>{product.name}</h2>
        <p>{product.description}</p>
        <strong className={styles.price}>A partir de {formatCurrency(product.priceCents)}</strong>
        <p className={styles.allergen}>{product.allergenNotes}</p>
        {product.variants.length > 0 && (
          <fieldset className={styles.optionGroup} aria-required="true">
            <legend>Escolha o tamanho <em>Obrigatório</em></legend>
            {product.variants.map((variant) => (
              <label key={variant.id}>
                <input
                  type="radio"
                  name={`${product.id}-variant`}
                  checked={variantId === variant.id}
                  onChange={() => setVariantId(variant.id)}
                />
                <span>{variant.name}</span>
                <b>{formatCurrency(variant.priceCents)}</b>
              </label>
            ))}
          </fieldset>
        )}
        {product.optionGroups.map((group) => (
          <fieldset className={styles.optionGroup} key={group.id} aria-required={group.required}>
            <legend>{group.name} <em>{group.required ? 'Obrigatório' : `Opcional · até ${group.max}`}</em></legend>
            {group.options.map((option) => (
              <label key={option.id}>
                <input
                  type={group.max === 1 ? 'radio' : 'checkbox'}
                  name={`${product.id}-${group.id}`}
                  checked={optionIds.includes(option.id)}
                  onChange={() => toggleOption(group.id, option.id, group.max)}
                />
                <span>{option.name}</span>
                <b>{option.priceCents ? `+ ${formatCurrency(option.priceCents)}` : 'Incluso'}</b>
              </label>
            ))}
          </fieldset>
        ))}
        <label className={styles.note}>
          Observação
          <textarea
            maxLength={255}
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="Ex.: retirar item X"
            aria-describedby="product-note-count"
          />
          <span id="product-note-count">{note.length}/255</span>
        </label>
        <div className={styles.addRow}>
          <div className={`${styles.stepper} product-stepper`} aria-label="Quantidade">
            <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))} aria-label="Diminuir quantidade">
              <Minus />
            </button>
            <b aria-live="polite">{quantity}</b>
            <button type="button" onClick={() => setQuantity(Math.min(99, quantity + 1))} aria-label="Aumentar quantidade">
              <Plus />
            </button>
          </div>
          <button
            ref={addButtonRef}
            className={`button button-primary ${styles.addButton} ${added ? styles.addedButton : ''}`}
            type="button"
            onClick={add}
            disabled={!valid || added}
            aria-live="polite"
          >
            {added ? <><Check aria-hidden="true" /> Adicionado</> : <>{editingKey ? 'Atualizar' : 'Adicionar'} · {formatCurrency(total)}</>}
          </button>
        </div>
      </div>
    </Dialog>
  );
}

export function CartDrawerV2() {
  const open = useOrderStore((state) => state.cartOpen);
  const setOpen = useOrderStore((state) => state.setCartOpen);
  const cart = useOrderStore((state) => state.cart);
  const updateQuantity = useOrderStore((state) => state.updateQuantity);
  const removeItem = useOrderStore((state) => state.removeItem);
  const editItem = useOrderStore((state) => state.editItem);
  const reduced = useReducedMotion();
  const cartLinesRef = useRef<HTMLDivElement>(null);
  const subtotalRef = useRef<HTMLElement>(null);
  const previousSubtotalRef = useRef(0);
  const removalAnimationsRef = useRef(new Map<string, JSAnimation>());
  const removingKeysRef = useRef(new Set<string>());
  const subtotal = cartSubtotal(cart);
  const below = subtotal < restaurant.minimumOrderCents;

  const finishRemoval = useCallback((key: string) => {
    removalAnimationsRef.current.delete(key);
    removingKeysRef.current.delete(key);
    removeItem(key);
  }, [removeItem]);

  const removeWithMotion = (key: string) => {
    if (removingKeysRef.current.has(key)) return;
    const target = Array.from(cartLinesRef.current?.querySelectorAll<HTMLElement>('[data-cart-key]') ?? [])
      .find((element) => element.dataset.cartKey === key);
    if (reduced || !target) {
      removeItem(key);
      return;
    }
    removingKeysRef.current.add(key);
    target.setAttribute('aria-busy', 'true');
    target.style.height = `${target.offsetHeight}px`;
    target.style.overflow = 'hidden';
    const animation = animateMotion(target, {
      opacity: 0,
      translateX: 18,
      height: 0,
      paddingTop: 0,
      paddingBottom: 0,
      duration: motionTokens.micro,
      ease: motionEasings.out,
      onComplete: () => finishRemoval(key),
    }, 'transform, opacity, height');
    if (animation) removalAnimationsRef.current.set(key, animation);
    else finishRemoval(key);
  };

  useEffect(() => {
    if (!open || previousSubtotalRef.current === subtotal || !subtotalRef.current) {
      previousSubtotalRef.current = subtotal;
      return;
    }
    previousSubtotalRef.current = subtotal;
    if (reduced) return;
    const animation = animateMotion(subtotalRef.current, {
      opacity: [0.7, 1],
      scale: [0.97, 1],
      duration: motionTokens.micro,
      ease: motionEasings.out,
    });
    return () => {
      animation?.pause();
    };
  }, [open, reduced, subtotal]);

  useEffect(() => () => {
    removalAnimationsRef.current.forEach((animation) => animation.pause());
    removalAnimationsRef.current.clear();
  }, []);

  return (
    <Dialog open={open} onClose={() => setOpen(false)} label="Carrinho de demonstração" side>
      <div className={`${styles.drawerHead} drawer-head`}>
        <div><small>Demonstração</small><h2>Seu carrinho</h2></div>
        <button type="button" onClick={() => setOpen(false)} aria-label="Fechar carrinho" data-autofocus><X /></button>
      </div>
      <div className={`${styles.cartLines} cart-lines`} ref={cartLinesRef}>
        {cart.length === 0 ? (
          <div className={styles.cartEmpty}>
            <ShoppingBag />
            <h3>Sua órbita está vazia</h3>
            <p>Explore o cardápio e configure um prato para simular.</p>
            <Link className="button button-secondary" to="/cardapio" onClick={() => setOpen(false)}>Ver cardápio</Link>
          </div>
        ) : cart.map((item) => {
          const product = findProduct(item.productId);
          if (!product) return null;
          const unit = configuredUnitPrice(product, item.configuration);
          const chosenOptions = item.configuration.optionIds
            .map((optionId) => product.optionGroups.flatMap((group) => group.options).find((option) => option.id === optionId)?.name)
            .filter((name): name is string => Boolean(name));
          const summary = [
            product.variants.find((variant) => variant.id === item.configuration.variantId)?.name,
            ...chosenOptions,
          ].filter(Boolean).join(' · ') || 'Configuração padrão';
          return (
            <article className={`${styles.cartLine} cart-line`} key={item.key} data-cart-key={item.key} data-dialog-stagger>
              <ResponsiveImage src={product.image} alt="" sizes="82px" loading="lazy" />
              <div>
                <strong>{product.name}</strong>
                <small>{summary}</small>
                {item.configuration.note && <small>“{item.configuration.note}”</small>}
                <b>{formatCurrency(unit * item.quantity)}</b>
                <div className={styles.lineActions}>
                  <button
                    type="button"
                    onClick={() => item.quantity === 1 ? removeWithMotion(item.key) : updateQuantity(item.key, item.quantity - 1)}
                    aria-label={`Diminuir quantidade de ${product.name}`}
                  ><Minus size={15} /></button>
                  <span aria-label={`Quantidade: ${item.quantity}`}>{item.quantity}</span>
                  <button type="button" onClick={() => updateQuantity(item.key, item.quantity + 1)} aria-label={`Aumentar quantidade de ${product.name}`}><Plus size={15} /></button>
                  <button type="button" onClick={() => editItem(item.key)} aria-label={`Editar ${product.name}`}><Pencil size={15} /></button>
                  <button type="button" onClick={() => removeWithMotion(item.key)} aria-label={`Remover ${product.name}`}><Trash2 size={16} /></button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
      {cart.length > 0 && (
        <div className={`${styles.cartFooter} cart-footer`}>
          <div><span>Subtotal</span><strong ref={subtotalRef}>{formatCurrency(subtotal)}</strong></div>
          {below && <p className={styles.minimum}>Faltam {formatCurrency(restaurant.minimumOrderCents - subtotal)} para o pedido mínimo demonstrativo.</p>}
          <small>Taxa e pagamento são calculados apenas na simulação.</small>
          <Link
            className={`button button-primary ${below ? styles.disabledLink : ''}`}
            aria-disabled={below}
            tabIndex={below ? -1 : undefined}
            to="/checkout"
            onClick={(event) => {
              if (below) event.preventDefault();
              else setOpen(false);
            }}
          >
            Revisar demonstração
          </Link>
        </div>
      )}
    </Dialog>
  );
}

export function ClosedDialog() {
  const open = useOrderStore((state) => state.closedOpen);
  const setOpen = useOrderStore((state) => state.setClosedOpen);
  const setDemoMode = useOrderStore((state) => state.setDemoMode);
  return (
    <Dialog open={open} onClose={() => setOpen(false)} label="Loja fechada">
      <button className={`${styles.close} overlay-close`} type="button" onClick={() => setOpen(false)} aria-label="Fechar aviso de loja fechada" data-autofocus><X /></button>
      <div className={styles.messageIcon}><MoonStar /></div>
      <div className={`${styles.message} overlay-message`}>
        <small>Status da loja</small>
        <h2>Estamos fechados!</h2>
        <p>Enquanto isso, fique à vontade para explorar e configurar o cardápio.</p>
        <button className="button button-primary" type="button" onClick={() => { setDemoMode(true); setOpen(false); }}>Continuar em modo demonstração</button>
        <span>Nenhum pedido será enviado.</span>
      </div>
    </Dialog>
  );
}

export function InfoDialog() {
  const open = useOrderStore((state) => state.infoOpen);
  const setOpen = useOrderStore((state) => state.setInfoOpen);
  const status = useOrderStore((state) => state.storeStatus);
  const [tab, setTab] = useState<'sobre' | 'horarios'>('sobre');
  const onTabKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === 'Home'
      ? 'sobre'
      : event.key === 'End'
        ? 'horarios'
        : tab === 'sobre' ? 'horarios' : 'sobre';
    setTab(next);
    window.requestAnimationFrame(() => document.getElementById(`info-tab-${next}`)?.focus());
  };
  return (
    <Dialog open={open} onClose={() => setOpen(false)} label="Informações da loja">
      <button className={`${styles.close} overlay-close`} type="button" onClick={() => setOpen(false)} aria-label="Fechar informações da loja" data-autofocus><X /></button>
      <div className={`${styles.infoBody} overlay-info-body`}>
        <ResponsiveImage src="/media/lunare-emblema.jpg" alt="Emblema Lunare" sizes="80px" loading="lazy" />
        <h2>{restaurant.name}</h2>
        <p>“{restaurant.tagline}”</p>
        <div className={`${styles.tabs} info-tabs`} role="tablist" aria-label="Informações da loja">
          <button id="info-tab-sobre" className={tab === 'sobre' ? styles.tabActive : ''} type="button" role="tab" aria-selected={tab === 'sobre'} aria-controls="info-panel-sobre" tabIndex={tab === 'sobre' ? 0 : -1} onKeyDown={onTabKeyDown} onClick={() => setTab('sobre')}>Sobre</button>
          <button id="info-tab-horarios" className={tab === 'horarios' ? styles.tabActive : ''} type="button" role="tab" aria-selected={tab === 'horarios'} aria-controls="info-panel-horarios" tabIndex={tab === 'horarios' ? 0 : -1} onKeyDown={onTabKeyDown} onClick={() => setTab('horarios')}>Horários</button>
        </div>
        {tab === 'sobre' ? (
          <div id="info-panel-sobre" className={styles.infoList} role="tabpanel" aria-labelledby="info-tab-sobre">
            <p><span>Status</span><b>{status === 'open' ? 'Aberto — demonstração' : 'Fechado'}</b></p>
            <p><span>Localidade</span><b>{restaurant.location}</b></p>
            <p><span>Delivery/retirada</span><b>Mínimo {formatCurrency(restaurant.minimumOrderCents)}</b></p>
            <p><span>Endereço</span><b>{restaurant.address.value}</b></p>
            <p><span>Contato</span><b>{restaurant.contact.label}</b></p>
          </div>
        ) : (
          <div id="info-panel-horarios" className={styles.infoList} role="tabpanel" aria-labelledby="info-tab-horarios">
            {restaurant.schedule.map((item) => <p key={item.label}><span>{item.label}</span><b>{item.value}</b></p>)}
          </div>
        )}
        <small className={styles.validation}>Campos marcados são provisórios e precisam de validação do estabelecimento.</small>
      </div>
    </Dialog>
  );
}

export function UtilityDialog() {
  const panel = useOrderStore((state) => state.utilityPanel);
  const setPanel = useOrderStore((state) => state.setUtilityPanel);
  return (
    <Dialog open={Boolean(panel)} onClose={() => setPanel(null)} label={panel === 'discount' ? 'Desconto demonstrativo' : 'Promoções em breve'}>
      <button className={`${styles.close} overlay-close`} type="button" onClick={() => setPanel(null)} aria-label="Fechar painel" data-autofocus><X /></button>
      <div className={styles.messageIcon}>{panel === 'discount' ? <Check /> : <MoonStar />}</div>
      <div className={`${styles.message} overlay-message`}>
        <small>Recurso demonstrativo</small>
        <h2>{panel === 'discount' ? 'LUNARE10' : 'Promoções em breve'}</h2>
        <p>{panel === 'discount' ? 'Use este código no checkout para aplicar 10% de desconto exclusivamente na demonstração.' : 'Este painel reserva um destino útil sem simular uma promoção inexistente.'}</p>
        <button className="button button-secondary" type="button" onClick={() => setPanel(null)}>Entendi</button>
      </div>
    </Dialog>
  );
}
