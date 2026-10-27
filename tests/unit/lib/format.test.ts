import { describe, expect, it } from 'vitest';
import { formatDayLabel, getShortDate } from '../../../src/lib/format';

describe('formatDayLabel', () => {
  it('formats a local date without shifting its weekday', () => {
    expect(formatDayLabel('2026-10-27')).toBe('Terça-feira, 27/10');
  });

  it('returns an unavailable label for invalid dates', () => {
    expect(formatDayLabel('2026-02-30')).toBe('Data indisponível');
    expect(formatDayLabel('not-a-date')).toBe('Data indisponível');
  });

  it('labels the first two forecast days by relative day', () => {
    expect(formatDayLabel('2026-10-27', 0)).toBe('Hoje');
    expect(formatDayLabel('2026-10-28', 1)).toBe('Amanhã');
  });

  it('uses an abbreviated weekday for later forecast days', () => {
    expect(formatDayLabel('2026-10-29', 2)).toBe('Qui.');
  });
});

describe('getShortDate', () => {
  it('formats a valid local date as day/month', () => {
    expect(getShortDate('2026-10-27')).toBe('27/10');
  });

  it('returns an unavailable label for invalid dates', () => {
    expect(getShortDate('2026-02-30')).toBe('Data indisponível');
  });
});
