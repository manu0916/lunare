export type CategoryId = 'entradas' | 'combinados' | 'hossomaki' | 'uramaki' | 'hot-roll' | 'jyo' | 'sashimi' | 'niguiri' | 'temaki' | 'bebidas';
export type StoreStatus = 'open' | 'closed';
export type FulfillmentMode = 'delivery' | 'pickup';
export type PaymentMethod = 'demo-pix' | 'demo-card-on-delivery' | 'demo-cash';
export interface Category { id: CategoryId; slug: string; name: string; description: string; image: string; alt: string }
export interface ProductVariant { id: string; name: string; priceCents: number; available: boolean }
export interface Option { id: string; name: string; priceCents: number; available: boolean }
export interface OptionGroup { id: string; name: string; required: boolean; min: number; max: number; options: Option[] }
export interface Product {
  id: string; slug: string; name: string; description: string; priceCents: number; categoryId: CategoryId;
  image: string; alt: string; featured: boolean; available: boolean; tags: string[]; allergenNotes: string;
  needsOwnerValidation: boolean; variants: ProductVariant[]; optionGroups: OptionGroup[];
}
export interface CartItemConfiguration { variantId: string | null; optionIds: string[]; note: string }
export interface CartItem { key: string; productId: string; quantity: number; configuration: CartItemConfiguration }
export interface DemoCoupon { code: 'LUNARE10'; label: string; discountPercent: number; demoOnly: true }
export interface RestaurantConfig {
  name: string; tagline: string; positioning: string; location: string; minimumOrderCents: number; demoDeliveryFeeCents: number; defaultStatus: StoreStatus;
  prototypeNotice: string; fulfillmentModes: FulfillmentMode[]; address: { value: string; needsOwnerValidation: true };
  schedule: Array<{ label: string; value: string; needsOwnerValidation: true }>;
  publicLinks: { instagram: string; menuReference: string }; contact: { label: string; href: string | null; isDemo: boolean };
}
export interface DemoOrder {
  id: string; items: CartItem[]; fulfillment: FulfillmentMode; paymentMethod: PaymentMethod; subtotalCents: number;
  discountCents: number; feeCents: number; totalCents: number; createdAt: string; demoOnly: true;
}
