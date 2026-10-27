import { describe, expect, it } from 'vitest';
import { toDisplayTemperature } from '../../../src/lib/temperature';

describe('toDisplayTemperature', () => {
  it('keeps Celsius values and returns null for missing temperatures', () => {
    expect(toDisplayTemperature(18.4, 'celsius')).toBe(18.4);
    expect(toDisplayTemperature(null, 'fahrenheit')).toBeNull();
  });

  it('converts Celsius to Fahrenheit and rounds ties away from zero', () => {
    expect(toDisplayTemperature(0, 'fahrenheit')).toBe(32);
    expect(toDisplayTemperature(100, 'fahrenheit')).toBe(212);
    expect(toDisplayTemperature(-40, 'fahrenheit')).toBe(-40);
    expect(toDisplayTemperature((0.5 * 5) / 9, 'fahrenheit')).toBe(33);
  });
});
