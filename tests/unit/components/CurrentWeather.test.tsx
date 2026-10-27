import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import CurrentWeather from '../../../src/components/CurrentWeather';
import type { City, CurrentWeather as CurrentWeatherData } from '../../../src/types/weather';

const city: City = {
  id: 'lisbon',
  name: 'Lisboa',
  admin1: 'Lisboa',
  country: 'Portugal',
  latitude: 38.7167,
  longitude: -9.1333,
};

const current: CurrentWeatherData = {
  temperatureCelsius: 18.4,
  condition: { code: 2, labelPtBr: 'Parcialmente nublado' },
  humidityPercent: 72,
  windSpeedKmh: 12.5,
  precipitationMm: 0.2,
  pressureHpa: 1013.2,
};

describe('CurrentWeather', () => {
  it('renders location, condition, temperature and all requested metrics', () => {
    render(<CurrentWeather city={city} current={current} unit="celsius" />);

    expect(screen.getByRole('heading', { name: 'Lisboa' })).toBeInTheDocument();
    expect(screen.getByText('Parcialmente nublado')).toBeInTheDocument();
    expect(screen.getByText('18,4')).toBeInTheDocument();
    expect(screen.getByText('°C')).toBeInTheDocument();
    expect(screen.getByText('72 %')).toBeInTheDocument();
    expect(screen.getByText('12,5 km/h')).toBeInTheDocument();
    expect(screen.getByText('0,2 mm')).toBeInTheDocument();
    expect(screen.getByText('1.013,2 hPa')).toBeInTheDocument();
  });

  it('derives Fahrenheit for display and marks missing metrics unavailable', () => {
    render(
      <CurrentWeather
        city={city}
        current={{ ...current, humidityPercent: null, precipitationMm: null }}
        unit="fahrenheit"
      />,
    );

    expect(screen.getByText('65')).toBeInTheDocument();
    expect(screen.getByText('°F')).toBeInTheDocument();
    expect(screen.getAllByText('Indisponível')).toHaveLength(2);
  });
});
