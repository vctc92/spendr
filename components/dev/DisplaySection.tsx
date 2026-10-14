import { Check, CloudOff } from 'lucide-react-native';
import { View } from 'react-native';

import { Section } from '@/components/dev/Section';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { ListRow } from '@/components/ui/ListRow';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Skeleton } from '@/components/ui/Skeleton';
import { Text } from '@/components/ui/Text';
import { t } from '@/lib/i18n';
import { needLevelClass } from '@/theme/tokens';

const TONES = ['neutral', 'primary', 'credit', 'warning', 'debit'] as const;
const BARS = [
  { tone: 'foreground', value: 0.3 },
  { tone: 'primary', value: 0.6 },
  { tone: 'warning', value: 0.85 },
  { tone: 'debit', value: 1 },
] as const;

export function DisplaySection() {
  const name = t('gallery.sample.person');
  return (
    <>
      <Section title={t('gallery.section.cards')}>
        <Card padding="none" className="px-4">
          <ListRow title={t('gallery.sample.rowTitle')} divider />
          <ListRow
            title={t('gallery.sample.rowTitle')}
            subtitle={t('gallery.sample.rowSubtitle')}
            leading={<Avatar name={name} />}
            divider
          />
          <ListRow
            title={t('gallery.sample.rowTitle')}
            subtitle={t('gallery.sample.rowSubtitle')}
            trailing={<Badge label={t('gallery.sample.pending')} icon={CloudOff} />}
            showChevron
            onPress={() => {}}
          />
        </Card>
        <Card variant="inset">
          <Text>{t('gallery.sample.inset')}</Text>
        </Card>
      </Section>

      <Section title={t('gallery.section.badges')}>
        <View className="flex-row flex-wrap items-center gap-2">
          {TONES.map((tone) => (
            <Badge key={tone} tone={tone} label={t('gallery.sample.synced')} icon={Check} />
          ))}
        </View>
      </Section>

      <Section title={t('gallery.section.avatars')}>
        <View className="flex-row items-center gap-4">
          <Avatar name={name} size="sm" />
          <Avatar name={name} size="md" />
          <Avatar name={name} size="lg" />
          <Avatar name={name} size="lg" tone="primary" />
          <Avatar name={name} size="lg">
            <View
              className={`h-3 w-3 rounded-full border-2 border-card ${needLevelClass.necessary}`}
            />
          </Avatar>
        </View>
      </Section>

      <Section title={t('gallery.section.progress')}>
        <View className="gap-3 rounded-xl border border-border bg-card p-4">
          {BARS.map((bar) => (
            <View key={bar.tone} className="gap-1">
              <Text variant="caption" tone="muted">
                {bar.tone} · {Math.round(bar.value * 100)}%
              </Text>
              <ProgressBar
                tone={bar.tone}
                value={bar.value}
                accessibilityLabel={t('gallery.sample.budget')}
              />
            </View>
          ))}
        </View>
      </Section>

      <Section title={t('gallery.section.skeleton')}>
        <View className="gap-2 rounded-xl border border-border bg-card p-4">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
        </View>
      </Section>
    </>
  );
}
