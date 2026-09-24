import { ChevronDown, ChevronUp, Home, RotateCcw, ShoppingBag, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useOrderStore } from '../store/useOrderStore';
import styles from './DemoPanel.module.css';
import './DemoPanel.a11y.css';

export function DemoPanel(){
  const location=useLocation();const navigate=useNavigate();const[collapsed,setCollapsed]=useState(false);const visible=new URLSearchParams(location.search).get('demo')==='1';
  const status=useOrderStore((state)=>state.storeStatus);const setStatus=useOrderStore((state)=>state.setStoreStatus);const populate=useOrderStore((state)=>state.populateSample);const reset=useOrderStore((state)=>state.resetDemo);const setCartOpen=useOrderStore((state)=>state.setCartOpen);const reduced=useOrderStore((state)=>state.reducedMotion);const setReduced=useOrderStore((state)=>state.setReducedMotion);
  useEffect(()=>{document.documentElement.dataset.reducedMotion=String(reduced)},[reduced]);
  if(!visible)return null;const go=(path:string)=>navigate(`${path}${path.includes('?')?'&':'?'}demo=1`);
  return <aside className={`${styles.panel} ${collapsed?styles.collapsed:''} demo-panel-root`} aria-label="Painel do modo apresentação"><button className={`${styles.collapse} demo-panel-trigger`} type="button" onClick={()=>setCollapsed((value)=>!value)} aria-expanded={!collapsed}>{collapsed?<ChevronUp/>:<ChevronDown/>}<span>Modo apresentação</span></button>{!collapsed&&<div className={styles.body}><label><span>Loja demonstrativa</span><select value={status} onChange={(event)=>setStatus(event.target.value as 'open'|'closed')}><option value="closed">Fechada</option><option value="open">Aberta</option></select></label><button className="demo-panel-control" type="button" onClick={populate}><Sparkles/> Preencher carrinho</button><button className="demo-panel-control" type="button" onClick={reset}>Limpar demonstração</button><button className="demo-panel-control" type="button" onClick={()=>setReduced(!reduced)} aria-pressed={reduced}>Motion reduzido: {reduced?'sim':'não'}</button><div className={`${styles.links} demo-panel-links`}><button type="button" onClick={()=>go('/')}><Home/> Home</button><button type="button" onClick={()=>go('/cardapio')}>Cardápio</button><button type="button" onClick={()=>setCartOpen(true)}><ShoppingBag/> Carrinho</button><button type="button" onClick={()=>go('/pedido-demo/sucesso')}>Sucesso</button></div><button className="demo-panel-control" type="button" onClick={()=>{reset();try{sessionStorage.removeItem('lunare:brand-intro-seen')}catch{/* O walkthrough continua sem storage. */}window.location.assign('/?demo=1')}}><RotateCcw/> Reiniciar walkthrough</button></div>}</aside>;
}
