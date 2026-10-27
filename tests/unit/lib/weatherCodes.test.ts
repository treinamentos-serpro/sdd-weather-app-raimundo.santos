import { describe, expect, it } from 'vitest';
import { getWeatherIcon } from '../../../src/lib/weatherCodes';

describe('getWeatherIcon', () => {
  it('maps known WMO codes to weather icons', () => {
    expect(getWeatherIcon(0)).toBe('☀️');
    expect(getWeatherIcon(61)).toBe('🌧️');
    expect(getWeatherIcon(95)).toBe('⛈️');
  });

  it('uses a neutral cloud icon for missing or unknown codes', () => {
    expect(getWeatherIcon(null)).toBe('☁️');
    expect(getWeatherIcon(999)).toBe('☁️');
  });
});
