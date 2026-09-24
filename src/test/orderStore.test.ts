import { beforeEach, describe, expect, it } from 'vitest';
import { useOrderStore } from '../store/useOrderStore';

describe('useOrderStore', () => {
  beforeEach(() => useOrderStore.getState().resetDemo());
  it('agrupa o mesmo produto e configuração', () => {
    const { addItem } = useOrderStore.getState();
    const configuration = { variantId: null, optionIds: [], note: '' };
    addItem({ productId: 'saturno-60', quantity: 1, configuration });
    addItem({ productId: 'saturno-60', quantity: 2, configuration });
    expect(useOrderStore.getState().cart[0].quantity).toBe(3);
  });
  it('remove uma linha ao reduzir para zero', () => {
    useOrderStore.getState().addItem({ productId: 'saturno-60', quantity: 1, configuration: { variantId: null, optionIds: [], note: '' } });
    useOrderStore.getState().updateQuantity(useOrderStore.getState().cart[0].key, 0);
    expect(useOrderStore.getState().cart).toHaveLength(0);
  });
  it('mantém configurações diferentes em linhas separadas', () => {
    const { addItem } = useOrderStore.getState();
    addItem({ productId: 'temaki-philadelphia', quantity: 1, configuration: { variantId: null, optionIds: [], note: '' } });
    addItem({ productId: 'temaki-philadelphia', quantity: 1, configuration: { variantId: null, optionIds: ['tare'], note: '' } });
    expect(useOrderStore.getState().cart).toHaveLength(2);
  });
  it('aplica, rejeita e remove o cupom demonstrativo', () => {
    useOrderStore.getState().applyCoupon('lunare10');
    expect(useOrderStore.getState().coupon?.code).toBe('LUNARE10');
    useOrderStore.getState().applyCoupon('invalido');
    expect(useOrderStore.getState().coupon).toBeNull();
    expect(useOrderStore.getState().couponMessage).toMatch(/inválido/i);
    useOrderStore.getState().removeCoupon();
    expect(useOrderStore.getState().couponMessage).toMatch(/removido/i);
  });
  it('restaura o carrinho persistido após uma recarga simulada', async () => {
    useOrderStore.getState().addItem({ productId: 'agua', quantity: 2, configuration: { variantId: null, optionIds: [], note: '' } });
    const snapshot = localStorage.getItem('lunare-demo');
    useOrderStore.getState().resetDemo();
    if (snapshot) localStorage.setItem('lunare-demo', snapshot);
    await Promise.resolve(useOrderStore.persist.rehydrate());
    expect(useOrderStore.getState().cart[0].productId).toBe('agua');
  });
  it('descarta storage corrompido sem quebrar o estado', async () => {
    localStorage.setItem('lunare-demo', '{conteudo-corrompido');
    await expect(Promise.resolve(useOrderStore.persist.rehydrate())).resolves.toBeUndefined();
    expect(localStorage.getItem('lunare-demo')).toBeNull();
    expect(useOrderStore.getState().cart).toEqual([]);
  });
});
