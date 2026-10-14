import { cva } from 'class-variance-authority';
import { View } from 'react-native';

import { cn } from '@/lib/cn';

const fillVariants = cva('h-full rounded-full', {
  variants: {
    tone: {
      foreground: 'bg-foreground',
      primary: 'bg-primary',
      warning: 'bg-warning',
      debit: 'bg-debit',
    },
  },
  defaultVariants: { tone: 'primary' },
});

type Props = {
  /** 0 to 1; values outside the range are clamped. */
  value: number;
  tone?: 'foreground' | 'primary' | 'warning' | 'debit';
  accessibilityLabel: string;
  className?: string;
};

export function ProgressBar({ value, tone = 'primary', accessibilityLabel, className }: Props) {
  const clamped = Number.isFinite(value) ? Math.min(1, Math.max(0, value)) : 0;
  const percent = Math.round(clamped * 100);

  return (
    <View
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={{ min: 0, max: 100, now: percent }}
      className={cn('h-2 w-full overflow-hidden rounded-full bg-muted', className)}>
      {/* Width is dynamic, which classes cannot express. */}
      <View className={fillVariants({ tone })} style={{ width: `${percent}%` }} />
    </View>
  );
}
