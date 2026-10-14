import { Check } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

import { Icon } from '@/components/ui/Icon';
import { Text } from '@/components/ui/Text';
import { cn } from '@/lib/cn';

type Props = {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
};

export function Checkbox({ label, checked, onChange, disabled = false, className }: Props) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityLabel={label}
      accessibilityState={{ checked, disabled }}
      disabled={disabled}
      onPress={() => onChange(!checked)}
      className={cn(
        'min-h-[44px] flex-row items-center gap-3',
        disabled && 'opacity-50',
        className
      )}>
      {/* 20 px box inside the 44 px row, which is the touch target. */}
      <View
        className={cn(
          'h-5 w-5 items-center justify-center rounded border',
          checked ? 'border-primary bg-primary' : 'border-border bg-card'
        )}>
        {checked ? <Icon icon={Check} size={14} className="text-primary-foreground" /> : null}
      </View>
      <Text className="flex-1">{label}</Text>
    </Pressable>
  );
}
