import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import ForecastList from '../../../src/components/ForecastList';
import type { ForecastDay } from '../../../src/types/weather';

const days: ForecastDay[] = [
  {
    localDate: '2026-10-27',
    temperatureMaxCelsius: 20.1,
    temperatureMinCelsius: 13.2,
    precipitationProbabilityPercent: 10,
    condition: { code: 2, labelPtBr: 'Parcialmente nublado' },
  },
  {
    localDate: '2026-10-28',
    temperatureMaxCelsius: 21.3,
    temperatureMinCelsius: 14.1,
    precipitationProbabilityPercent: 5,
    condition: { code: 1, labelPtBr: 'Predominantemente limpo' },
  },
  {
    localDate: '2026-10-29',
    temperatureMaxCelsius: 19.8,
    temperatureMinCelsius: 12.8,
    precipitationProbabilityPercent: 20,
    condition: { code: 3, labelPtBr: 'Nublado' },
  },
  {
    localDate: '2026-10-30',
    temperatureMaxCelsius: 17.6,
    temperatureMinCelsius: 11.6,
    precipitationProbabilityPercent: 70,
    condition: { code: 61, labelPtBr: 'Chuva fraca' },
  },
  {
    localDate: '2026-10-31',
    temperatureMaxCelsius: 18.9,
    temperatureMinCelsius: 12.4,
    precipitationProbabilityPercent: 15,
    condition: { code: 2, labelPtBr: 'Parcialmente nublado' },
  },
];

describe('ForecastList', () => {
  it('renders five forecast cards with day, icon, temperatures and rain probability', () => {
    render(<ForecastList days={days} unit="celsius" />);

    const list = screen.getByRole('list');
    const cards = within(list).getAllByRole('article');
    expect(cards).toHaveLength(5);
    expect(within(cards[0]).getByText('Terça-feira, 27/10')).toBeInTheDocument();
    expect(within(cards[0]).getByText('20,1 °C')).toBeInTheDocument();
    expect(within(cards[0]).getByText('13,2 °C')).toBeInTheDocument();
    expect(within(cards[0]).getByText('10%')).toBeInTheDocument();
  });

  it('converts max/min for the selected unit and marks missing values unavailable', () => {
    render(
      <ForecastList
        days={[{ ...days[0], temperatureMinCelsius: null, precipitationProbabilityPercent: null }]}
        unit="fahrenheit"
      />,
    );

    const card = screen.getByRole('article', { name: 'Previsão: Terça-feira, 27/10' });
    expect(within(card).getByText('68 °F')).toBeInTheDocument();
    expect(within(card).getAllByText('Indisponível')).toHaveLength(2);
  });
});
