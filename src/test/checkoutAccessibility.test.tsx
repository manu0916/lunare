import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';
import { CheckoutPageV2 } from '../pages/CheckoutPageV2';
import { useOrderStore } from '../store/useOrderStore';

describe('validação acessível do checkout demonstrativo', () => {
  beforeEach(() => {
    localStorage.clear();
    useOrderStore.getState().resetDemo();
    useOrderStore.getState().setDemoMode(true);
    useOrderStore.getState().addItem({
      productId: 'agua',
      quantity: 2,
      configuration: { variantId: null, optionIds: [], note: '' },
    });
  });

  it('associa mensagens aos campos inválidos e expõe um alerta textual', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={['/checkout']}>
        <CheckoutPageV2 />
      </MemoryRouter>,
    );

    const name = screen.getByRole('textbox', { name: /nome da demonstração/i });
    const phone = screen.getByRole('textbox', { name: /telefone fictício/i });
    await user.clear(name);
    await user.clear(phone);
    await user.click(screen.getByRole('button', { name: /concluir demonstração/i }));

    expect(name).toHaveAttribute('aria-invalid', 'true');
    expect(name).toHaveAccessibleDescription(/informe um nome fictício/i);
    expect(phone).toHaveAttribute('aria-invalid', 'true');
    expect(phone).toHaveAccessibleDescription(/informe o telefone fictício/i);
    expect(screen.getByRole('alert')).toHaveTextContent(/complete o perfil fictício/i);
  });

  it('comunica a modalidade selecionada por aria-pressed', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={['/checkout']}>
        <CheckoutPageV2 />
      </MemoryRouter>,
    );

    const pickup = screen.getByRole('button', { name: /retirada/i });
    const delivery = screen.getByRole('button', { name: /entrega/i });
    expect(pickup).toHaveAttribute('aria-pressed', 'true');
    expect(delivery).toHaveAttribute('aria-pressed', 'false');

    await user.click(delivery);
    expect(delivery).toHaveAttribute('aria-pressed', 'true');
    expect(pickup).toHaveAttribute('aria-pressed', 'false');
  });
});
