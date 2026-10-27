import { getWeatherCondition } from '../lib/weatherCodes';
import type { City, CurrentWeather, ForecastDay, WeatherData } from '../types/weather';

const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';
const CURRENT_FIELDS =
  'temperature_2m,weather_code,relative_humidity_2m,wind_speed_10m,precipitation,surface_pressure';
const DAILY_FIELDS =
  'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max';
const FORECAST_DAYS = 5;

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

function nullableNumber(value: unknown): number | null {
  if (value === undefined || value === null) return null;
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new WeatherServiceError('Resposta inválida ao buscar previsão.');
  }
  return value;
}

function mapCurrent(value: Record<string, unknown>): CurrentWeather {
  return {
    temperatureCelsius: nullableNumber(value.temperature_2m),
    condition: getWeatherCondition(nullableNumber(value.weather_code)),
    humidityPercent: nullableNumber(value.relative_humidity_2m),
    windSpeedKmh: nullableNumber(value.wind_speed_10m),
    precipitationMm: nullableNumber(value.precipitation),
    pressureHpa: nullableNumber(value.surface_pressure),
  };
}

function mapForecastDays(value: Record<string, unknown>): ForecastDay[] {
  const dates = value.time;
  if (!Array.isArray(dates) || dates.length < FORECAST_DAYS) {
    throw new WeatherServiceError('Resposta incompleta ao buscar previsão.');
  }

  function dailyValue(field: string, index: number): unknown {
    const values = value[field];
    if (values === undefined) return null;
    if (!Array.isArray(values)) {
      throw new WeatherServiceError('Resposta inválida ao buscar previsão.');
    }
    return values[index];
  }

  return dates.slice(0, FORECAST_DAYS).map((date, index) => {
    if (typeof date !== 'string') {
      throw new WeatherServiceError('Resposta inválida ao buscar previsão.');
    }

    return {
      localDate: date,
      temperatureMaxCelsius: nullableNumber(dailyValue('temperature_2m_max', index)),
      temperatureMinCelsius: nullableNumber(dailyValue('temperature_2m_min', index)),
      precipitationProbabilityPercent: nullableNumber(
        dailyValue('precipitation_probability_max', index),
      ),
      condition: getWeatherCondition(nullableNumber(dailyValue('weather_code', index))),
    };
  });
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

export async function getWeather(city: City): Promise<WeatherData> {
  const params = new URLSearchParams({
    latitude: String(city.latitude),
    longitude: String(city.longitude),
    current: CURRENT_FIELDS,
    daily: DAILY_FIELDS,
    temperature_unit: 'celsius',
    wind_speed_unit: 'kmh',
    precipitation_unit: 'mm',
    timezone: 'auto',
    forecast_days: String(FORECAST_DAYS),
  });
  const response = await fetch(`${FORECAST_URL}?${params.toString()}`);

  if (!response.ok) {
    throw new WeatherServiceError(`Falha ao buscar previsão (HTTP ${response.status}).`);
  }

  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    throw new WeatherServiceError('Resposta inválida ao buscar previsão.');
  }

  if (!isRecord(payload) || payload.error === true) {
    throw new WeatherServiceError('Resposta inválida ao buscar previsão.');
  }
  if (!isRecord(payload.current) || !isRecord(payload.daily)) {
    throw new WeatherServiceError('Resposta incompleta ao buscar previsão.');
  }

  return {
    city,
    timeZone: typeof payload.timezone === 'string' ? payload.timezone : null,
    current: mapCurrent(payload.current),
    days: mapForecastDays(payload.daily),
  };
}
