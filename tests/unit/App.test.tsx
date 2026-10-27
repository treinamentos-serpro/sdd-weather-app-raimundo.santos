import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../../src/App';
import { mockWeatherData } from '../../src/mocks/weatherData';
import { getWeather, searchCities } from '../../src/services/weatherService';

vi.mock('../../src/services/weatherService', () => ({
  getWeather: vi.fn(),
  searchCities: vi.fn(),
}));

beforeEach(() => {
  vi.resetAllMocks();
});

describe('App', () => {
  it('starts idle, loads a searched city and changes display unit without another search', async () => {
    vi.mocked(searchCities).mockResolvedValue([mockWeatherData.city]);
    vi.mocked(getWeather).mockResolvedValue(mockWeatherData);
    const user = userEvent.setup();
    render(<App />);

    expect(
      screen.getByRole('heading', { name: 'Consulte o clima da sua cidade' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Pular para o conteúdo' })).toHaveAttribute(
      'href',
      '#main-content',
    );

    await user.type(screen.getByRole('searchbox', { name: 'Cidade' }), 'Lisboa');
    await user.click(screen.getByRole('button', { name: 'Buscar' }));
    expect(screen.getByRole('status')).toBeInTheDocument();

    expect(await screen.findByRole('heading', { name: 'Lisboa' })).toBeInTheDocument();
    expect(await screen.findByRole('status')).toHaveTextContent('Clima carregado para Lisboa.');
    expect(screen.getAllByRole('article')).toHaveLength(5);

    await user.click(screen.getByRole('button', { name: 'Fahrenheit' }));
    expect(screen.getByText('65')).toBeInTheDocument();
    expect(searchCities).toHaveBeenCalledExactlyOnceWith('Lisboa');
    expect(getWeather).toHaveBeenCalledExactlyOnceWith(mockWeatherData.city);
  });

  it('shows an empty state when the search has no results', async () => {
    vi.mocked(searchCities).mockResolvedValue([]);
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByRole('searchbox', { name: 'Cidade' }), 'Porto Alegre');
    await user.click(screen.getByRole('button', { name: 'Buscar' }));

    expect(
      await screen.findByRole('heading', { name: 'Nenhuma cidade encontrada' }),
    ).toBeInTheDocument();
    expect(getWeather).not.toHaveBeenCalled();
  });

  it('connects the error state retry button to the hook retry action', async () => {
    vi.mocked(searchCities)
      .mockRejectedValueOnce(new Error('Falha de rede.'))
      .mockResolvedValueOnce([mockWeatherData.city]);
    vi.mocked(getWeather).mockResolvedValue(mockWeatherData);
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByRole('searchbox', { name: 'Cidade' }), 'Lisboa');
    await user.click(screen.getByRole('button', { name: 'Buscar' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Falha de rede.');

    await user.click(screen.getByRole('button', { name: 'Tentar novamente' }));

    expect(await screen.findByRole('heading', { name: 'Lisboa' })).toBeInTheDocument();
    expect(searchCities).toHaveBeenCalledTimes(2);
  });
});
