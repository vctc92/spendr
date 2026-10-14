import { cva, type VariantProps } from 'class-variance-authority';
import { View, type ViewProps } from 'react-native';

import { cn } from '@/lib/cn';

// Flat by design: hairline border, no shadow (D-024).
const cardVariants = cva('rounded-xl', {
  variants: {
    variant: {
      default: 'border border-border bg-card',
      inset: 'bg-muted',
    },
    padding: {
      none: '',
      sm: 'p-3',
      md: 'p-4',
    },
  },
  defaultVariants: { variant: 'default', padding: 'md' },
});

type Props = ViewProps & VariantProps<typeof cardVariants>;

export function Card({ variant, padding, className, ...props }: Props) {
  return <View className={cn(cardVariants({ variant, padding }), className)} {...props} />;
}
