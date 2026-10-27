import { useRef, useState } from 'react';
import { getWeather, searchCities } from '../services/weatherService';
import type { City, WeatherData } from '../types/weather';

export type WeatherStatus = 'idle' | 'loading' | 'success' | 'error' | 'empty';

type LastOperation = { type: 'search'; name: string } | { type: 'weather'; city: City };

export interface UseWeatherResult {
  status: WeatherStatus;
  data: WeatherData | null;
  cities: City[];
  error: string | null;
  query: string;
  search: (name: string) => Promise<void>;
  selectCity: (city: City) => Promise<void>;
  retry: () => Promise<void>;
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Ocorreu um erro inesperado.';
}

export function useWeather(): UseWeatherResult {
  const [status, setStatus] = useState<WeatherStatus>('idle');
  const [data, setData] = useState<WeatherData | null>(null);
  const [cities, setCities] = useState<City[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const requestId = useRef(0);
  const lastOperation = useRef<LastOperation | null>(null);

  async function loadWeather(city: City): Promise<void> {
    lastOperation.current = { type: 'weather', city };
    const activeRequest = ++requestId.current;
    setStatus('loading');
    setData(null);
    setError(null);

    try {
      const weather = await getWeather(city);
      if (activeRequest !== requestId.current) return;
      setData(weather);
      setStatus('success');
    } catch (requestError) {
      if (activeRequest !== requestId.current) return;
      setError(getErrorMessage(requestError));
      setStatus('error');
    }
  }

  async function search(name: string): Promise<void> {
    const normalizedName = name.trim();
    lastOperation.current = { type: 'search', name: normalizedName };
    const activeRequest = ++requestId.current;
    setQuery(normalizedName);
    setStatus('loading');
    setError(null);

    try {
      const foundCities = await searchCities(normalizedName);
      if (activeRequest !== requestId.current) return;

      setCities(foundCities);
      if (foundCities.length === 0) {
        setStatus('empty');
        return;
      }

      await loadWeather(foundCities[0]);
    } catch (requestError) {
      if (activeRequest !== requestId.current) return;
      setError(getErrorMessage(requestError));
      setStatus('error');
    }
  }

  async function selectCity(city: City): Promise<void> {
    await loadWeather(city);
  }

  async function retry(): Promise<void> {
    const operation = lastOperation.current;
    if (!operation) return;

    if (operation.type === 'search') {
      await search(operation.name);
    } else {
      await loadWeather(operation.city);
    }
  }

  return { status, data, cities, error, query, search, selectCity, retry };
}
