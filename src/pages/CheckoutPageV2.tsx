import { ArrowLeft, Check, CreditCard, LockKeyhole, MapPin, Store, TicketPercent, WalletCards } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { findProduct, formatCurrency } from '../data/menu';
import { restaurant } from '../data/restaurant';
import { useReducedMotion } from '../hooks/useMotion';
import { animateMotion, motionEasings, motionTokens, MotionRegistry, stagger } from '../lib/motion';
import { useOrderStore } from '../store/useOrderStore';
import type { PaymentMethod } from '../types';
import { orderTotals } from '../utils/order';
import styles from './CheckoutPageV2.module.css';
import './CheckoutPageV2.a11y.css';

export function CheckoutPageV2() {
  const cart = useOrderStore((state) => state.cart);
  const clearCart = useOrderStore((state) => state.clearCart);
  const fulfillment = useOrderStore((state) => state.fulfillment);
  const setFulfillment = useOrderStore((state) => state.setFulfillment);
  const coupon = useOrderStore((state) => state.coupon);
  const couponMessage = useOrderStore((state) => state.couponMessage);
  const applyCoupon = useOrderStore((state) => state.applyCoupon);
  const removeCoupon = useOrderStore((state) => state.removeCoupon);
  const setLastOrder = useOrderStore((state) => state.setLastOrder);
  const status = useOrderStore((state) => state.storeStatus);
  const demoMode = useOrderStore((state) => state.demoMode);
  const setClosed = useOrderStore((state) => state.setClosedOpen);
  const [name, setName] = useState('Marina Demo');
  const [phone, setPhone] = useState('(00) 00000-0000');
  const [payment, setPayment] = useState<PaymentMethod>('demo-pix');
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [attempted, setAttempted] = useState(false);
  const [error, setError] = useState('');
  const [feedbackVersion, setFeedbackVersion] = useState(0);
  const pageRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const totalRef = useRef<HTMLElement>(null);
  const couponFeedbackRef = useRef<HTMLParagraphElement>(null);
  const errorRef = useRef<HTMLParagraphElement>(null);
  const busyRef = useRef(false);
  const timerRef = useRef<number | null>(null);
  const previousFulfillmentRef = useRef(fulfillment);
  const reducedMotion = useReducedMotion();
  const navigate = useNavigate();
  const totals = useMemo(() => orderTotals(cart, fulfillment, coupon), [cart, fulfillment, coupon]);
  const below = totals.subtotalCents < restaurant.minimumOrderCents;
  const nameInvalid = !name.trim();
  const phoneInvalid = !phone.trim();
  const incomplete = nameInvalid || phoneInvalid || !payment;

  useEffect(() => () => {
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
  }, []);

  useEffect(() => {
    if (reducedMotion || !pageRef.current) return;
    const targets = Array.from(pageRef.current.querySelectorAll<HTMLElement>('[data-checkout-step]'));
    const registry = new MotionRegistry();
    registry.add(animateMotion(targets, {
      opacity: [0, 1],
      translateY: [14, 0],
      duration: motionTokens.standard,
      delay: stagger(55),
      ease: motionEasings.out,
    }));
    return () => registry.clear();
  }, [reducedMotion]);

  useEffect(() => {
    const direction = fulfillment === 'delivery' ? 1 : -1;
    const changed = previousFulfillmentRef.current !== fulfillment;
    previousFulfillmentRef.current = fulfillment;
    if (reducedMotion || !pageRef.current) return;
    const selected = pageRef.current.querySelector<HTMLElement>(`[data-fulfillment="${fulfillment}"]`);
    if (!selected) return;
    const registry = new MotionRegistry();
    registry.add(animateMotion(selected, {
      translateX: [changed ? direction * 7 : 0, 0],
      scale: [0.985, 1],
      duration: motionTokens.micro,
      ease: motionEasings.out,
    }));
    return () => registry.clear();
  }, [fulfillment, reducedMotion]);

  useEffect(() => {
    if (reducedMotion || !pageRef.current) return;
    const selected = pageRef.current.querySelector<HTMLElement>(`[data-payment="${payment}"]`);
    if (!selected) return;
    const registry = new MotionRegistry();
    registry.add(animateMotion(selected, {
      translateX: [6, 0],
      scale: [0.99, 1],
      duration: motionTokens.micro,
      ease: motionEasings.out,
    }));
    return () => registry.clear();
  }, [payment, reducedMotion]);

  useEffect(() => {
    if (reducedMotion || !totalRef.current) return;
    const registry = new MotionRegistry();
    registry.add(animateMotion(totalRef.current, {
      opacity: [0.58, 1],
      translateY: [5, 0],
      duration: motionTokens.micro,
      ease: motionEasings.out,
    }));
    return () => registry.clear();
  }, [reducedMotion, totals.totalCents]);

  useEffect(() => {
    const target = couponFeedbackRef.current;
    if (!couponMessage || reducedMotion || !target) return;
    const registry = new MotionRegistry();
    registry.add(animateMotion(target, {
      opacity: [0.35, 1],
      translateY: [5, 0],
      duration: motionTokens.micro,
      ease: motionEasings.out,
    }));
    return () => registry.clear();
  }, [couponMessage, reducedMotion]);

  useEffect(() => {
    if (!feedbackVersion) return;
    if (nameInvalid) nameRef.current?.focus();
    else if (phoneInvalid) phoneRef.current?.focus();
    else errorRef.current?.focus();
    if (reducedMotion) return;
    const targets = [
      errorRef.current,
      ...Array.from(pageRef.current?.querySelectorAll<HTMLElement>('[aria-invalid="true"]') ?? []),
    ].filter((target): target is HTMLElement => Boolean(target));
    const registry = new MotionRegistry();
    registry.add(animateMotion(targets, {
      opacity: [0.55, 1],
      translateY: [5, 0],
      duration: motionTokens.micro,
      ease: motionEasings.out,
    }));
    return () => registry.clear();
  }, [feedbackVersion, nameInvalid, phoneInvalid, reducedMotion]);

  const finish = () => {
    setAttempted(true);
    if (status === 'closed' && !demoMode) {
      setClosed(true);
      return;
    }
    if (incomplete || below) {
      setError(incomplete ? 'Complete o perfil fictício da demonstração.' : 'O pedido está abaixo do mínimo demonstrativo.');
      setFeedbackVersion((version) => version + 1);
      return;
    }
    if (busyRef.current) return;
    busyRef.current = true;
    setBusy(true);
    setError('');
    timerRef.current = window.setTimeout(() => {
      setLastOrder({
        id: 'LUNARE-DEMO-024',
        items: [...cart],
        fulfillment,
        paymentMethod: payment,
        ...totals,
        createdAt: new Date(0).toISOString(),
        demoOnly: true,
      });
      clearCart();
      navigate('/pedido-demo/sucesso');
    }, 700);
  };

  if (!cart.length) return <div className={`${styles.empty} checkout-empty`}>
    <h1>Carrinho vazio</h1>
    <p>Adicione itens ao cardápio para iniciar a demonstração.</p>
    <Link className="button button-primary" to="/cardapio">Voltar ao cardápio</Link>
  </div>;

  return <div ref={pageRef} className={`${styles.page} checkout-page`} aria-busy={busy}>
    <Link className={styles.back} to="/cardapio"><ArrowLeft aria-hidden="true" /> Cardápio</Link>
    <header>
      <span>Revisão · somente demonstração</span>
      <h1>Revise sua experiência</h1>
      <p>Use apenas os dados fictícios já preenchidos. Não insira informações pessoais reais.</p>
    </header>
    <div className={styles.grid}>
      <div className={styles.main}>
        <section aria-labelledby="fulfillment-title" data-checkout-step>
          <h2 id="fulfillment-title">Modalidade</h2>
          <div className={styles.choice} role="group" aria-labelledby="fulfillment-title">
            <button data-fulfillment="pickup" className={fulfillment === 'pickup' ? styles.selected : ''} type="button" aria-pressed={fulfillment === 'pickup'} onClick={() => setFulfillment('pickup')}>
              <Store aria-hidden="true" /><span><b>Retirada</b><small>Sem taxa demonstrativa</small></span>{fulfillment === 'pickup' && <Check aria-hidden="true" />}
            </button>
            <button data-fulfillment="delivery" className={fulfillment === 'delivery' ? styles.selected : ''} type="button" aria-pressed={fulfillment === 'delivery'} onClick={() => setFulfillment('delivery')}>
              <MapPin aria-hidden="true" /><span><b>Entrega</b><small>Taxa demo de {formatCurrency(restaurant.demoDeliveryFeeCents)}</small></span>{fulfillment === 'delivery' && <Check aria-hidden="true" />}
            </button>
          </div>
        </section>

        <section aria-labelledby="profile-title" data-checkout-step>
          <h2 id="profile-title">Perfil fictício</h2>
          <div className={styles.fields}>
            <label>Nome da demonstração
              <input ref={nameRef} autoComplete="off" value={name} required aria-invalid={attempted && nameInvalid} aria-describedby={attempted && nameInvalid ? 'demo-name-error' : undefined} onChange={(event) => setName(event.target.value)} />
              {attempted && nameInvalid && <small id="demo-name-error" className="field-error">Informe um nome fictício.</small>}
            </label>
            <label>Telefone fictício
              <input ref={phoneRef} autoComplete="off" value={phone} required aria-invalid={attempted && phoneInvalid} aria-describedby={attempted && phoneInvalid ? 'demo-phone-error' : undefined} onChange={(event) => setPhone(event.target.value)} />
              {attempted && phoneInvalid && <small id="demo-phone-error" className="field-error">Informe o telefone fictício.</small>}
            </label>
          </div>
          <p className={styles.warning}><LockKeyhole aria-hidden="true" /> Esses campos não são persistidos nem enviados.</p>
        </section>

        <section aria-labelledby="payment-title" data-checkout-step>
          <h2 id="payment-title">Pagamento visual</h2>
          <div className={styles.payments} role="radiogroup" aria-labelledby="payment-title">
            {([
              ['demo-pix', 'Pix demonstrativo', WalletCards],
              ['demo-card-on-delivery', 'Cartão na entrega — demo', CreditCard],
              ['demo-cash', 'Dinheiro — demo', WalletCards],
            ] as const).map(([id, label, Icon]) => <label key={id} data-payment={id} className={payment === id ? styles.paymentSelected : ''}>
              <input type="radio" name="payment" checked={payment === id} onChange={() => setPayment(id)} />
              <Icon aria-hidden="true" /><span>{label}</span>
            </label>)}
          </div>
          <p className={styles.warning}>Nenhum número de cartão, CPF ou chave Pix será solicitado.</p>
        </section>

        <section aria-labelledby="coupon-title" data-checkout-step>
          <h2 id="coupon-title">Cupom demonstrativo</h2>
          <div className={`${styles.coupon} checkout-coupon`}>
            <TicketPercent aria-hidden="true" />
            <input value={code} aria-label="Código do cupom demonstrativo" aria-describedby={couponMessage ? 'coupon-message' : undefined} onChange={(event) => setCode(event.target.value)} placeholder="Digite LUNARE10" />
            <button type="button" onClick={() => applyCoupon(code)}>Aplicar</button>
          </div>
          {couponMessage && <p ref={couponFeedbackRef} id="coupon-message" role="status" className={coupon ? styles.success : styles.error}>
            {couponMessage}{coupon && <button type="button" onClick={removeCoupon}>Remover</button>}
          </p>}
        </section>
      </div>

      <aside className={`${styles.summary} checkout-summary`} aria-label="Resumo do pedido demonstrativo" data-checkout-step>
        <div><span>Resumo</span><small>{cart.length} configurações</small></div>
        {cart.map((item) => {
          const product = findProduct(item.productId);
          return product ? <p key={item.key}><span>{item.quantity}× {product.name}</span><b>{formatCurrency(orderTotals([item], 'pickup', null).subtotalCents)}</b></p> : null;
        })}
        <dl>
          <div><dt>Subtotal</dt><dd>{formatCurrency(totals.subtotalCents)}</dd></div>
          <div><dt>Desconto</dt><dd>− {formatCurrency(totals.discountCents)}</dd></div>
          <div><dt>Taxa demo</dt><dd>{formatCurrency(totals.feeCents)}</dd></div>
        </dl>
        <div className={styles.total}><span>Total demonstrativo</span><strong ref={totalRef}>{formatCurrency(totals.totalCents)}</strong></div>
        {below && <p className={styles.error}>Faltam {formatCurrency(restaurant.minimumOrderCents - totals.subtotalCents)} para o mínimo.</p>}
        {error && <p ref={errorRef} id="checkout-error" className={styles.error} role="alert" tabIndex={-1}>{error}</p>}
        <button className="button button-primary" type="button" onClick={finish} disabled={busy} aria-describedby={error ? 'checkout-error' : undefined}>
          {busy ? 'Concluindo demonstração…' : 'Concluir demonstração'}
        </button>
        <small>Nenhum pedido ou pagamento será processado.</small>
      </aside>
    </div>
  </div>;
}
