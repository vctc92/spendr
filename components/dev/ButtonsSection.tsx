import { Plus, Settings, X } from 'lucide-react-native';
import { View } from 'react-native';

import { Section } from '@/components/dev/Section';
import { Button } from '@/components/ui/Button';
import { IconButton } from '@/components/ui/IconButton';
import { Text } from '@/components/ui/Text';
import { t } from '@/lib/i18n';

const VARIANTS = ['primary', 'secondary', 'ghost', 'destructive'] as const;
const ICON_VARIANTS = ['ghost', 'tonal', 'primary'] as const;

export function ButtonsSection() {
  return (
    <Section title={t('gallery.section.buttons')}>
      <View className="gap-3 rounded-xl border border-border bg-card p-4">
        {VARIANTS.map((variant) => (
          <View key={variant} className="gap-2">
            <Text variant="caption" tone="muted">
              {variant}
            </Text>
            <View className="flex-row flex-wrap items-center gap-2">
              <Button variant={variant} label={t('gallery.sample.save')} />
              <Button variant={variant} size="sm" label={t('gallery.sample.state.small')} />
              <Button variant={variant} leftIcon={Plus} label={t('gallery.sample.add')} />
              <Button variant={variant} loading label={t('gallery.sample.state.loading')} />
              <Button variant={variant} disabled label={t('gallery.sample.state.disabled')} />
            </View>
          </View>
        ))}
        {ICON_VARIANTS.map((variant) => (
          <View key={variant} className="gap-2">
            <Text variant="caption" tone="muted">
              IconButton {variant}
            </Text>
            <View className="flex-row items-center gap-3">
              <IconButton variant={variant} icon={X} accessibilityLabel={t('common.close')} />
              <IconButton
                variant={variant}
                size="sm"
                icon={Settings}
                accessibilityLabel={t('gallery.sample.state.small')}
              />
              <IconButton
                variant={variant}
                disabled
                icon={Plus}
                accessibilityLabel={t('gallery.sample.state.disabled')}
              />
            </View>
          </View>
        ))}
      </View>
    </Section>
  );
}
