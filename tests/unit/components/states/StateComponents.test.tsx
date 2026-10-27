import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import EmptyState from '../../../../src/components/states/EmptyState';
import ErrorState from '../../../../src/components/states/ErrorState';
import LoadingState from '../../../../src/components/states/LoadingState';

describe('state components', () => {
  it('exposes loading feedback with the status role', () => {
    render(<LoadingState />);

    expect(screen.getByRole('status')).toHaveTextContent('Carregando...');
  });

  it('shows an error message and invokes retry', () => {
    const onRetry = vi.fn();
    render(<ErrorState message="Não foi possível carregar a previsão." onRetry={onRetry} />);

    expect(screen.getByRole('alert')).toHaveTextContent('Não foi possível carregar a previsão.');
    fireEvent.click(screen.getByRole('button', { name: 'Tentar novamente' }));

    expect(onRetry).toHaveBeenCalledOnce();
  });

  it('shows an empty-state title and hint', () => {
    render(<EmptyState title="Nenhuma cidade" hint="Tente buscar outro nome." />);

    expect(screen.getByRole('heading', { name: 'Nenhuma cidade' })).toBeInTheDocument();
    expect(screen.getByText('Tente buscar outro nome.')).toBeInTheDocument();
  });
});
