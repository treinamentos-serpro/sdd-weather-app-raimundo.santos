import type { Unit } from '../types/weather';

export function toDisplayTemperature(valueCelsius: number | null, unit: Unit): number | null {
  if (valueCelsius === null || unit === 'celsius') return valueCelsius;

  const fahrenheit = (valueCelsius * 9) / 5 + 32;
  const roundedMagnitude = Math.floor(Math.abs(fahrenheit) + 0.5);
  return Math.sign(fahrenheit) * roundedMagnitude;
}

export function convertTemperature(valueCelsius: number | null, unit: Unit): number | null {
  return toDisplayTemperature(valueCelsius, unit);
}

export function unitLabel(unit: Unit): '°C' | '°F' {
  return unit === 'celsius' ? '°C' : '°F';
}

export function formatTemperature(valueCelsius: number | null, unit: Unit): string {
  if (valueCelsius === null) return 'Indisponível';

  const value = convertTemperature(valueCelsius, unit);
  const formattedValue = new Intl.NumberFormat('pt-BR', {
    maximumFractionDigits: unit === 'celsius' ? 1 : 0,
  }).format(value ?? 0);

  return `${formattedValue} ${unitLabel(unit)}`;
}
