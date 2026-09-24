import { describe, expect, it } from 'vitest';
import { findProduct } from '../data/menu';
import { demoCoupon } from '../data/demoCoupons';
import { restaurant } from '../data/restaurant';
import { formatCurrency } from '../lib/currency';
import {
  cartSubtotal,
  configurationKey,
  configuredUnitPrice,
  couponDiscount,
  demoFee,
  meetsMinimumOrder,
  orderTotals,
} from '../lib/pricing';
import type { CartItem, CartItemConfiguration } from '../types';

const baseConfiguration: CartItemConfiguration = {
  variantId: null,
  optionIds: [],
  note: '',
};

const item = (
  productId: string,
  quantity: number,
  configuration: CartItemConfiguration = baseConfiguration,
): CartItem => ({
  key: configurationKey(productId, configuration),
  productId,
  quantity,
  configuration,
});

describe('formatação monetária', () => {
  it('converte centavos para BRL sem perder os centavos', () => {
    expect(formatCurrency(123456)).toMatch(/^R\$\s?1\.234,56$/);
    expect(formatCurrency(0)).toMatch(/^R\$\s?0,00$/);
  });
});

describe('preço configurado', () => {
  it('usa o preço da variante selecionada', () => {
    const product = findProduct('hosso-philadelphia');
    expect(product).toBeDefined();

    expect(
      configuredUnitPrice(product!, {
        variantId: '8-pecas',
        optionIds: [],
        note: '',
      }),
    ).toBe(6800);
  });

  it('soma adicionais à variante sem alterar o produto original', () => {
    const product = findProduct('hosso-philadelphia');
    expect(product).toBeDefined();
    const originalPrice = product!.priceCents;

    expect(
      configuredUnitPrice(product!, {
        variantId: '8-pecas',
        optionIds: ['cream-cheese', 'tare'],
        note: '',
      }),
    ).toBe(7200);
    expect(product!.priceCents).toBe(originalPrice);
  });

  it('mantém a configuração canônica apesar da ordem dos adicionais', () => {
    const first = configurationKey('temaki-philadelphia', {
      variantId: null,
      optionIds: ['tare', 'cream-cheese'],
      note: ' sem cebolinha ',
    });
    const second = configurationKey('temaki-philadelphia', {
      variantId: null,
      optionIds: ['cream-cheese', 'tare'],
      note: 'sem cebolinha',
    });

    expect(first).toBe(second);
  });
});

describe('totais puros do pedido demonstrativo', () => {
  it('calcula subtotal multiplicando preço configurado e quantidade', () => {
    const configuration: CartItemConfiguration = {
      variantId: '8-pecas',
      optionIds: ['cream-cheese'],
      note: '',
    };

    expect(cartSubtotal([item('hosso-philadelphia', 2, configuration), item('agua', 1)])).toBe(14800);
  });

  it('ignora com segurança uma referência de produto inexistente', () => {
    expect(cartSubtotal([item('produto-removido', 3)])).toBe(0);
  });

  it('arredonda e aplica somente o desconto demonstrativo válido', () => {
    expect(couponDiscount(1005, demoCoupon)).toBe(101);
    expect(couponDiscount(1005, null)).toBe(0);
  });

  it('cobra taxa somente na entrega', () => {
    expect(demoFee('delivery')).toBe(590);
    expect(demoFee('pickup')).toBe(0);
  });

  it('calcula subtotal, desconto, taxa e total', () => {
    expect(orderTotals([item('agua', 2)], 'delivery', demoCoupon)).toEqual({
      subtotalCents: 1200,
      discountCents: 120,
      feeCents: 590,
      totalCents: 1670,
    });
  });

  it('não cobra taxa nem desconto na retirada sem cupom', () => {
    expect(orderTotals([item('agua', 2)], 'pickup', null)).toEqual({
      subtotalCents: 1200,
      discountCents: 0,
      feeCents: 0,
      totalCents: 1200,
    });
  });

  it('permite verificar o mínimo usando o subtotal, antes de desconto e taxa', () => {
    const belowMinimum = orderTotals([item('agua', 1)], 'delivery', demoCoupon);
    const atMinimum = orderTotals([item('agua', 2)], 'pickup', null);

    expect(meetsMinimumOrder(belowMinimum.subtotalCents, restaurant.minimumOrderCents)).toBe(false);
    expect(meetsMinimumOrder(atMinimum.subtotalCents, restaurant.minimumOrderCents)).toBe(true);
  });
});
