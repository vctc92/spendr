import { cva } from 'class-variance-authority';
import type * as React from 'react';
import { View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { cn } from '@/lib/cn';

const avatarVariants = cva('items-center justify-center rounded-full', {
  variants: {
    size: { sm: 'h-6 w-6', md: 'h-8 w-8', lg: 'h-10 w-10' },
    tone: { default: 'bg-muted', primary: 'bg-primary/15' },
  },
  defaultVariants: { size: 'md', tone: 'default' },
});

type Props = {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  tone?: 'default' | 'primary';
  /** Rendered on the bottom-right corner, e.g. a need-level dot. */
  children?: React.ReactNode;
  className?: string;
};

export function getInitials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return '?';
  const first = words[0]?.[0] ?? '';
  const last = words.length > 1 ? (words[words.length - 1]?.[0] ?? '') : '';
  return (first + last).toUpperCase();
}

// Initials only: no photo storage or image picker exists (D-015).
export function Avatar({ name, size = 'md', tone = 'default', children, className }: Props) {
  return (
    <View accessible accessibilityLabel={name} className={cn('self-start', className)}>
      <View className={avatarVariants({ size, tone })}>
        <Text
          variant={size === 'lg' ? 'label' : 'caption'}
          tone={tone === 'primary' ? 'primary' : 'default'}>
          {getInitials(name)}
        </Text>
      </View>
      {children ? <View className="absolute -bottom-0.5 -right-0.5">{children}</View> : null}
    </View>
  );
}
