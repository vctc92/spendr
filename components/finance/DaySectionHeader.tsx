import { isSameDay, parseISO, subDays } from 'date-fns';
import { View } from 'react-native';

import { AmountText } from '@/components/finance/AmountText';
import { Text } from '@/components/ui/Text';
import { DEFAULT_LOCALE, formatCalendarDay } from '@/lib/format';
import { t } from '@/lib/i18n';

type Props = {
  /** Calendar day, YYYY-MM-DD, already resolved in the household time zone. */
  date: string;
  /** Today in the same form; passed in so "today" is decided upstream (AGENTS §8). */
  today: string;
  /** Spend for the day only: income and transfers are excluded (D-019). */
  totalMinor: number;
  currency: string;
  locale?: string;
};

export function DaySectionHeader({
  date,
  today,
  totalMinor,
  currency,
  locale = DEFAULT_LOCALE,
}: Props) {
  const day = parseISO(date);
  const now = parseISO(today);
  const formatted = formatCalendarDay(date, locale);
  const relative = isSameDay(day, now)
    ? t('day.today')
    : isSameDay(day, subDays(now, 1))
      ? t('day.yesterday')
      : null;

  return (
    <View className="flex-row items-baseline justify-between gap-3 px-1 pb-2 pt-4">
      <Text variant="heading" accessibilityRole="header">
        {relative ? `${relative} · ${formatted}` : formatted}
      </Text>
      <View className="flex-row items-baseline gap-2">
        <Text variant="caption" tone="muted">
          {t('day.total')}
        </Text>
        <AmountText amountMinor={totalMinor} currency={currency} locale={locale} />
      </View>
    </View>
  );
}
