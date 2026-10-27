import { describe, expect, it } from 'vitest';
import { convertTemperature, formatTemperature, unitLabel } from '../../src/lib/temperature';

describe('convertTemperature', () => {
  it.each([
    [0, 'fahrenheit', 32],
    [100, 'fahrenheit', 212],
    [-40, 'fahrenheit', -40],
    [18.4, 'celsius', 18.4],
  ] as const)('converts %s °C to %s as %s', (valueCelsius, unit, expected) => {
    expect(convertTemperature(valueCelsius, unit)).toBe(expected);
  });

  it('preserves missing temperatures', () => {
    expect(convertTemperature(null, 'celsius')).toBeNull();
    expect(convertTemperature(null, 'fahrenheit')).toBeNull();
  });

  it('rounds negative Fahrenheit half values away from zero', () => {
    const celsiusForNegativeHalfFahrenheit = ((-31.5 - 32) * 5) / 9;

    expect(convertTemperature(celsiusForNegativeHalfFahrenheit, 'fahrenheit')).toBe(-32);
  });
});

describe('formatTemperature', () => {
  it('rounds Fahrenheit and includes the unit symbol', () => {
    expect(formatTemperature(0, 'fahrenheit')).toBe('32 °F');
    expect(formatTemperature(18.4, 'fahrenheit')).toBe('65 °F');
    expect(formatTemperature(((-31.5 - 32) * 5) / 9, 'fahrenheit')).toBe('-32 °F');
  });

  it('formats Celsius decimals with a localized decimal separator and symbol', () => {
    expect(formatTemperature(18.4, 'celsius')).toBe('18,4 °C');
  });

  it('labels a missing temperature as unavailable', () => {
    expect(formatTemperature(null, 'celsius')).toBe('Indisponível');
  });
});

describe('unitLabel', () => {
  it('returns the correct symbol for each unit', () => {
    expect(unitLabel('celsius')).toBe('°C');
    expect(unitLabel('fahrenheit')).toBe('°F');
  });
});
