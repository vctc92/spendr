import { cva } from 'class-variance-authority';
import type { LucideIcon } from 'lucide-react-native';
import { View } from 'react-native';

import { Icon } from '@/components/ui/Icon';
import { Text } from '@/components/ui/Text';
import { cn } from '@/lib/cn';

// Tinted fill with foreground text; meaning is carried by the icon or label, not colour alone.
const badgeVariants = cva('flex-row items-center gap-1 self-start rounded-full', {
  variants: {
    size: {
      sm: 'min-h-[24px] px-2',
      md: 'min-h-[28px] px-3',
    },
    tone: {
      neutral: 'bg-muted',
      primary: 'bg-primary/15',
      credit: 'bg-credit/15',
      warning: 'bg-warning/15',
      debit: 'bg-debit/15',
    },
  },
  defaultVariants: { tone: 'neutral', size: 'sm' },
});

const iconClass = {
  neutral: 'text-muted-foreground',
  primary: 'text-primary',
  credit: 'text-credit-text',
  warning: 'text-warning-text',
  debit: 'text-debit',
} as const;

type Props = {
  label: string;
  tone?: keyof typeof iconClass;
  icon?: LucideIcon;
  size?: 'sm' | 'md';
  /** Overrides the visible label for screen readers, e.g. a spoken amount. */
  accessibilityLabel?: string;
  className?: string;
};

export function Badge({
  label,
  tone = 'neutral',
  icon,
  size = 'sm',
  accessibilityLabel,
  className,
}: Props) {
  return (
    <View
      accessible
      accessibilityLabel={accessibilityLabel ?? label}
      className={cn(badgeVariants({ tone, size }), className)}>
      {icon ? (
        <Icon icon={icon} size={size === 'md' ? 16 : 12} className={iconClass[tone]} />
      ) : null}
      <Text variant={size === 'md' ? 'label' : 'caption'}>{label}</Text>
    </View>
  );
}
