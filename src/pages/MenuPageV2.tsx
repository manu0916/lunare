import { MenuCatalogV2 } from '../components/MenuCatalogV2';
import styles from './MenuPage.module.css';
export function MenuPageV2(){return <div className={styles.page}><div className={styles.intro}><span>Cardápio interativo</span><h1>Escolha o seu<br/>momento Lunare.</h1><p>Preços, disponibilidade, descrições e alergênicos são provisórios e precisam de validação do estabelecimento.</p></div><MenuCatalogV2/></div>}
