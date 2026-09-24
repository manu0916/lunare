import { Component, type ReactNode } from 'react';

interface ErrorBoundaryProps { children: ReactNode }
interface ErrorBoundaryState { failed: boolean }

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { failed: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { failed: true };
  }

  componentDidCatch() {
    // A future observability provider can be connected here without exposing user data.
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <main className="fatal-error" id="conteudo">
        <img src="/media/lunare-emblema.jpg" alt="" width="150" height="150" />
        <span>Interrupção local</span>
        <h1>Não foi possível concluir esta órbita.</h1>
        <p>O protótipo continua sem enviar qualquer informação. Recarregue para tentar novamente.</p>
        <button className="button button-primary" type="button" onClick={() => window.location.reload()}>Recarregar protótipo</button>
      </main>
    );
  }
}
