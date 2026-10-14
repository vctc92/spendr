import { describe, expect, it } from '@jest/globals';

import {
  formatCalendarDay,
  formatCompactMoney,
  formatMoney,
  formatSpokenMoney,
} from '@/lib/format';

describe('formatMoney', () => {
  it('groups rupees the Indian way', () => {
    expect(formatMoney(12_345_600, 'INR')).toBe('₹1,23,456');
    expect(formatMoney(234_000, 'INR')).toBe('₹2,340');
  });

  it('formats dollars with western grouping and cents', () => {
    expect(formatMoney(12_345_600, 'USD', { locale: 'en-US' })).toBe('$123,456');
    expect(formatMoney(123_450, 'USD', { locale: 'en-US' })).toBe('$1,234.50');
  });

  it('keeps paise when the amount is not whole', () => {
    expect(formatMoney(12_350, 'INR')).toBe('₹123.50');
  });

  it('shows the minus for negatives and a plus only when asked', () => {
    expect(formatMoney(-234_000, 'INR')).toBe('-₹2,340');
    expect(formatMoney(14_500_000, 'INR', { sign: 'always' })).toBe('+₹1,45,000');
    expect(formatMoney(14_500_000, 'INR')).toBe('₹1,45,000');
    expect(formatMoney(-234_000, 'INR', { sign: 'never' })).toBe('₹2,340');
  });

  it('never prefixes a sign on zero', () => {
    expect(formatMoney(0, 'INR', { sign: 'always' })).toBe('₹0');
  });
});

describe('formatCompactMoney', () => {
  it.each([
    [3_110_000_00, '₹31.1 L'],
    [9_650_000_00, '₹96.5 L'],
    [2_890_000_000_0, '₹28.9 Cr'],
    [500_000_000_0, '₹5.0 Cr'],
    [343_000_000_0, '₹3.43 Cr'],
    [300_000_000_0, '₹3.0 Cr'],
    [157_000_000_0, '₹1.57 Cr'],
    [17_300_000_0, '₹17.3 L'],
  ])('formats %p as %p (PRD §6.2 and §6.4)', (minor, expected) => {
    expect(formatCompactMoney(minor, 'INR')).toBe(expected);
  });

  it('falls back to full format below a lakh', () => {
    expect(formatCompactMoney(9_999_900, 'INR')).toBe('₹99,999');
  });

  it('keeps the sign', () => {
    expect(formatCompactMoney(-3_110_000_00, 'INR')).toBe('-₹31.1 L');
    expect(formatCompactMoney(3_110_000_00, 'INR', { sign: 'always' })).toBe('+₹31.1 L');
  });

  it('uses locale compact notation for other currencies', () => {
    expect(formatCompactMoney(123_456_700, 'USD', { locale: 'en-US' })).toBe('$1.2M');
  });
});

describe('formatSpokenMoney', () => {
  it('spells out the currency', () => {
    expect(formatSpokenMoney(120_000, 'INR')).toBe('1,200 Indian rupees');
    expect(formatSpokenMoney(120_050, 'USD', 'en-US')).toBe('1,200.50 US dollars');
  });

  it('drops the sign (callers say it in words)', () => {
    expect(formatSpokenMoney(-120_000, 'INR')).toBe('1,200 Indian rupees');
  });
});

describe('formatCalendarDay', () => {
  it('formats a calendar day without time zone drift', () => {
    expect(formatCalendarDay('2026-10-13', 'en-IN')).toBe('13 Oct');
    expect(formatCalendarDay('2026-03-01', 'en-US')).toBe('Mar 1');
  });
});
