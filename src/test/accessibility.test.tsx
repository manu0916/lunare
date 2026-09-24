import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';
import { CartDrawerV2, InfoDialog, ProductDialog } from '../components/OverlaysV2';
import { useOrderStore } from '../store/useOrderStore';

function ProductDialogHarness() {
  const selectProduct = useOrderStore((state) => state.selectProduct);

  return (
    <>
      <button type="button" onClick={() => selectProduct('saturno-60')}>
        Abrir ficha de teste
      </button>
      <ProductDialog />
    </>
  );
}

describe('acessibilidade dos diálogos', () => {
  beforeEach(() => {
    localStorage.clear();
    useOrderStore.getState().resetDemo();
    useOrderStore.getState().setDemoMode(true);
  });

  it('expõe nome, modalidade, foco inicial, trap, Escape e restauração de foco', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={['/cardapio']}>
        <ProductDialogHarness />
      </MemoryRouter>,
    );
    const trigger = screen.getByRole('button', { name: /abrir ficha de teste/i });

    await user.click(trigger);

    const dialog = screen.getByRole('dialog', { name: /detalhes de saturno/i });
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(document.body).toHaveStyle({ overflow: 'hidden' });

    const close = within(dialog).getByRole('button', { name: /fechar ficha/i });
    await waitFor(() => expect(close).toHaveFocus());
    await user.tab({ shift: true });
    expect(within(dialog).getByRole('button', { name: /adicionar/i })).toHaveFocus();

    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(trigger).toHaveFocus();
    expect(document.body).not.toHaveStyle({ overflow: 'hidden' });
  });

  it('fornece nomes acessíveis a todas as ações por ícone do carrinho', async () => {
    const user = userEvent.setup();
    useOrderStore.getState().addItem({
      productId: 'agua',
      quantity: 2,
      configuration: { variantId: null, optionIds: [], note: '' },
    });
    useOrderStore.getState().setCartOpen(true);
    render(
      <MemoryRouter>
        <CartDrawerV2 />
      </MemoryRouter>,
    );

    const dialog = screen.getByRole('dialog', { name: /carrinho de demonstração/i });
    expect(within(dialog).getByRole('button', { name: /fechar carrinho/i })).toBeInTheDocument();
    expect(within(dialog).getByRole('button', { name: /diminuir quantidade de água mineral/i })).toBeInTheDocument();
    expect(within(dialog).getByRole('button', { name: /aumentar quantidade de água mineral/i })).toBeInTheDocument();
    expect(within(dialog).getByRole('button', { name: /editar água mineral/i })).toBeInTheDocument();
    expect(within(dialog).getByRole('button', { name: /remover água mineral/i })).toBeInTheDocument();

    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(useOrderStore.getState().cartOpen).toBe(false);
  });

  it('permite navegar pelas abas de informações com as setas', async () => {
    const user = userEvent.setup();
    useOrderStore.getState().setInfoOpen(true);
    render(
      <MemoryRouter>
        <InfoDialog />
      </MemoryRouter>,
    );

    const dialog = screen.getByRole('dialog', { name: /informações da loja/i });
    const about = within(dialog).getByRole('tab', { name: /sobre/i });
    const hours = within(dialog).getByRole('tab', { name: /horários/i });
    await waitFor(() => expect(within(dialog).getByRole('button', { name: /fechar informações/i })).toHaveFocus());
    about.focus();
    await user.keyboard('{ArrowRight}');

    expect(hours).toHaveFocus();
    expect(hours).toHaveAttribute('aria-selected', 'true');
    expect(within(dialog).getByRole('tabpanel')).toHaveAccessibleName(/horários/i);
  });
});
