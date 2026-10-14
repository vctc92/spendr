import { cva, type VariantProps } from 'class-variance-authority';
import { ActivityIndicator, Pressable, type PressableProps } from 'react-native';

import { Icon } from '@/components/ui/Icon';
import { Text } from '@/components/ui/Text';
import { cn } from '@/lib/cn';
import { useThemeColors } from '@/lib/useThemeColors';
import type { LucideIcon } from 'lucide-react-native';

const buttonVariants = cva('flex-row items-center justify-center gap-2 rounded-lg', {
  variants: {
    variant: {
      primary: 'bg-primary active:opacity-80',
      secondary: 'border border-border bg-card active:bg-muted',
      ghost: 'active:bg-muted',
      destructive: 'border border-border bg-card active:bg-muted',
    },
    size: {
      md: 'min-h-[44px] px-4',
      sm: 'min-h-[32px] px-3',
    },
    disabled: { true: 'opacity-50', false: '' },
  },
  defaultVariants: { variant: 'primary', size: 'md', disabled: false },
});

const labelClass = {
  primary: 'text-primary-foreground',
  secondary: 'text-foreground',
  ghost: 'text-foreground',
  destructive: 'text-destructive',
} as const;

type Variant = NonNullable<VariantProps<typeof buttonVariants>['variant']>;

type Props = Omit<PressableProps, 'children'> & {
  label: string;
  variant?: Variant;
  size?: 'md' | 'sm';
  loading?: boolean;
  leftIcon?: LucideIcon;
  className?: string;
};

export function Button({
  label,
  variant = 'primary',
  size = 'md',
  loading = false,
  leftIcon,
  disabled,
  className,
  accessibilityLabel,
  ...props
}: Props) {
  const colors = useThemeColors();
  const inactive = Boolean(disabled) || loading;
  // The 32 px visible button still gets a 44 px touch target.
  const hitSlop = size === 'sm' ? 6 : 0;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ disabled: inactive, busy: loading }}
      disabled={inactive}
      hitSlop={hitSlop}
      className={cn(buttonVariants({ variant, size, disabled: Boolean(disabled) }), className)}
      {...props}>
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' ? colors.primaryForeground : colors.foreground}
        />
      ) : leftIcon ? (
        <Icon icon={leftIcon} className={labelClass[variant]} />
      ) : null}
      <Text variant="label" className={labelClass[variant]}>
        {label}
      </Text>
    </Pressable>
  );
}
