import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { AppRouter } from './app/router';
import { HeaderV2 } from './components/HeaderV2';
import { BottomNavV2 } from './components/BottomNavV2';
import { CartDrawerV2, ClosedDialog, InfoDialog, ProductDialog, UtilityDialog } from './components/OverlaysV2';
import { DemoPanel } from './components/DemoPanel';
import { Seo } from './components/Seo';
import { useOrderStore } from './store/useOrderStore';
import { findProduct } from './data/menu';
import { prefersReducedMotion } from './lib/motion';

function RouteSync(){const location=useLocation();const selectProduct=useOrderStore((state)=>state.selectProduct);useEffect(()=>{const id=new URLSearchParams(location.search).get('produto');selectProduct(id&&findProduct(id)?id:null)},[location.search,selectProduct]);useEffect(()=>{if(location.hash)window.setTimeout(()=>document.querySelector(location.hash)?.scrollIntoView({behavior:prefersReducedMotion()?'auto':'smooth'}),0);else window.scrollTo({top:0,behavior:'instant'})},[location.pathname,location.hash]);return null}
export default function AppV2(){const live=useOrderStore((state)=>state.liveMessage);return <div className="app-shell"><Seo/><a className="skip-link" href="#conteudo">Pular para o conteúdo</a><div className="prototype-bar">Protótipo conceitual — nenhum pedido será enviado.</div><HeaderV2/><RouteSync/><main id="conteudo" tabIndex={-1}><AppRouter/></main><BottomNavV2/><ProductDialog/><CartDrawerV2/><ClosedDialog/><InfoDialog/><UtilityDialog/><DemoPanel/><div className="sr-only" role="status" aria-live="polite" aria-atomic="true">{live}</div></div>}
