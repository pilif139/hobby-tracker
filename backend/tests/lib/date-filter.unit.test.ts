import { describe, expect, it } from 'vitest';
import { FILTER_MIN_DATE, parseDateFilter } from '@/src/lib/date-filter';

describe('date-filter utils (unit)', () => {
  it('parses leap day correctly', () => {
    const result = parseDateFilter('2024-02-29T12:00:00.000Z');

    expect(result.error).toBeNull();
    expect(result.date?.toISOString()).toBe('2024-02-29T12:00:00.000Z');
  });

  it('returns before-min-date for values older than min date', () => {
    const result = parseDateFilter('1999-12-31T23:59:59.000Z', {
      minDate: FILTER_MIN_DATE,
    });

    expect(result.date).toBeNull();
    expect(result.error).toBe('before-min-date');
  });

  it('returns after-max-date for future values above max date', () => {
    const maxDate = new Date('2026-01-31T23:59:59.000Z');
    const result = parseDateFilter('2026-02-01T00:00:00.000Z', { maxDate });

    expect(result.date).toBeNull();
    expect(result.error).toBe('after-max-date');
  });
});
