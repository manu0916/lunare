import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { MenuCatalogV2 } from '../components/MenuCatalogV2';

describe('MenuCatalog', () => {
  it('filtra produtos instantaneamente e mostra o estado vazio', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><MenuCatalogV2 /></MemoryRouter>);
    const search = screen.getByRole('searchbox', { name: /buscar produto/i });
    await user.type(search, 'produto inexistente');
    expect(screen.getByText('Nenhum produto encontrado')).toBeInTheDocument();
  });
  it('encontra um produto pelo nome', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><MenuCatalogV2 /></MemoryRouter>);
    await user.type(screen.getByRole('searchbox', { name: /buscar produto/i }), 'Saturno');
    expect((await screen.findAllByText('Saturno · 60 peças')).length).toBeGreaterThan(0);
  });
});
