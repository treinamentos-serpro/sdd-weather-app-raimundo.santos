import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useWeather } from '../../../src/hooks/useWeather';
import { mockWeatherData } from '../../../src/mocks/weatherData';
import { getWeather, searchCities } from '../../../src/services/weatherService';
import type { City } from '../../../src/types/weather';

vi.mock('../../../src/services/weatherService', () => ({
  getWeather: vi.fn(),
  searchCities: vi.fn(),
}));

const lisbon = mockWeatherData.city;
const porto: City = {
  id: '2735943',
  name: 'Porto',
  latitude: 41.1496,
  longitude: -8.6109,
  country: 'Portugal',
};

beforeEach(() => {
  vi.resetAllMocks();
});

describe('useWeather', () => {
  it('starts idle and loads weather for the first city returned by search', async () => {
    vi.mocked(searchCities).mockResolvedValue([lisbon, porto]);
    vi.mocked(getWeather).mockResolvedValue(mockWeatherData);
    const { result } = renderHook(() => useWeather());

    expect(result.current.status).toBe('idle');
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();

    await act(async () => {
      await result.current.search(' Lisboa ');
    });

    expect(searchCities).toHaveBeenCalledExactlyOnceWith('Lisboa');
    expect(getWeather).toHaveBeenCalledExactlyOnceWith(lisbon);
    expect(result.current).toMatchObject({
      status: 'success',
      data: mockWeatherData,
      cities: [lisbon, porto],
      query: 'Lisboa',
      error: null,
    });
  });

  it('sets empty when no city matches and keeps previously loaded weather', async () => {
    vi.mocked(searchCities).mockResolvedValueOnce([lisbon]).mockResolvedValueOnce([]);
    vi.mocked(getWeather).mockResolvedValue(mockWeatherData);
    const { result } = renderHook(() => useWeather());

    await act(async () => {
      await result.current.search('Lisboa');
    });
    await act(async () => {
      await result.current.search('Inexistente');
    });

    expect(result.current.status).toBe('empty');
    expect(result.current.cities).toEqual([]);
    expect(result.current.data).toBe(mockWeatherData);
    expect(result.current.query).toBe('Inexistente');
  });

  it('retries the last failed search with the same query', async () => {
    vi.mocked(searchCities)
      .mockRejectedValueOnce(new Error('Falha de rede.'))
      .mockResolvedValueOnce([lisbon]);
    vi.mocked(getWeather).mockResolvedValue(mockWeatherData);
    const { result } = renderHook(() => useWeather());

    await act(async () => {
      await result.current.search('Lisboa');
    });
    expect(result.current.status).toBe('error');
    expect(result.current.error).toBe('Falha de rede.');

    await act(async () => {
      await result.current.retry();
    });

    expect(searchCities).toHaveBeenNthCalledWith(2, 'Lisboa');
    expect(result.current.status).toBe('success');
    expect(result.current.data).toBe(mockWeatherData);
  });

  it('retries the last failed forecast for the same selected city', async () => {
    vi.mocked(getWeather)
      .mockRejectedValueOnce(new Error('A requisição demorou demais.'))
      .mockResolvedValueOnce(mockWeatherData);
    const { result } = renderHook(() => useWeather());

    await act(async () => {
      await result.current.selectCity(lisbon);
    });
    expect(result.current.status).toBe('error');

    await act(async () => {
      await result.current.retry();
    });

    expect(searchCities).not.toHaveBeenCalled();
    expect(getWeather).toHaveBeenNthCalledWith(2, lisbon);
    expect(result.current.data).toBe(mockWeatherData);
    expect(result.current.status).toBe('success');
  });

  it('ignores results from an older search after a newer search starts', async () => {
    let resolveOlderSearch: (cities: City[]) => void = () => undefined;
    vi.mocked(searchCities)
      .mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            resolveOlderSearch = resolve;
          }),
      )
      .mockResolvedValueOnce([porto]);
    vi.mocked(getWeather).mockResolvedValue({ ...mockWeatherData, city: porto });
    const { result } = renderHook(() => useWeather());

    let olderSearch: Promise<void> = Promise.resolve();
    await act(async () => {
      olderSearch = result.current.search('Lisboa');
      await result.current.search('Porto');
    });

    await act(async () => {
      resolveOlderSearch([lisbon]);
      await olderSearch;
    });

    expect(result.current.query).toBe('Porto');
    expect(result.current.data?.city).toEqual(porto);
    expect(getWeather).toHaveBeenCalledExactlyOnceWith(porto);
  });
});
