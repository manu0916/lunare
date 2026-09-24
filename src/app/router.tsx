import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

const HomePage = lazy(() => import('../pages/HomePageV2').then((module) => ({ default: module.HomePageV2 })));
const MenuPage = lazy(() => import('../pages/MenuPageV2').then((module) => ({ default: module.MenuPageV2 })));
const CheckoutPage = lazy(() => import('../pages/CheckoutPageV2').then((module) => ({ default: module.CheckoutPageV2 })));
const SuccessPage = lazy(() => import('../pages/SuccessPageV2').then((module) => ({ default: module.SuccessPageV2 })));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage').then((module) => ({ default: module.NotFoundPage })));

function RouteFallback() {
  return <div className="route-fallback" role="status" aria-live="polite"><span aria-hidden="true" />Carregando experiência…</div>;
}

export function AppRouter() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/cardapio" element={<MenuPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/pedido-demo/sucesso" element={<SuccessPage />} />
        <Route path="/concluido" element={<Navigate to="/pedido-demo/sucesso" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
