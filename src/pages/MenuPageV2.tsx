import { Clock3, Star } from 'lucide-react';
import { MenuCatalogV2 } from '../components/MenuCatalogV2';
import { ResponsiveImage } from '../components/ui/ResponsiveImage';
import { restaurant } from '../data/restaurant';
import { useOrderStore } from '../store/useOrderStore';
import styles from './MenuPage.module.css';

export function MenuPageV2() {
  const storeStatus = useOrderStore((state) => state.storeStatus);

  return (
    <div className={styles.page}>
      <section className={styles.intro} aria-labelledby="menu-page-title">
        <div className={styles.heroCopy}>
          <span>Lunare Restaurante</span>
          <h1 id="menu-page-title">Alta gastronomia<br />em outra órbita.</h1>
          <p>Culinária japonesa contemporânea, cuidado em cada detalhe e uma experiência criada para desacelerar.</p>
          <div className={styles.metrics} aria-label="Informações rápidas da loja">
            <div><Star aria-hidden="true" /><span><b>Avaliação</b><small>A confirmar</small></span></div>
            <div><Clock3 aria-hidden="true" /><span><b>Previsão</b><small>A confirmar</small></span></div>
            <div className={storeStatus === 'open' ? styles.open : styles.closed}>
              <i aria-hidden="true" />
              <span><b>{storeStatus === 'open' ? 'Aberto' : 'Fechado'}</b><small>{storeStatus === 'open' ? 'Modo demonstração' : 'Confira os horários'}</small></span>
            </div>
          </div>
        </div>
        <div className={styles.heroMedia}>
          <ResponsiveImage
            src="/media/combinado-caixas.jpg"
            alt="Seleção de peças japonesas em caixas da Lunare"
            sizes="(max-width: 800px) 100vw, 58vw"
            loading="eager"
          />
          <div className={styles.heroSignature} aria-hidden="true">
            <span>Sabores que nos conectam</span>
            <b>LUNARE</b>
          </div>
        </div>
        <small className={styles.validation}>Avaliação e previsão aguardam validação do estabelecimento.</small>
      </section>
      <MenuCatalogV2 />
      <span className="sr-only">Localidade: {restaurant.location}</span>
    </div>
  );
}
