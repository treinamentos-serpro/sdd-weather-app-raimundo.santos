import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  getWeather,
  searchCities,
  WeatherServiceError,
} from '../../../src/services/weatherService';
import type { City } from '../../../src/types/weather';

const city: City = {
  id: '2267057',
  name: 'Lisboa',
  latitude: 38.7167,
  longitude: -9.1333,
  country: 'Portugal',
};

const forecastPayload = {
  timezone: 'Europe/Lisbon',
  current: {
    temperature_2m: 18.4,
    weather_code: 2,
    relative_humidity_2m: 72,
    wind_speed_10m: 12.5,
    precipitation: 0.2,
    surface_pressure: 1013.2,
  },
  daily: {
    time: ['2026-10-27', '2026-10-28', '2026-10-29', '2026-10-30', '2026-10-31'],
    temperature_2m_max: [20.1, 21.3, 19.8, 17.6, 18.9],
    temperature_2m_min: [13.2, 14.1, 12.8, 11.6, 12.4],
    precipitation_probability_max: [10, 5, 20, 70, 15],
    weather_code: [2, 1, 3, 61, 2],
  },
};

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('searchCities', () => {
  it('returns an empty list without calling the network for blank input', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    await expect(searchCities('  \t ')).resolves.toEqual([]);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('encodes the trimmed name and maps geocoding results to cities', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({
        results: [
          {
            id: 123,
            name: 'New York',
            latitude: 40.71,
            longitude: -74.01,
            admin1: 'New York',
            country: 'United States',
            country_code: 'US',
            timezone: 'America/New_York',
          },
        ],
      }),
    });
    vi.stubGlobal('fetch', fetchMock);

    await expect(searchCities('  New York  ')).resolves.toEqual([
      {
        id: '123',
        name: 'New York',
        latitude: 40.71,
        longitude: -74.01,
        admin1: 'New York',
        country: 'United States',
        countryCode: 'US',
        timeZone: 'America/New_York',
      },
    ]);
    expect(fetchMock).toHaveBeenCalledWith(
      'https://geocoding-api.open-meteo.com/v1/search?name=New%20York&count=10&language=pt&format=json',
    );
  });

  it('throws WeatherServiceError when the response is not ok', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 503 }));

    await expect(searchCities('Lisboa')).rejects.toBeInstanceOf(WeatherServiceError);
  });

  it('throws WeatherServiceError when the API returns an error envelope', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue({ error: true, reason: 'Invalid query' }),
      }),
    );

    await expect(searchCities('Lisboa')).rejects.toBeInstanceOf(WeatherServiceError);
  });

  it('returns an empty list when the response has no results', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue({}),
      }),
    );

    await expect(searchCities('Lisboa')).resolves.toEqual([]);
  });
});

describe('getWeather', () => {
  it('requests the selected coordinates and maps current weather and five daily items', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(forecastPayload),
    });
    vi.stubGlobal('fetch', fetchMock);

    await expect(getWeather(city)).resolves.toEqual({
      city,
      timeZone: 'Europe/Lisbon',
      current: {
        temperatureCelsius: 18.4,
        condition: { code: 2, labelPtBr: 'Parcialmente nublado' },
        humidityPercent: 72,
        windSpeedKmh: 12.5,
        precipitationMm: 0.2,
        pressureHpa: 1013.2,
      },
      days: [
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
      ],
    });

    const requestUrl = new URL(fetchMock.mock.calls[0][0]);
    expect(requestUrl.origin + requestUrl.pathname).toBe('https://api.open-meteo.com/v1/forecast');
    expect(requestUrl.searchParams.get('latitude')).toBe(String(city.latitude));
    expect(requestUrl.searchParams.get('longitude')).toBe(String(city.longitude));
    expect(requestUrl.searchParams.get('forecast_days')).toBe('5');
    expect(requestUrl.searchParams.get('temperature_unit')).toBe('celsius');
  });

  it.each(['current', 'daily'] as const)('rejects a response without %s', async (missingField) => {
    const incompletePayload = { ...forecastPayload };
    delete incompletePayload[missingField];
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue(incompletePayload),
      }),
    );

    await expect(getWeather(city)).rejects.toBeInstanceOf(WeatherServiceError);
  });
});
