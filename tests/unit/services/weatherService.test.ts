import { afterEach, describe, expect, it, vi } from 'vitest';
import { searchCities, WeatherServiceError } from '../../../src/services/weatherService';

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
