import { Switch, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { cn } from '@/lib/cn';
import { useThemeColors } from '@/lib/useThemeColors';

type Props = {
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  className?: string;
};

export function Toggle({ label, value, onValueChange, disabled = false, className }: Props) {
  const colors = useThemeColors();

  return (
    <View
      className={cn(
        'min-h-[44px] flex-row items-center justify-between gap-3',
        disabled && 'opacity-50',
        className
      )}>
      <Text className="flex-1">{label}</Text>
      <Switch
        accessibilityLabel={label}
        value={value}
        disabled={disabled}
        onValueChange={onValueChange}
        trackColor={{ false: colors.border, true: colors.primary }}
        thumbColor={colors.card}
      />
    </View>
  );
}
