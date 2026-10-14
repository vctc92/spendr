import { ArrowLeftRight, CloudOff } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

import { AmountText, spokenAmount } from '@/components/finance/AmountText';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Icon } from '@/components/ui/Icon';
import { Text } from '@/components/ui/Text';
import { cn } from '@/lib/cn';
import { DEFAULT_LOCALE } from '@/lib/format';
import { t } from '@/lib/i18n';
import { needLevelClass, type NeedLevel } from '@/theme/tokens';

/** View model: the ledger maps stored transactions into this shape (T6). */
export type TransactionRowData = {
  id: string;
  title: string;
  type: 'expense' | 'income' | 'transfer';
  /** Magnitude in minor units; `type` decides the sign. */
  amountMinor: number;
  currency: string;
  memberName: string;
  /** "Groceries", or the two account names for a transfer. */
  categoryLabel: string;
  accountLabel?: string;
  /** Expenses only. */
  needLevel?: NeedLevel | null;
  tags?: readonly string[];
  /** "Today", "28 Sep": formatted by the caller. */
  dateLabel: string;
  pendingSync?: boolean;
};

type Props = {
  transaction: TransactionRowData;
  onPress?: () => void;
  locale?: string;
};

const SIGN = { expense: -1, income: 1, transfer: 1 } as const;

export function TransactionRow({ transaction: tx, onPress, locale = DEFAULT_LOCALE }: Props) {
  const signed = tx.amountMinor * SIGN[tx.type];
  const details = [tx.categoryLabel, tx.accountLabel].filter(Boolean).join(' · ');
  const firstTag = tx.tags?.[0];
  const spoken = spokenAmount(
    signed,
    tx.currency,
    tx.type === 'transfer' ? 'never' : 'always',
    locale
  );

  const corner = tx.pendingSync ? (
    <View className="h-4 w-4 items-center justify-center rounded-full border border-card bg-muted">
      <Icon icon={CloudOff} size={10} className="text-muted-foreground" />
    </View>
  ) : tx.type === 'transfer' ? (
    <View className="h-4 w-4 items-center justify-center rounded-full border border-card bg-muted">
      <Icon icon={ArrowLeftRight} size={10} className="text-muted-foreground" />
    </View>
  ) : tx.needLevel ? (
    <View
      className={cn('h-3 w-3 rounded-full border-2 border-card', needLevelClass[tx.needLevel])}
    />
  ) : null;

  const content = (
    <>
      <Avatar name={tx.memberName} size="lg" tone={tx.type === 'income' ? 'primary' : 'default'}>
        {corner}
      </Avatar>
      <View className="flex-1 gap-0.5">
        <View className="flex-row flex-wrap items-center gap-2">
          <Text className="shrink">{tx.title}</Text>
          {firstTag ? <Badge label={`#${firstTag}`} /> : null}
          {tx.pendingSync ? <Badge label={t('tx.pendingSync')} /> : null}
        </View>
        <Text variant="label" tone="muted">
          {details}
        </Text>
      </View>
      <View className="items-end gap-0.5">
        <AmountText
          amountMinor={signed}
          currency={tx.currency}
          locale={locale}
          tone={tx.type === 'income' ? 'credit' : 'neutral'}
          sign={tx.type === 'transfer' ? 'never' : 'always'}
        />
        <Text variant="caption" tone="muted">
          {tx.dateLabel}
        </Text>
      </View>
    </>
  );

  const rowClass = cn(
    'min-h-[64px] flex-row items-center gap-3 py-3',
    tx.pendingSync && 'opacity-80'
  );
  const label = t('tx.accessibleRow', {
    title: tx.title,
    details,
    amount: spoken,
    date: tx.dateLabel,
  });

  if (!onPress) {
    return (
      <View accessible accessibilityLabel={label} className={rowClass}>
        {content}
      </View>
    );
  }
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      className={cn(rowClass, 'active:bg-muted')}>
      {content}
    </Pressable>
  );
}
