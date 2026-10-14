import { cva } from 'class-variance-authority';
import type { LucideIcon } from 'lucide-react-native';
import { View } from 'react-native';

import { Icon } from '@/components/ui/Icon';
import { Text } from '@/components/ui/Text';
import { cn } from '@/lib/cn';

// Tinted fill with foreground text; meaning is carried by the icon or label, not colour alone.
const badgeVariants = cva('min-h-[24px] flex-row items-center gap-1 self-start rounded-full px-2', {
  variants: {
    tone: {
      neutral: 'bg-muted',
      primary: 'bg-primary/15',
      credit: 'bg-credit/15',
      warning: 'bg-warning/15',
      debit: 'bg-debit/15',
    },
  },
  defaultVariants: { tone: 'neutral' },
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
  className?: string;
};

export function Badge({ label, tone = 'neutral', icon, className }: Props) {
  return (
    <View className={cn(badgeVariants({ tone }), className)}>
      {icon ? <Icon icon={icon} size={12} className={iconClass[tone]} /> : null}
      <Text variant="caption">{label}</Text>
    </View>
  );
}
