import { describe, expect, it } from 'vitest';
import { getWeatherCondition, getWeatherIcon } from '../../../src/lib/weatherCodes';

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

describe('getWeatherCondition', () => {
  it('maps a known WMO code to its Portuguese label', () => {
    expect(getWeatherCondition(61)).toEqual({ code: 61, labelPtBr: 'Chuva fraca' });
  });

  it('uses a fallback label for an unknown WMO code', () => {
    expect(getWeatherCondition(999)).toEqual({
      code: 999,
      labelPtBr: 'Condição indisponível',
    });
  });
});
