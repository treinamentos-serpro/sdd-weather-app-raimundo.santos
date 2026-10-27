import type { Unit } from '../types/weather';

export function toDisplayTemperature(valueCelsius: number | null, unit: Unit): number | null {
  if (valueCelsius === null || unit === 'celsius') return valueCelsius;

  const fahrenheit = (valueCelsius * 9) / 5 + 32;
  const roundedMagnitude = Math.floor(Math.abs(fahrenheit) + 0.5);
  return Math.sign(fahrenheit) * roundedMagnitude;
}
