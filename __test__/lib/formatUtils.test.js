import { formatTimeLabel } from '@/lib/formatUtils';

describe('formatTimeLabel', () => {
  test('return 12:00 AM for 0', () => {
    expect(formatTimeLabel(0)).toBe('12:00 AM');
  });

  test('formats 1 AM correctly', () => {
    const result = formatTimeLabel(1);
    expect(result).toBe('1:00 AM');
  });

  test('formats 6 AM correctly', () => {
    const result = formatTimeLabel(6);
    expect(result).toBe('6:00 AM');
  });

  test('formats 11 AM correctly', () => {
    const result = formatTimeLabel(11);
    expect(result).toBe('11:00 AM');
  });

  test('formats noon (12) as 12:00 PM', () => {
    const result = formatTimeLabel(12);
    expect(result).toBe('12:00 PM');
  });

  test('formats 1 PM (13) correctly', () => {
    const result = formatTimeLabel(13);
    expect(result).toBe('1:00 PM');
  });

  test('formats 6 PM (18) correctly', () => {
    const result = formatTimeLabel(18);
    expect(result).toBe('6:00 PM');
  });

  test('formats 11 PM (23) correctly', () => {
    const result = formatTimeLabel(23);
    expect(result).toBe('11:00 PM');
  });

  test('formats 24 as 12:00 PM', () => {
    const result = formatTimeLabel(24);
    expect(result).toBe('12:00 PM');
  });
});
