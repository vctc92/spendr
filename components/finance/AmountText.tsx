import { Text } from '@/components/ui/Text';
import { DEFAULT_LOCALE, formatMoney, formatSpokenMoney, type SignMode } from '@/lib/format';
import { t } from '@/lib/i18n';

const SIZE_VARIANT = { display: 'display', body: 'body', caption: 'caption' } as const;
const TONE = { neutral: 'default', credit: 'credit', debit: 'debit' } as const;

type Props = {
  /** Integer minor units (paise, cents). */
  amountMinor: number;
  currency: string;
  size?: keyof typeof SIZE_VARIANT;
  tone?: keyof typeof TONE;
  sign?: SignMode;
  locale?: string;
  className?: string;
};

/** Spoken form for screen readers, e.g. "minus 2,340 Indian rupees". */
export function spokenAmount(
  amountMinor: number,
  currency: string,
  sign: SignMode,
  locale: string
): string {
  const words = formatSpokenMoney(amountMinor, currency, locale);
  if (sign !== 'never' && amountMinor < 0) return t('money.spoken.minus', { amount: words });
  if (sign === 'always' && amountMinor > 0) return t('money.spoken.plus', { amount: words });
  return words;
}

export function AmountText({
  amountMinor,
  currency,
  size = 'body',
  tone = 'neutral',
  sign = 'auto',
  locale = DEFAULT_LOCALE,
  className,
}: Props) {
  return (
    <Text
      numeric
      variant={SIZE_VARIANT[size]}
      tone={TONE[tone]}
      accessibilityLabel={spokenAmount(amountMinor, currency, sign, locale)}
      className={className}>
      {formatMoney(amountMinor, currency, { locale, sign })}
    </Text>
  );
}
