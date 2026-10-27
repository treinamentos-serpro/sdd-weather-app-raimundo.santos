import type { City } from '../types/weather';

const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';

export class WeatherServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'WeatherServiceError';
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function mapCity(value: unknown): City {
  if (!isRecord(value)) {
    throw new WeatherServiceError('Resposta inválida ao buscar cidades.');
  }

  const { id, name, latitude, longitude } = value;
  if (
    (typeof id !== 'number' && typeof id !== 'string') ||
    (typeof id === 'number' && !Number.isFinite(id)) ||
    typeof name !== 'string' ||
    typeof latitude !== 'number' ||
    !Number.isFinite(latitude) ||
    typeof longitude !== 'number' ||
    !Number.isFinite(longitude)
  ) {
    throw new WeatherServiceError('Resposta inválida ao buscar cidades.');
  }

  const city: City = {
    id: String(id),
    name,
    latitude,
    longitude,
  };

  if (typeof value.admin1 === 'string') city.admin1 = value.admin1;
  if (typeof value.country === 'string') city.country = value.country;
  if (typeof value.country_code === 'string') city.countryCode = value.country_code;
  if (typeof value.timezone === 'string') city.timeZone = value.timezone;

  return city;
}

export async function searchCities(name: string): Promise<City[]> {
  const query = name.trim();
  if (!query) return [];

  const url = `${GEOCODING_URL}?name=${encodeURIComponent(query)}&count=10&language=pt&format=json`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new WeatherServiceError(`Falha ao buscar cidades (HTTP ${response.status}).`);
  }

  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    throw new WeatherServiceError('Resposta inválida ao buscar cidades.');
  }

  if (!isRecord(payload)) {
    throw new WeatherServiceError('Resposta inválida ao buscar cidades.');
  }

  if (payload.error === true) {
    throw new WeatherServiceError('A API de geocodificação retornou um erro.');
  }

  if (payload.results === undefined) return [];
  if (!Array.isArray(payload.results)) {
    throw new WeatherServiceError('Resposta inválida ao buscar cidades.');
  }

  return payload.results.map(mapCity);
}
