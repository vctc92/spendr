import { Check, ChevronDown } from 'lucide-react-native';
import * as React from 'react';
import { Pressable, View } from 'react-native';

import { Icon } from '@/components/ui/Icon';
import { Sheet } from '@/components/ui/Sheet';
import { Text } from '@/components/ui/Text';
import { cn } from '@/lib/cn';

type Option<T extends string> = { value: T; label: string };

type Props<T extends string> = {
  label: string;
  options: readonly Option<T>[];
  value: T | null;
  onChange: (value: T) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
};

export function Select<T extends string>({
  label,
  options,
  value,
  onChange,
  placeholder,
  error,
  disabled = false,
  className,
}: Props<T>) {
  const [open, setOpen] = React.useState(false);
  const selected = options.find((o) => o.value === value);

  return (
    <View className={cn('gap-1', className)}>
      <Text variant="label">{label}</Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${label}${selected ? `, ${selected.label}` : ''}`}
        accessibilityState={{ disabled, expanded: open }}
        disabled={disabled}
        onPress={() => setOpen(true)}
        className={cn(
          'min-h-[44px] flex-row items-center justify-between gap-2 rounded-lg border bg-card px-3',
          error ? 'border-destructive' : 'border-border',
          disabled && 'opacity-50'
        )}>
        <Text tone={selected ? 'default' : 'muted'} className="flex-1">
          {selected?.label ?? placeholder ?? ''}
        </Text>
        <Icon icon={ChevronDown} className="text-muted-foreground" />
      </Pressable>
      {error ? (
        <Text variant="caption" className="text-destructive" accessibilityLiveRegion="polite">
          {error}
        </Text>
      ) : null}
      <Sheet visible={open} onClose={() => setOpen(false)} title={label}>
        {options.map((option) => {
          const isSelected = option.value === value;
          return (
            <Pressable
              key={option.value}
              accessibilityRole="radio"
              accessibilityLabel={option.label}
              accessibilityState={{ selected: isSelected }}
              onPress={() => {
                onChange(option.value);
                setOpen(false);
              }}
              className="min-h-[48px] flex-row items-center justify-between gap-2 active:bg-muted">
              <Text>{option.label}</Text>
              {isSelected ? <Icon icon={Check} className="text-primary" /> : null}
            </Pressable>
          );
        })}
      </Sheet>
    </View>
  );
}
