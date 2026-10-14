import type * as React from 'react';
import { View } from 'react-native';

import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { Text } from '@/components/ui/Text';
import { cn } from '@/lib/cn';
import { t } from '@/lib/i18n';

type Props = {
  label: string;
  /** Usually an AmountText; any node works so percentages and counts fit too. */
  value?: React.ReactNode;
  /** Usually a DeltaBadge. */
  delta?: React.ReactNode;
  /** Text next to the delta, e.g. "vs same day last month". */
  deltaCaption?: string;
  /** Period pill in the top right, e.g. "September". */
  period?: string;
  size?: 'hero' | 'compact';
  loading?: boolean;
  /** Shown instead of the value when there is nothing to report yet. */
  empty?: boolean;
  emptyLabel?: string;
  className?: string;
};

export function StatCard({
  label,
  value,
  delta,
  deltaCaption,
  period,
  size = 'compact',
  loading = false,
  empty = false,
  emptyLabel,
  className,
}: Props) {
  const hero = size === 'hero';

  return (
    <Card className={cn('gap-2', className)}>
      <View className="flex-row items-center justify-between gap-2">
        <Text variant={hero ? 'body' : 'label'} tone="muted" className="flex-1">
          {label}
        </Text>
        {period ? <Badge label={period} /> : null}
      </View>
      {loading ? (
        <View accessibilityLabel={t('common.loading')} className="gap-2">
          <Skeleton className={hero ? 'h-10 w-40' : 'h-6 w-24'} />
          <Skeleton className="h-6 w-32" />
        </View>
      ) : empty ? (
        <Text tone="muted">{emptyLabel ?? t('statCard.empty')}</Text>
      ) : (
        <>
          {value}
          {delta || deltaCaption ? (
            <View className="flex-row flex-wrap items-center gap-2">
              {delta}
              {deltaCaption ? (
                <Text variant="label" tone="muted">
                  {deltaCaption}
                </Text>
              ) : null}
            </View>
          ) : null}
        </>
      )}
    </Card>
  );
}
