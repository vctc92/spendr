import { X } from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

import { Icon } from '@/components/ui/Icon';
import { Text } from '@/components/ui/Text';
import { cn } from '@/lib/cn';
import { t } from '@/lib/i18n';

type Props = {
  label: string;
  icon?: LucideIcon;
  selected?: boolean;
  disabled?: boolean;
  size?: 'md' | 'sm';
  onPress?: () => void;
  /** Adds a remove button; the chip body keeps its own onPress. */
  onRemove?: () => void;
  className?: string;
};

export function Chip({
  label,
  icon,
  selected = false,
  disabled = false,
  size = 'md',
  onPress,
  onRemove,
  className,
}: Props) {
  const tone = selected ? 'text-primary-foreground' : 'text-foreground';
  // The 32 px chip still gets a 44 px touch target.
  const hitSlop = size === 'sm' ? 6 : 0;
  const body = (
    <>
      {icon ? <Icon icon={icon} className={tone} /> : null}
      <Text variant="label" className={tone}>
        {label}
      </Text>
    </>
  );
  const bodyClass = cn(
    'flex-row items-center gap-2',
    size === 'md' ? 'min-h-[44px]' : 'min-h-[32px]'
  );

  return (
    <View
      className={cn(
        'flex-row items-center self-start rounded-lg px-3',
        selected ? 'bg-primary' : 'bg-muted',
        disabled && 'opacity-50',
        className
      )}>
      {onPress ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={label}
          accessibilityState={{ selected, disabled }}
          disabled={disabled}
          hitSlop={hitSlop}
          onPress={onPress}
          className={bodyClass}>
          {body}
        </Pressable>
      ) : (
        <View className={bodyClass}>{body}</View>
      )}
      {onRemove ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('common.remove', { label })}
          disabled={disabled}
          hitSlop={hitSlop + 6}
          onPress={onRemove}
          className="ml-2">
          <Icon icon={X} size={16} className={tone} />
        </Pressable>
      ) : null}
    </View>
  );
}
