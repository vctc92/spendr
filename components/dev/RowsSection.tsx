import { Receipt } from 'lucide-react-native';
import * as React from 'react';
import { View } from 'react-native';

import { Section } from '@/components/dev/Section';
import { ConfirmSheet } from '@/components/finance/ConfirmSheet';
import { DaySectionHeader } from '@/components/finance/DaySectionHeader';
import { EmptyState } from '@/components/finance/EmptyState';
import { TransactionRow, type TransactionRowData } from '@/components/finance/TransactionRow';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { t } from '@/lib/i18n';

export function RowsSection() {
  const [confirm, setConfirm] = React.useState<'simple' | 'typed' | null>(null);
  const member = t('gallery.sample.person');
  const base = {
    currency: 'INR',
    memberName: member,
    accountLabel: t('gallery.sample.accountLabel'),
    dateLabel: t('gallery.sample.today'),
  };
  const rows: TransactionRowData[] = [
    {
      ...base,
      id: '1',
      title: t('gallery.sample.bigBasket'),
      type: 'expense',
      amountMinor: 234_000,
      categoryLabel: t('gallery.sample.category'),
      needLevel: 'necessary',
      tags: [t('gallery.sample.weekly')],
    },
    {
      ...base,
      id: '2',
      title: t('gallery.sample.salary'),
      type: 'income',
      amountMinor: 14_500_000,
      categoryLabel: t('gallery.sample.income'),
    },
    {
      ...base,
      id: '3',
      title: t('gallery.sample.toSavings'),
      type: 'transfer',
      amountMinor: 500_000,
      categoryLabel: t('gallery.sample.transfer'),
    },
    {
      ...base,
      id: '4',
      title: t('gallery.sample.food'),
      type: 'expense',
      amountMinor: 50_600,
      categoryLabel: t('gallery.sample.food'),
      needLevel: 'avoidable',
      pendingSync: true,
    },
  ];

  return (
    <>
      <Section title={t('gallery.section.days')}>
        <DaySectionHeader
          date="2026-10-14"
          today="2026-10-14"
          totalMinor={434_600}
          currency="INR"
        />
        <DaySectionHeader
          date="2026-10-13"
          today="2026-10-14"
          totalMinor={212_000}
          currency="INR"
        />
        <DaySectionHeader date="2026-10-11" today="2026-10-14" totalMinor={98_000} currency="INR" />
      </Section>

      <Section title={t('gallery.section.rows')}>
        <Card padding="none" className="px-4">
          {rows.map((row) => (
            <TransactionRow key={row.id} transaction={row} onPress={() => {}} />
          ))}
        </Card>
      </Section>

      <Section title={t('gallery.section.empty')}>
        <Card>
          <EmptyState
            icon={Receipt}
            title={t('gallery.sample.emptyTitle')}
            description={t('gallery.sample.emptyDescription')}
            action={{ label: t('gallery.sample.emptyAction'), onPress: () => {} }}
          />
        </Card>
      </Section>

      <Section title={t('gallery.section.confirm')}>
        <View className="flex-row gap-2">
          <Button
            variant="secondary"
            label={t('gallery.sample.openConfirm')}
            onPress={() => setConfirm('simple')}
          />
          <Button
            variant="secondary"
            label={t('gallery.sample.openConfirmTyped')}
            onPress={() => setConfirm('typed')}
          />
        </View>
        <ConfirmSheet
          visible={confirm === 'simple'}
          title={t('gallery.sample.confirmTitle')}
          message={t('gallery.sample.confirmMessage')}
          confirmLabel={t('gallery.sample.delete')}
          onConfirm={() => setConfirm(null)}
          onCancel={() => setConfirm(null)}
        />
        <ConfirmSheet
          visible={confirm === 'typed'}
          title={t('gallery.sample.confirmTypedTitle')}
          message={t('gallery.sample.confirmTypedMessage')}
          confirmLabel={t('gallery.sample.delete')}
          confirmationText={t('gallery.sample.householdName')}
          onConfirm={() => setConfirm(null)}
          onCancel={() => setConfirm(null)}
        />
      </Section>
    </>
  );
}
