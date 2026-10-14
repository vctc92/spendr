import { cva, type VariantProps } from 'class-variance-authority';
import { Text as RNText, type TextProps as RNTextProps } from 'react-native';

import { cn } from '@/lib/cn';

const textVariants = cva('', {
  variants: {
    variant: {
      display: 'font-sans-semibold text-display',
      title: 'font-sans-semibold text-title',
      heading: 'font-sans-semibold text-heading',
      body: 'font-sans text-body',
      label: 'font-sans-medium text-label',
      caption: 'font-sans text-caption',
    },
    tone: {
      default: 'text-foreground',
      muted: 'text-muted-foreground',
      primary: 'text-primary',
      credit: 'text-credit',
      debit: 'text-debit',
      warning: 'text-warning',
      onPrimary: 'text-primary-foreground',
    },
    /** Tabular figures so amounts line up in columns. */
    numeric: {
      true: 'tabular-nums',
      false: '',
    },
  },
  defaultVariants: {
    variant: 'body',
    tone: 'default',
    numeric: false,
  },
});

export type TextProps = RNTextProps & VariantProps<typeof textVariants>;

export function Text({ variant, tone, numeric, className, ...props }: TextProps) {
  return <RNText className={cn(textVariants({ variant, tone, numeric }), className)} {...props} />;
}
