import { describe, expect, it } from 'vitest';
import { demoCoupon } from '../data/demoCoupons';
import {
  ORDER_STORAGE_KEY,
  ORDER_STORAGE_VERSION,
  safeLocalStorage,
  sanitizePersistedOrder,
} from '../lib/storage';
import { configurationKey } from '../lib/pricing';

const waterConfiguration = { variantId: null, optionIds: [], note: '' };

describe('persistência segura do pedido', () => {
  it('mantém somente itens e preferências válidos', () => {
    const validWater = {
      key: configurationKey('agua', waterConfiguration),
      productId: 'agua',
      quantity: 2,
      configuration: waterConfiguration,
    };

    expect(
      sanitizePersistedOrder({
        cart: [
          validWater,
          { ...validWater, quantity: 0 },
          { ...validWater, productId: 'produto-inexistente' },
          { ...validWater, configuration: { ...waterConfiguration, variantId: 'inventada' } },
          { ...validWater, configuration: { ...waterConfiguration, note: 'x'.repeat(256) } },
          { ...validWater, productId: 'hosso-tartare-lemon' },
        ],
        demoMode: true,
        fulfillment: 'delivery',
        coupon: { code: 'LUNARE10', discountPercent: 99 },
        dadosPessoais: { nome: 'não deve persistir' },
      }),
    ).toEqual({
      cart: [validWater],
      demoMode: true,
      fulfillment: 'delivery',
      coupon: demoCoupon,
    });
  });

  it('recupera defaults seguros para payload desconhecido', () => {
    expect(sanitizePersistedOrder({ fulfillment: 'teletransporte', coupon: { code: 'INVALIDO' } })).toEqual({
      cart: [],
      demoMode: false,
      fulfillment: 'pickup',
      coupon: null,
    });
    expect(sanitizePersistedOrder(null)).toEqual({
      cart: [],
      demoMode: false,
      fulfillment: 'pickup',
      coupon: null,
    });
  });

  it('expõe chave e versão explícitas para migração', () => {
    expect(ORDER_STORAGE_KEY).toBe('lunare-demo');
    expect(ORDER_STORAGE_VERSION).toBeGreaterThanOrEqual(1);
  });

  it('remove JSON corrompido sem propagar exceção', () => {
    localStorage.setItem(ORDER_STORAGE_KEY, '{quebrado');
    expect(safeLocalStorage.getItem(ORDER_STORAGE_KEY)).toBeNull();
    expect(localStorage.getItem(ORDER_STORAGE_KEY)).toBeNull();
  });
});
