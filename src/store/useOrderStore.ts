import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { demoCoupon } from '../data/demoCoupons';
import { restaurant } from '../data/restaurant';
import { ORDER_STORAGE_KEY, ORDER_STORAGE_VERSION, safeLocalStorage, sanitizePersistedOrder } from '../lib/storage';
import { configurationKey } from '../utils/order';
import type { CartItem, DemoCoupon, DemoOrder, FulfillmentMode, StoreStatus } from '../types';

interface OrderState {
  cart:CartItem[]; demoMode:boolean; storeStatus:StoreStatus; cartOpen:boolean; infoOpen:boolean; closedOpen:boolean; utilityPanel:string|null;
  selectedProductId:string|null; editingItemKey:string|null; fulfillment:FulfillmentMode; coupon:DemoCoupon|null; couponMessage:string; lastOrder:DemoOrder|null; reducedMotion:boolean; liveMessage:string;
  addItem:(line:Omit<CartItem,'key'>)=>void; removeItem:(key:string)=>void; updateQuantity:(key:string,quantity:number)=>void; clearCart:()=>void;
  setDemoMode:(active:boolean)=>void; setStoreStatus:(status:StoreStatus)=>void; setCartOpen:(open:boolean)=>void; setInfoOpen:(open:boolean)=>void;
  setClosedOpen:(open:boolean)=>void; setUtilityPanel:(panel:string|null)=>void; selectProduct:(id:string|null)=>void; editItem:(key:string)=>void; setFulfillment:(mode:FulfillmentMode)=>void;
  applyCoupon:(code:string)=>void; removeCoupon:()=>void; setLastOrder:(order:DemoOrder|null)=>void; setReducedMotion:(active:boolean)=>void; populateSample:()=>void; resetDemo:()=>void;
}

const baseConfiguration={variantId:null,optionIds:[],note:''};
export const useOrderStore=create<OrderState>()(persist((set)=>({
  cart:[],demoMode:false,storeStatus:restaurant.defaultStatus,cartOpen:false,infoOpen:false,closedOpen:false,utilityPanel:null,selectedProductId:null,editingItemKey:null,
  fulfillment:'pickup',coupon:null,couponMessage:'',lastOrder:null,reducedMotion:false,liveMessage:'',
  addItem:(line)=>set((state)=>{const key=configurationKey(line.productId,line.configuration);const existing=state.cart.find((item)=>item.key===key);return{cart:existing?state.cart.map((item)=>item.key===key?{...item,quantity:item.quantity+line.quantity}:item):[...state.cart,{...line,key}],liveMessage:'Item adicionado ao carrinho de demonstração.'}}),
  removeItem:(key)=>set((state)=>({cart:state.cart.filter((item)=>item.key!==key),liveMessage:'Item removido.'})),
  updateQuantity:(key,quantity)=>set((state)=>quantity<=0?{cart:state.cart.filter((item)=>item.key!==key),liveMessage:'Item removido.'}:{cart:state.cart.map((item)=>item.key===key?{...item,quantity:Math.min(99,quantity)}:item),liveMessage:`Quantidade atualizada para ${Math.min(99,quantity)}.`}),
  clearCart:()=>set({cart:[],coupon:null,couponMessage:'',liveMessage:'Carrinho limpo.'}),setDemoMode:(demoMode)=>set({demoMode}),setStoreStatus:(storeStatus)=>set({storeStatus,liveMessage:storeStatus==='open'?'Loja demonstrativa aberta.':'Loja demonstrativa fechada.'}),
  setCartOpen:(cartOpen)=>set({cartOpen}),setInfoOpen:(infoOpen)=>set({infoOpen}),setClosedOpen:(closedOpen)=>set({closedOpen}),setUtilityPanel:(utilityPanel)=>set({utilityPanel}),selectProduct:(selectedProductId)=>set({selectedProductId,editingItemKey:null}),editItem:(editingItemKey)=>set((state)=>({editingItemKey,selectedProductId:state.cart.find((item)=>item.key===editingItemKey)?.productId??null,cartOpen:false})),
  setFulfillment:(fulfillment)=>set({fulfillment}),applyCoupon:(code)=>set(code.trim().toUpperCase()===demoCoupon.code?{coupon:demoCoupon,couponMessage:'Cupom demonstrativo aplicado.'}:{coupon:null,couponMessage:'Cupom inválido. Tente LUNARE10.'}),
  removeCoupon:()=>set({coupon:null,couponMessage:'Cupom removido.'}),setLastOrder:(lastOrder)=>set({lastOrder}),setReducedMotion:(reducedMotion)=>set({reducedMotion}),
  populateSample:()=>set({demoMode:true,cart:[{key:configurationKey('saturno-60',baseConfiguration),productId:'saturno-60',quantity:1,configuration:baseConfiguration},{key:configurationKey('agua',baseConfiguration),productId:'agua',quantity:2,configuration:baseConfiguration}],liveMessage:'Carrinho de exemplo preenchido.'}),
  resetDemo:()=>set({cart:[],demoMode:false,storeStatus:restaurant.defaultStatus,cartOpen:false,infoOpen:false,closedOpen:false,utilityPanel:null,selectedProductId:null,editingItemKey:null,fulfillment:'pickup',coupon:null,couponMessage:'',lastOrder:null,reducedMotion:false,liveMessage:'Demonstração reiniciada.'}),
}),{
  name:ORDER_STORAGE_KEY,
  version:ORDER_STORAGE_VERSION,
  storage:createJSONStorage(()=>safeLocalStorage),
  partialize:(state)=>({cart:state.cart,demoMode:state.demoMode,fulfillment:state.fulfillment,coupon:state.coupon}),
  migrate:(persistedState)=>sanitizePersistedOrder(persistedState),
  merge:(persistedState,currentState)=>({...currentState,...sanitizePersistedOrder(persistedState)}),
}));
