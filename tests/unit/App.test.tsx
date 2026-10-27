import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import App from '../../src/App';

describe('App', () => {
  it('starts idle, searches the mock city and changes display unit without another search', async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(
      screen.getByRole('heading', { name: 'Consulte o clima da sua cidade' }),
    ).toBeInTheDocument();

    await user.type(screen.getByRole('searchbox', { name: 'Cidade' }), 'Lisboa');
    await user.click(screen.getByRole('button', { name: 'Buscar' }));
    expect(screen.getByRole('status')).toBeInTheDocument();

    expect(await screen.findByRole('heading', { name: 'Lisboa' })).toBeInTheDocument();
    expect(screen.getAllByRole('article')).toHaveLength(5);

    await user.click(screen.getByRole('button', { name: 'Fahrenheit' }));
    expect(screen.getByText('65')).toBeInTheDocument();
  });

  it('shows an empty state for a city not present in the mock', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByRole('searchbox', { name: 'Cidade' }), 'Porto Alegre');
    await user.click(screen.getByRole('button', { name: 'Buscar' }));

    expect(
      await screen.findByRole('heading', { name: 'Nenhuma cidade encontrada' }),
    ).toBeInTheDocument();
  });
});
