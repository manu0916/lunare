import type { StateStorage } from 'zustand/middleware';
import { demoCoupon } from '../data/demoCoupons';
import { findProduct } from '../data/menu';
import type { CartItem, CartItemConfiguration, DemoCoupon, FulfillmentMode } from '../types';

export const ORDER_STORAGE_KEY = 'lunare-demo';
export const ORDER_STORAGE_VERSION = 2;

export interface PersistedOrderState {
  cart: CartItem[];
  demoMode: boolean;
  fulfillment: FulfillmentMode;
  coupon: DemoCoupon | null;
}

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null;

const validConfiguration = (value: unknown, productId: string): value is CartItemConfiguration => {
  if (!isRecord(value) || !(value.variantId === null || typeof value.variantId === 'string') || !Array.isArray(value.optionIds) || !value.optionIds.every((id) => typeof id === 'string') || typeof value.note !== 'string' || value.note.length > 255) return false;
  const product = findProduct(productId);
  if (!product?.available) return false;
  if (product.variants.length > 0) {
    if (value.variantId === null || !product.variants.some((variant) => variant.id === value.variantId && variant.available)) return false;
  } else if (value.variantId !== null) return false;
  const optionIds = value.optionIds;
  if (new Set(optionIds).size !== optionIds.length) return false;
  const knownOptions = new Set(product.optionGroups.flatMap((group) => group.options.map((option) => option.id)));
  if (!optionIds.every((id) => knownOptions.has(id))) return false;
  return product.optionGroups.every((group) => {
    const selected = group.options.filter((option) => optionIds.includes(option.id));
    return selected.length >= group.min && selected.length <= group.max && selected.every((option) => option.available);
  });
};

const validCartItem = (value: unknown): value is CartItem => {
  if (!isRecord(value) || typeof value.key !== 'string' || typeof value.productId !== 'string' || !Number.isInteger(value.quantity) || (value.quantity as number) < 1 || (value.quantity as number) > 99) return false;
  return validConfiguration(value.configuration, value.productId);
};

export const sanitizePersistedOrder = (value: unknown): PersistedOrderState => {
  const source = isRecord(value) ? value : {};
  const fulfillment = source.fulfillment === 'delivery' ? 'delivery' : 'pickup';
  const coupon = isRecord(source.coupon) && source.coupon.code === demoCoupon.code ? demoCoupon : null;
  return {
    cart: Array.isArray(source.cart) ? source.cart.filter(validCartItem) : [],
    demoMode: source.demoMode === true,
    fulfillment,
    coupon,
  };
};

export const safeLocalStorage: StateStorage = {
  getItem: (name) => {
    try {
      const value = window.localStorage.getItem(name);
      if (value) JSON.parse(value);
      return value;
    } catch {
      try { window.localStorage.removeItem(name); } catch { /* Storage can be disabled by the browser. */ }
      return null;
    }
  },
  setItem: (name, value) => {
    try { window.localStorage.setItem(name, value); } catch { /* The app stays usable without persistence. */ }
  },
  removeItem: (name) => {
    try { window.localStorage.removeItem(name); } catch { /* The app stays usable without persistence. */ }
  },
};
