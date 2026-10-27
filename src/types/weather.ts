export type Unit = 'celsius' | 'fahrenheit';

export interface City {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  admin1?: string;
  country?: string;
  countryCode?: string;
  timeZone?: string;
}

export interface WeatherCondition {
  code: number;
  labelPtBr: string;
}

export interface CurrentWeather {
  temperatureCelsius: number | null;
  condition: WeatherCondition | null;
  humidityPercent: number | null;
  windSpeedKmh: number | null;
  precipitationMm: number | null;
  pressureHpa: number | null;
}

export interface ForecastDay {
  localDate: string;
  temperatureCelsius: number | null;
  condition: WeatherCondition | null;
}

export interface WeatherData {
  city: City;
  timeZone: string | null;
  current: CurrentWeather;
  days: ForecastDay[];
}
