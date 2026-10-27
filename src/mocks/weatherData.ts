import type { WeatherData } from '../types/weather';

export const mockWeatherData: WeatherData = {
  city: {
    id: '2267057',
    name: 'Lisboa',
    latitude: 38.7167,
    longitude: -9.1333,
    admin1: 'Lisboa',
    country: 'Portugal',
    countryCode: 'PT',
    timeZone: 'Europe/Lisbon',
  },
  timeZone: 'Europe/Lisbon',
  current: {
    temperatureCelsius: 18.4,
    condition: {
      code: 2,
      labelPtBr: 'Parcialmente nublado',
    },
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
};
