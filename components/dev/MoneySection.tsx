import { View } from 'react-native';

import { Section } from '@/components/dev/Section';
import { AmountText } from '@/components/finance/AmountText';
import { DeltaBadge } from '@/components/finance/DeltaBadge';
import { StatCard } from '@/components/finance/StatCard';
import { Text } from '@/components/ui/Text';
import { t } from '@/lib/i18n';

const CARD = 'gap-3 rounded-xl border border-border bg-card p-4';

export function MoneySection() {
  return (
    <>
      <Section title={t('gallery.section.amounts')}>
        <View className={CARD}>
          <AmountText amountMinor={12_345_600} currency="INR" size="display" />
          <AmountText amountMinor={12_345_600} currency="INR" />
          <AmountText amountMinor={12_345_600} currency="INR" size="caption" />
          <AmountText amountMinor={-234_000} currency="INR" tone="debit" />
          <AmountText amountMinor={14_500_000} currency="INR" tone="credit" sign="always" />
          <AmountText amountMinor={123_450} currency="USD" locale="en-US" />
          <AmountText amountMinor={12_350} currency="INR" />
        </View>
      </Section>

      <Section title={t('gallery.section.deltas')}>
        <View className={CARD}>
          <Text variant="caption" tone="muted">
            spend
          </Text>
          <View className="flex-row flex-wrap gap-2">
            <DeltaBadge current={4_238_000} previous={3_815_000} kind="spend" currency="INR" />
            <DeltaBadge current={3_400_000} previous={3_815_000} kind="spend" currency="INR" />
            <DeltaBadge current={3_815_000} previous={3_815_000} kind="spend" currency="INR" />
            <DeltaBadge current={3_815_000} previous={null} kind="spend" currency="INR" />
          </View>
          <Text variant="caption" tone="muted">
            income and savings
          </Text>
          <View className="flex-row flex-wrap gap-2">
            <DeltaBadge current={5_000_000} previous={4_000_000} kind="income" currency="INR" />
            <DeltaBadge current={3_000_000} previous={4_000_000} kind="savings" currency="INR" />
          </View>
        </View>
      </Section>

      <Section title={t('gallery.section.statCards')}>
        <StatCard
          size="hero"
          label={t('gallery.sample.spentThisMonth')}
          period={t('gallery.sample.september')}
          value={<AmountText amountMinor={4_238_000} currency="INR" size="display" />}
          delta={
            <DeltaBadge current={4_238_000} previous={3_815_000} kind="spend" currency="INR" />
          }
          deltaCaption={t('gallery.sample.vsSameDay')}
        />
        <View className="flex-row gap-3">
          <StatCard
            className="flex-1"
            label={t('gallery.sample.essentials')}
            value={<AmountText amountMinor={5_120_000} currency="INR" size="body" />}
          />
          <StatCard
            className="flex-1"
            label={t('gallery.sample.savingsRate')}
            value={<Text variant="heading">34%</Text>}
          />
        </View>
        <StatCard size="hero" loading label={t('gallery.sample.spentThisMonth')} />
        <StatCard empty label={t('gallery.sample.savingsRate')} />
      </Section>
    </>
  );
}
