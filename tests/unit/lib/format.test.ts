import { describe, expect, it } from 'vitest';
import { formatDayLabel } from '../../../src/lib/format';

describe('formatDayLabel', () => {
  it('formats a local date without shifting its weekday', () => {
    expect(formatDayLabel('2026-10-27')).toBe('Terça-feira, 27/10');
  });

  it('returns an unavailable label for invalid dates', () => {
    expect(formatDayLabel('2026-02-30')).toBe('Data indisponível');
    expect(formatDayLabel('not-a-date')).toBe('Data indisponível');
  });
});
