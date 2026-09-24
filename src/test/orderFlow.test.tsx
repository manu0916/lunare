import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../AppV2';
import { useOrderStore } from '../store/useOrderStore';

describe('fluxo integrado do pedido demonstrativo', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.stubGlobal('fetch', vi.fn());
    useOrderStore.getState().resetDemo();
    useOrderStore.getState().setDemoMode(true);
  });

  afterEach(() => vi.unstubAllGlobals());

  it('busca, configura, adiciona, edita, revisa e conclui sem backend', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={['/cardapio']}>
        <App />
      </MemoryRouter>,
    );

    const search = await screen.findByRole('searchbox', { name: /buscar produto/i });
    await user.type(search, 'Hossomaki Tartare Lemon');
    const product = await screen.findByRole('button', { name: /hossomaki tartare lemon/i });
    await user.click(product);

    let dialog = screen.getByRole('dialog', { name: /detalhes de hossomaki tartare lemon/i });
    await user.click(within(dialog).getByRole('radio', { name: /8 peças/i }));
    await user.click(within(dialog).getByRole('radio', { name: /maçaricada/i }));
    await user.click(within(dialog).getByRole('checkbox', { name: /cream cheese/i }));
    dialog = screen.getByRole('dialog', { name: /detalhes de hossomaki tartare lemon/i });
    await user.click(within(dialog).getByRole('button', { name: /adicionar/i }));

    let cart = await screen.findByRole('dialog', { name: /carrinho de demonstração/i });
    expect(within(cart).getByText(/hossomaki tartare lemon/i)).toBeInTheDocument();
    await user.click(within(cart).getByRole('button', { name: /editar hossomaki tartare lemon/i }));

    dialog = screen.getByRole('dialog', { name: /detalhes de hossomaki tartare lemon/i });
    await waitFor(() => expect(within(dialog).getByRole('radio', { name: /8 peças/i })).toBeChecked());
    expect(within(dialog).getByRole('radio', { name: /maçaricada/i })).toBeChecked();
    expect(within(dialog).getByRole('checkbox', { name: /cream cheese/i })).toBeChecked();
    await user.click(within(dialog).getByRole('checkbox', { name: /cream cheese/i }));
    dialog = screen.getByRole('dialog', { name: /detalhes de hossomaki tartare lemon/i });
    await user.click(within(dialog).getByRole('checkbox', { name: /molho tare/i }));
    dialog = screen.getByRole('dialog', { name: /detalhes de hossomaki tartare lemon/i });
    await user.click(within(dialog).getByRole('button', { name: /atualizar/i }));

    cart = await screen.findByRole('dialog', { name: /carrinho de demonstração/i });
    expect(within(cart).getByText(/maçaricada.*tare/i)).toBeInTheDocument();
    await user.click(within(cart).getByRole('link', { name: /revisar demonstração/i }));

    expect(await screen.findByRole('heading', { name: /revise sua experiência/i })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /entrega/i }));
    await user.type(screen.getByPlaceholderText(/digite lunare10/i), 'LUNARE10');
    await user.click(screen.getByRole('button', { name: /aplicar/i }));
    expect(screen.getByText(/cupom demonstrativo aplicado/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /concluir demonstração/i }));
    expect(await screen.findByRole('heading', { name: /demonstração concluída/i }, { timeout: 2500 })).toBeInTheDocument();

    const state = useOrderStore.getState();
    expect(state.cart).toHaveLength(0);
    expect(state.lastOrder).toEqual(
      expect.objectContaining({
        fulfillment: 'delivery',
        subtotalCents: 7300,
        discountCents: 730,
        feeCents: 590,
        totalCents: 7160,
        demoOnly: true,
      }),
    );
    expect(state.lastOrder?.items[0].configuration.optionIds).toEqual(expect.arrayContaining(['macaricada', 'tare']));
    expect(state.lastOrder?.items[0].configuration.optionIds).not.toContain('cream-cheese');
    expect(fetch).not.toHaveBeenCalled();
  });
});
