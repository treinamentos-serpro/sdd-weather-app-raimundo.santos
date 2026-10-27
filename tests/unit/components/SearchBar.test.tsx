import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import SearchBar from '../../../src/components/SearchBar';

describe('SearchBar', () => {
  it('exposes an accessible search landmark and labeled searchbox', () => {
    render(<SearchBar onSearch={vi.fn()} />);

    expect(screen.getByRole('search', { name: 'Busca de cidades' })).toBeInTheDocument();
    expect(screen.getByRole('searchbox', { name: 'Cidade' })).toBeInTheDocument();
  });

  it('submits the trimmed city name', async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();
    render(<SearchBar onSearch={onSearch} />);

    await user.type(screen.getByRole('searchbox', { name: 'Cidade' }), '  Lisboa  ');
    await user.click(screen.getByRole('button', { name: 'Buscar' }));

    expect(onSearch).toHaveBeenCalledExactlyOnceWith('Lisboa');
  });

  it('does not submit an empty or whitespace-only value', () => {
    const onSearch = vi.fn();
    render(<SearchBar onSearch={onSearch} />);
    const form = screen.getByRole('search', { name: 'Busca de cidades' });
    const input = screen.getByRole('searchbox', { name: 'Cidade' });

    fireEvent.submit(form);
    fireEvent.change(input, { target: { value: '   ' } });
    fireEvent.submit(form);

    expect(onSearch).not.toHaveBeenCalled();
  });

  it('disables the input and prevents submission when disabled', async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();
    render(<SearchBar onSearch={onSearch} disabled />);

    expect(screen.getByRole('searchbox', { name: 'Cidade' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Buscar' })).toBeDisabled();
    await user.click(screen.getByRole('button', { name: 'Buscar' }));

    expect(onSearch).not.toHaveBeenCalled();
  });
});
