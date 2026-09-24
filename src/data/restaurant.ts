import type { RestaurantConfig } from '../types';

export const restaurant: RestaurantConfig = {
  name: 'Lunare Restaurante', tagline: 'O segredo está nos detalhes!', positioning: 'Premium Japanese Food',
  location: 'Campos Gerais — MG', minimumOrderCents: 1000, demoDeliveryFeeCents: 590, defaultStatus: 'closed',
  prototypeNotice: 'Protótipo conceitual — nenhum pedido será enviado.', fulfillmentModes: ['delivery','pickup'],
  address: { value: 'Rua Dom Inocêncio Engelke, 691 — Centro', needsOwnerValidation: true },
  schedule: [
    { label: 'Segunda a sábado', value: '18h às 22h', needsOwnerValidation: true },
    { label: 'Domingo', value: 'Fechado', needsOwnerValidation: true },
  ],
  publicLinks: { instagram: 'https://www.instagram.com/lunaresushi', menuReference: 'https://pedido.takeat.app/lunare' },
  contact: { label: 'Contato — demonstração', href: null, isDemo: true },
};
