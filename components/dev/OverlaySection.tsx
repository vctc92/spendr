import { Check } from 'lucide-react-native';
import * as React from 'react';
import { View } from 'react-native';

import { Section } from '@/components/dev/Section';
import { Button } from '@/components/ui/Button';
import { Sheet } from '@/components/ui/Sheet';
import { Text } from '@/components/ui/Text';
import { useToast } from '@/components/ui/Toast';
import { t } from '@/lib/i18n';

export function OverlaySection() {
  const [open, setOpen] = React.useState(false);
  const { show } = useToast();

  return (
    <Section title={t('gallery.section.overlays')}>
      <View className="flex-row gap-2">
        <Button
          variant="secondary"
          label={t('gallery.sample.openSheet')}
          onPress={() => setOpen(true)}
        />
        <Button
          variant="secondary"
          label={t('gallery.sample.showToast')}
          onPress={() => show(t('gallery.sample.toast'), { icon: Check })}
        />
      </View>
      <Sheet visible={open} onClose={() => setOpen(false)} title={t('gallery.sample.sheetTitle')}>
        <Text tone="muted">{t('gallery.sample.sheetBody')}</Text>
      </Sheet>
    </Section>
  );
}
