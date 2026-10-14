// Money is stored as integers in minor units; the only place it becomes a decimal is here, at display.

export const DEFAULT_LOCALE = 'en-IN';

export type SignMode = 'auto' | 'always' | 'never';

type FormatOptions = {
  locale?: string;
  /** `auto` shows "-" for negatives, `always` also shows "+" for positives, `never` shows neither. */
  sign?: SignMode;
};

const LAKH = 100_000;
const CRORE = 10_000_000;

function minorDigits(currency: string, locale: string): number {
  const digits = new Intl.NumberFormat(locale, { style: 'currency', currency }).resolvedOptions()
    .maximumFractionDigits;
  return digits ?? 2;
}

function toMajor(amountMinor: number, currency: string, locale: string): number {
  return amountMinor / 10 ** minorDigits(currency, locale);
}

function signPrefix(amountMinor: number, sign: SignMode): string {
  if (sign === 'never') return '';
  if (amountMinor < 0) return '-';
  return sign === 'always' && amountMinor > 0 ? '+' : '';
}

/** "₹1,23,456", "$1,234.50"; whole amounts drop the decimals, as in the designs. */
export function formatMoney(
  amountMinor: number,
  currency: string,
  { locale = DEFAULT_LOCALE, sign = 'auto' }: FormatOptions = {}
): string {
  const major = Math.abs(toMajor(amountMinor, currency, locale));
  const digits = minorDigits(currency, locale);
  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: Number.isInteger(major) ? 0 : digits,
    maximumFractionDigits: digits,
  });
  return `${signPrefix(amountMinor, sign)}${formatter.format(major)}`;
}

/** Three significant digits, one decimal at least: 31.1, 1.57, 28.9, 5.0 (PRD §6.2, §6.4). */
function threeSignificant(value: number): string {
  const integerDigits = Math.floor(Math.log10(value)) + 1;
  const text = value.toFixed(Math.max(1, 3 - integerDigits));
  // "5.00" reads as "5.0": a second decimal is only kept when it is non-zero.
  return /\.\d0$/.test(text) ? text.slice(0, -1) : text;
}

/** "₹31.1 L", "₹3.43 Cr" for INR; the locale's compact notation for other currencies. */
export function formatCompactMoney(
  amountMinor: number,
  currency: string,
  { locale = DEFAULT_LOCALE, sign = 'auto' }: FormatOptions = {}
): string {
  const major = Math.abs(toMajor(amountMinor, currency, locale));
  const prefix = signPrefix(amountMinor, sign);

  if (currency === 'INR' && major >= LAKH) {
    const symbol = new Intl.NumberFormat(locale, { style: 'currency', currency })
      .formatToParts(0)
      .find((part) => part.type === 'currency')?.value;
    const [scaled, unit] = major >= CRORE ? [major / CRORE, 'Cr'] : [major / LAKH, 'L'];
    return `${prefix}${symbol}${threeSignificant(scaled)} ${unit}`;
  }
  if (currency === 'INR') return formatMoney(amountMinor, currency, { locale, sign });

  const compact = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    notation: 'compact',
    maximumFractionDigits: 1,
  });
  return `${prefix}${compact.format(major)}`;
}

/** Full-word amount for screen readers, e.g. "1,200 Indian rupees". The sign word is added by callers. */
export function formatSpokenMoney(
  amountMinor: number,
  currency: string,
  locale: string = DEFAULT_LOCALE
): string {
  const major = Math.abs(toMajor(amountMinor, currency, locale));
  const digits = minorDigits(currency, locale);
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    currencyDisplay: 'name',
    minimumFractionDigits: Number.isInteger(major) ? 0 : digits,
    maximumFractionDigits: digits,
  }).format(major);
}

/** "13 Oct" for a calendar day given as YYYY-MM-DD (resolved in the household time zone by the caller). */
export function formatCalendarDay(isoDay: string, locale: string = DEFAULT_LOCALE): string {
  const [year = 0, month = 1, day = 1] = isoDay.split('-').map(Number);
  // UTC avoids the device time zone shifting a pure calendar date.
  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'short',
    timeZone: 'UTC',
  }).format(new Date(Date.UTC(year, month - 1, day)));
}
