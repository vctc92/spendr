import { Check } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

import { Icon } from '@/components/ui/Icon';
import { Text } from '@/components/ui/Text';
import { cn } from '@/lib/cn';
import { t } from '@/lib/i18n';
import { needLevelClass, type NeedLevel } from '@/theme/tokens';

// Full class strings so Tailwind can see them at build time.
const TINT: Record<NeedLevel, string> = {
  must_have: 'bg-need-must/15',
  necessary: 'bg-need-necessary/15',
  nice_to_have: 'bg-need-nice/15',
  avoidable: 'bg-need-avoidable/15',
};
const RING: Record<NeedLevel, string> = {
  must_have: 'border-need-must',
  necessary: 'border-need-necessary',
  nice_to_have: 'border-need-nice',
  avoidable: 'border-need-avoidable',
};

type Props = {
  level: NeedLevel;
  /** `md` is a selectable 44 px chip; `sm` is a read-only 24 px pill for lists and reports. */
  size?: 'md' | 'sm';
  selected?: boolean;
  disabled?: boolean;
  onPress?: () => void;
  className?: string;
};

export function NeedLevelChip({
  level,
  size = 'md',
  selected = false,
  disabled = false,
  onPress,
  className,
}: Props) {
  const label = t(`need.${level}`);
  // Text stays foreground for contrast (D-018); colour lives on the dot and the tint.
  const body = (
    <>
      <View className={cn('h-2 w-2 rounded-full', needLevelClass[level])} />
      <Text variant={size === 'sm' ? 'caption' : 'label'} className={size === 'md' ? 'flex-1' : ''}>
        {label}
      </Text>
      {size === 'md' && selected ? <Icon icon={Check} /> : null}
    </>
  );

  if (size === 'sm') {
    return (
      <View
        accessible
        accessibilityLabel={label}
        className={cn(
          'min-h-[24px] flex-row items-center gap-1 self-start rounded-full px-2',
          TINT[level],
          className
        )}>
        {body}
      </View>
    );
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected, disabled }}
      disabled={disabled || !onPress}
      onPress={onPress}
      className={cn(
        'min-h-[44px] flex-row items-center gap-2 rounded-lg border px-3',
        selected ? cn(TINT[level], RING[level]) : 'border-transparent bg-muted',
        disabled && 'opacity-50',
        className
      )}>
      {body}
    </Pressable>
  );
}
