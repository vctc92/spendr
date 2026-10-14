import type { LucideIcon } from 'lucide-react-native';
import { cva } from 'class-variance-authority';
import { Pressable, type PressableProps } from 'react-native';

import { Icon } from '@/components/ui/Icon';
import { cn } from '@/lib/cn';

const iconButtonVariants = cva('items-center justify-center rounded-full', {
  variants: {
    variant: {
      ghost: 'active:bg-muted',
      tonal: 'bg-muted active:opacity-80',
      primary: 'bg-primary active:opacity-80',
    },
    size: {
      md: 'h-11 w-11',
      sm: 'h-8 w-8',
    },
    disabled: { true: 'opacity-50', false: '' },
  },
  defaultVariants: { variant: 'ghost', size: 'md', disabled: false },
});

const iconClass = {
  ghost: 'text-foreground',
  tonal: 'text-foreground',
  primary: 'text-primary-foreground',
} as const;

type Props = Omit<PressableProps, 'children'> & {
  icon: LucideIcon;
  /** Required: an icon alone has no text for screen readers. */
  accessibilityLabel: string;
  variant?: keyof typeof iconClass;
  size?: 'md' | 'sm';
  className?: string;
};

export function IconButton({
  icon,
  variant = 'ghost',
  size = 'md',
  disabled,
  className,
  ...props
}: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: Boolean(disabled) }}
      disabled={disabled}
      // 32 px visible circle, 44 px touch target.
      hitSlop={size === 'sm' ? 6 : 0}
      className={cn(iconButtonVariants({ variant, size, disabled: Boolean(disabled) }), className)}
      {...props}>
      <Icon icon={icon} className={iconClass[variant]} />
    </Pressable>
  );
}
