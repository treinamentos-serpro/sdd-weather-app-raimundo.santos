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
  },
  days: [
    {
      localDate: '2026-10-27',
      temperatureCelsius: 20.1,
      condition: { code: 2, labelPtBr: 'Parcialmente nublado' },
    },
    {
      localDate: '2026-10-28',
      temperatureCelsius: 21.3,
      condition: { code: 1, labelPtBr: 'Predominantemente limpo' },
    },
    {
      localDate: '2026-10-29',
      temperatureCelsius: 19.8,
      condition: { code: 3, labelPtBr: 'Nublado' },
    },
    {
      localDate: '2026-10-30',
      temperatureCelsius: 17.6,
      condition: { code: 61, labelPtBr: 'Chuva fraca' },
    },
    {
      localDate: '2026-10-31',
      temperatureCelsius: 18.9,
      condition: { code: 2, labelPtBr: 'Parcialmente nublado' },
    },
  ],
};
