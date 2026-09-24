import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';
import {
  CartDrawerV2,
  ClosedDialog,
  ProductDialog,
} from '../components/OverlaysV2';
import { useOrderStore } from '../store/useOrderStore';

const baseConfiguration = { variantId: null, optionIds: [], note: '' };

function renderProductAndCart() {
  return render(
    <MemoryRouter initialEntries={['/cardapio']}>
      <ProductDialog />
      <CartDrawerV2 />
      <ClosedDialog />
    </MemoryRouter>,
  );
}

describe('ficha de produto', () => {
  beforeEach(() => {
    localStorage.clear();
    useOrderStore.getState().resetDemo();
  });

  it('mostra uma ficha simples pronta para adicionar', () => {
    useOrderStore.getState().setDemoMode(true);
    useOrderStore.getState().selectProduct('saturno-60');
    renderProductAndCart();

    const dialog = screen.getByRole('dialog', { name: /detalhes de saturno/i });
    expect(within(dialog).getByRole('heading', { name: /saturno/i })).toBeInTheDocument();
    expect(within(dialog).queryAllByRole('radio')).toHaveLength(0);
    expect(within(dialog).getByRole('button', { name: /adicionar/i })).toBeEnabled();
  });

  it('exige variante e opção obrigatória antes de habilitar a ação', async () => {
    const user = userEvent.setup();
    useOrderStore.getState().setDemoMode(true);
    useOrderStore.getState().selectProduct('hosso-tartare-lemon');
    renderProductAndCart();

    const dialog = screen.getByRole('dialog', { name: /detalhes de hossomaki tartare lemon/i });
    const addButton = within(dialog).getByRole('button', { name: /adicionar/i });
    expect(addButton).toBeDisabled();

    await user.click(within(dialog).getByRole('radio', { name: /8 peças/i }));
    expect(addButton).toBeDisabled();
    await user.click(within(dialog).getByRole('radio', { name: /maçaricada/i }));
    await user.click(within(dialog).getByRole('checkbox', { name: /cream cheese/i }));

    const currentDialog = screen.getByRole('dialog', { name: /detalhes de hossomaki tartare lemon/i });
    const configuredAddButton = within(currentDialog).getByRole('button', { name: /adicionar/i });
    expect(configuredAddButton).toBeEnabled();
    expect(configuredAddButton).toHaveAccessibleName(/R\$\s*75,00/i);
    expect(configuredAddButton).toBeInTheDocument();
    expect(useOrderStore.getState().demoMode).toBe(true);
    await user.click(configuredAddButton);

    expect(useOrderStore.getState().closedOpen).toBe(false);
    await waitFor(() => expect(useOrderStore.getState().cartOpen).toBe(true));
    expect(useOrderStore.getState().cart).toEqual([
      expect.objectContaining({
        productId: 'hosso-tartare-lemon',
        quantity: 1,
        configuration: {
          variantId: '8-pecas',
          optionIds: expect.arrayContaining(['macaricada', 'cream-cheese']),
          note: '',
        },
      }),
    ]);
    expect(await screen.findByRole('heading', { name: /seu carrinho/i })).toBeInTheDocument();
  });

  it('abre o aviso de loja fechada em vez de adicionar fora do modo demo', async () => {
    const user = userEvent.setup();
    useOrderStore.getState().selectProduct('saturno-60');
    renderProductAndCart();

    await user.click(screen.getByRole('button', { name: /adicionar/i }));

    expect(screen.getByRole('dialog', { name: /loja fechada/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /estamos fechados/i })).toBeInTheDocument();
    expect(useOrderStore.getState().cart).toHaveLength(0);
  });
});

describe('carrinho', () => {
  beforeEach(() => {
    localStorage.clear();
    useOrderStore.getState().resetDemo();
  });

  it('apresenta o estado vazio com destino útil', () => {
    useOrderStore.getState().setCartOpen(true);
    render(
      <MemoryRouter>
        <CartDrawerV2 />
      </MemoryRouter>,
    );

    const dialog = screen.getByRole('dialog', { name: /carrinho de demonstração/i });
    expect(within(dialog).getByRole('heading', { name: /órbita está vazia/i })).toBeInTheDocument();
    expect(within(dialog).getByRole('link', { name: /ver cardápio/i })).toHaveAttribute('href', '/cardapio');
  });

  it('apresenta itens, subtotal e ações no estado preenchido', () => {
    useOrderStore.getState().addItem({ productId: 'agua', quantity: 2, configuration: baseConfiguration });
    useOrderStore.getState().setCartOpen(true);
    render(
      <MemoryRouter>
        <CartDrawerV2 />
      </MemoryRouter>,
    );

    const dialog = screen.getByRole('dialog', { name: /carrinho de demonstração/i });
    expect(within(dialog).getByText(/água mineral/i)).toBeInTheDocument();
    expect(within(dialog).getByRole('button', { name: /editar água mineral/i })).toBeInTheDocument();
    expect(within(dialog).getByRole('button', { name: /remover água mineral/i })).toBeInTheDocument();
    expect(within(dialog).getByRole('link', { name: /revisar demonstração/i })).toHaveAttribute('href', '/checkout');
    expect(within(dialog).getAllByText(/R\$\s*12,00/i).length).toBeGreaterThan(0);
  });
});
