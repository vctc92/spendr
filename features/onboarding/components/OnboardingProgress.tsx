import { View } from 'react-native';

import { cn } from '@/lib/cn';
import { t } from '@/lib/i18n';

type Props = { step: 1 | 2 | 3; total?: number; className?: string };

export function OnboardingProgress({ step, total = 3, className }: Props) {
  return (
    <View
      accessible
      accessibilityLabel={t('onboarding.progress', { step, total })}
      className={cn('flex-row justify-center gap-2', className)}>
      {Array.from({ length: total }, (_, i) => (
        <View
          key={i}
          className={cn('h-2 rounded-full', i + 1 === step ? 'w-6 bg-primary' : 'w-2 bg-border')}
        />
      ))}
    </View>
  );
}
