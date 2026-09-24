import { MoonStar } from 'lucide-react';
import { Link } from 'react-router-dom';
import styles from './NotFoundPage.module.css';
export function NotFoundPage(){return <div className={`${styles.page} not-found-page`}><MoonStar aria-hidden="true"/><span>Erro 404</span><h1>Esta órbita não foi encontrada.</h1><p>O caminho pode ter mudado, mas o cardápio continua logo ali.</p><div><Link className="button button-primary" to="/">Voltar à Home</Link><Link className="button button-ghost" to="/cardapio">Ver cardápio</Link></div></div>}
