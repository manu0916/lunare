import { demoCoupon } from '../data/demoCoupons';
import { findProduct } from '../data/menu';
import { restaurant } from '../data/restaurant';
import type { CartItem, CartItemConfiguration, DemoCoupon, FulfillmentMode, Product } from '../types';

export const configurationKey = (productId: string, configuration: CartItemConfiguration) =>
  `${productId}::${configuration.variantId ?? 'base'}::${[...configuration.optionIds].sort().join(',')}::${configuration.note.trim()}`;

export const configuredUnitPrice = (product: Product, configuration: CartItemConfiguration) => {
  const variant = product.variants.find((item) => item.id === configuration.variantId);
  const base = variant?.priceCents ?? product.priceCents;
  const extras = product.optionGroups
    .flatMap((group) => group.options)
    .filter((option) => configuration.optionIds.includes(option.id))
    .reduce((sum, option) => sum + option.priceCents, 0);
  return base + extras;
};

export const cartSubtotal = (items: CartItem[]) =>
  items.reduce((sum, item) => {
    const product = findProduct(item.productId);
    return product ? sum + configuredUnitPrice(product, item.configuration) * item.quantity : sum;
  }, 0);

export const couponDiscount = (subtotalCents: number, coupon: DemoCoupon | null) =>
  coupon?.code === demoCoupon.code ? Math.round((subtotalCents * coupon.discountPercent) / 100) : 0;

export const demoFee = (mode: FulfillmentMode) => (mode === 'delivery' ? restaurant.demoDeliveryFeeCents : 0);

export const meetsMinimumOrder = (subtotalCents: number, minimumCents: number) => subtotalCents >= minimumCents;

export const orderTotals = (items: CartItem[], mode: FulfillmentMode, coupon: DemoCoupon | null) => {
  const subtotalCents = cartSubtotal(items);
  const discountCents = couponDiscount(subtotalCents, coupon);
  const feeCents = demoFee(mode);
  return {
    subtotalCents,
    discountCents,
    feeCents,
    totalCents: Math.max(0, subtotalCents - discountCents + feeCents),
  };
};
