import { Redirect } from 'expo-router';
import * as React from 'react';
import { useColorScheme } from 'nativewind';
import { Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ButtonsSection } from '@/components/dev/ButtonsSection';
import { ControlsSection } from '@/components/dev/ControlsSection';
import { DisplaySection } from '@/components/dev/DisplaySection';
import { FormSection } from '@/components/dev/FormSection';
import { OverlaySection } from '@/components/dev/OverlaySection';
import { Section } from '@/components/dev/Section';
import { Text } from '@/components/ui/Text';
import { ToastProvider } from '@/components/ui/Toast';
import { cn } from '@/lib/cn';
import { t, type TranslationKey } from '@/lib/i18n';
import {
  needLevelClass,
  tokens,
  type ColorScheme,
  type ColorToken,
  type NeedLevel,
} from '@/theme/tokens';

type Variant = 'display' | 'title' | 'heading' | 'body' | 'label' | 'caption';
type Tone = 'default' | 'muted' | 'primary' | 'credit' | 'debit' | 'warning' | 'onPrimary';
type Mode = 'system' | 'light' | 'dark';

const VARIANTS: Variant[] = ['display', 'title', 'heading', 'body', 'label', 'caption'];
const TONES: Tone[] = ['default', 'muted', 'primary', 'credit', 'debit', 'warning', 'onPrimary'];
const MODES: { mode: Mode; label: TranslationKey }[] = [
  { mode: 'system', label: 'gallery.appearance.system' },
  { mode: 'light', label: 'gallery.appearance.light' },
  { mode: 'dark', label: 'gallery.appearance.dark' },
];

// Full class strings so Tailwind can see them at build time.
const SWATCHES: { token: ColorToken; name: string; className: string }[] = [
  { token: 'background', name: 'background', className: 'bg-background' },
  { token: 'card', name: 'card', className: 'bg-card' },
  { token: 'foreground', name: 'foreground', className: 'bg-foreground' },
  { token: 'muted', name: 'muted', className: 'bg-muted' },
  { token: 'mutedForeground', name: 'muted-foreground', className: 'bg-muted-foreground' },
  { token: 'border', name: 'border', className: 'bg-border' },
  { token: 'primary', name: 'primary', className: 'bg-primary' },
  { token: 'primaryForeground', name: 'primary-foreground', className: 'bg-primary-foreground' },
  { token: 'destructive', name: 'destructive', className: 'bg-destructive' },
  {
    token: 'destructiveForeground',
    name: 'destructive-foreground',
    className: 'bg-destructive-foreground',
  },
  { token: 'credit', name: 'credit', className: 'bg-credit' },
  { token: 'debit', name: 'debit', className: 'bg-debit' },
  { token: 'warning', name: 'warning', className: 'bg-warning' },
  { token: 'creditText', name: 'credit-text', className: 'bg-credit-text' },
  { token: 'warningText', name: 'warning-text', className: 'bg-warning-text' },
  { token: 'needMust', name: 'need-must', className: 'bg-need-must' },
  { token: 'needNecessary', name: 'need-necessary', className: 'bg-need-necessary' },
  { token: 'needNice', name: 'need-nice', className: 'bg-need-nice' },
  { token: 'needAvoidable', name: 'need-avoidable', className: 'bg-need-avoidable' },
];

const NEED_LEVELS: NeedLevel[] = ['must_have', 'necessary', 'nice_to_have', 'avoidable'];

function ModeToggle({ mode, onChange }: { mode: Mode; onChange: (mode: Mode) => void }) {
  return (
    <View className="flex-row gap-2">
      {MODES.map((m) => (
        <Pressable
          key={m.mode}
          accessibilityRole="button"
          accessibilityLabel={t(m.label)}
          accessibilityState={{ selected: mode === m.mode }}
          onPress={() => onChange(m.mode)}
          className={cn(
            'min-h-[44px] flex-1 items-center justify-center rounded-lg border border-border',
            mode === m.mode ? 'border-primary bg-primary' : 'bg-card'
          )}>
          <Text variant="label" tone={mode === m.mode ? 'onPrimary' : 'default'}>
            {t(m.label)}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

function Swatches({ scheme }: { scheme: ColorScheme }) {
  return (
    <View className="gap-2">
      {SWATCHES.map((s) => (
        <View key={s.token} className="flex-row items-center gap-3">
          <View className={cn('h-8 w-8 rounded-lg border border-border', s.className)} />
          <View className="flex-1">
            <Text variant="label">{s.name}</Text>
            <Text variant="caption" tone="muted" numeric>
              {tokens.color[scheme][s.token]}
            </Text>
          </View>
        </View>
      ))}
      <View className="flex-row items-center gap-3">
        <View className="h-8 w-8 overflow-hidden rounded-lg border border-border bg-card">
          <View className="h-8 w-8 bg-scrim" />
        </View>
        <View className="flex-1">
          <Text variant="label">scrim</Text>
          <Text variant="caption" tone="muted" numeric>
            {tokens.color[scheme].scrim}
          </Text>
          <Text variant="caption" tone="muted">
            {t('gallery.swatch.scrimNote')}
          </Text>
        </View>
      </View>
    </View>
  );
}

function Gallery() {
  const insets = useSafeAreaInsets();
  const { colorScheme, setColorScheme } = useColorScheme();
  const scheme: ColorScheme = colorScheme === 'dark' ? 'dark' : 'light';
  const [mode, setMode] = React.useState<Mode>('system');

  const onChangeMode = (next: Mode) => {
    setMode(next);
    setColorScheme(next);
  };

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="gap-8 px-4 pb-12"
      contentContainerStyle={{ paddingTop: insets.top + 16 }}>
      <Text variant="title" accessibilityRole="header">
        {t('gallery.title')}
      </Text>

      <Section title={t('gallery.appearance')}>
        <ModeToggle mode={mode} onChange={onChangeMode} />
      </Section>

      <Section title={t('gallery.section.text')}>
        <View className="gap-3 rounded-xl border border-border bg-card p-4">
          {VARIANTS.map((v) => (
            <View key={v}>
              <Text variant="caption" tone="muted">
                {v}
              </Text>
              <Text variant={v}>{t('gallery.sample.text')}</Text>
            </View>
          ))}
          <View>
            <Text variant="caption" tone="muted">
              {t('gallery.sample.numericLabel')}
            </Text>
            <Text variant="display" numeric>
              {t('gallery.sample.numeric')}
            </Text>
          </View>
        </View>
      </Section>

      <Section title={t('gallery.section.tones')}>
        <View className="gap-2 rounded-xl border border-border bg-card p-4">
          {TONES.map((tone) => (
            <View
              key={tone}
              className={cn('rounded-lg px-3 py-2', tone === 'onPrimary' && 'bg-primary')}>
              <Text tone={tone}>{tone}</Text>
            </View>
          ))}
        </View>
      </Section>

      <Section title={t('gallery.section.colors')}>
        <Swatches scheme={scheme} />
      </Section>

      <Section title={t('gallery.section.need')}>
        <View className="gap-3 rounded-xl border border-border bg-card p-4">
          {NEED_LEVELS.map((level) => (
            <View key={level} className="flex-row items-center gap-3">
              <View className={cn('h-3 w-3 rounded-full', needLevelClass[level])} />
              <Text>{t(`need.${level}`)}</Text>
            </View>
          ))}
        </View>
      </Section>

      <ButtonsSection />
      <FormSection />
      <ControlsSection />
      <DisplaySection />
      <OverlaySection />
    </ScrollView>
  );
}

export default function GalleryRoute() {
  // The route file ships in production bundles; this keeps it unreachable there.
  if (!__DEV__) return <Redirect href="/" />;
  return (
    <ToastProvider>
      <Gallery />
    </ToastProvider>
  );
}
