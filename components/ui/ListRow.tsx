import { ChevronRight } from 'lucide-react-native';
import type * as React from 'react';
import { Pressable, View } from 'react-native';

import { Icon } from '@/components/ui/Icon';
import { Text } from '@/components/ui/Text';
import { cn } from '@/lib/cn';

type Props = {
  title: string;
  subtitle?: string;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  showChevron?: boolean;
  /** Hairline under the row; leave off for the last row of a group. */
  divider?: boolean;
  onPress?: () => void;
  accessibilityLabel?: string;
  className?: string;
};

export function ListRow({
  title,
  subtitle,
  leading,
  trailing,
  showChevron = false,
  divider = false,
  onPress,
  accessibilityLabel,
  className,
}: Props) {
  const rowClass = cn(
    'min-h-[56px] flex-row items-center gap-3 py-2',
    divider && 'border-b border-border',
    className
  );
  const content = (
    <>
      {leading}
      <View className="flex-1">
        <Text>{title}</Text>
        {subtitle ? (
          <Text variant="label" tone="muted">
            {subtitle}
          </Text>
        ) : null}
      </View>
      {trailing}
      {showChevron ? <Icon icon={ChevronRight} className="text-muted-foreground" /> : null}
    </>
  );

  if (!onPress) return <View className={rowClass}>{content}</View>;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? title}
      onPress={onPress}
      className={cn(rowClass, 'active:bg-muted')}>
      {content}
    </Pressable>
  );
}
