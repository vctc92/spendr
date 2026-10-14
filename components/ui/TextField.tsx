import * as React from 'react';
import { TextInput, View, type TextInputProps } from 'react-native';

import { Text } from '@/components/ui/Text';
import { cn } from '@/lib/cn';
import { useThemeColors } from '@/lib/useThemeColors';

type Props = Omit<TextInputProps, 'style'> & {
  label?: string;
  helperText?: string;
  /** Shown instead of helperText; also switches the border to destructive. */
  error?: string;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  className?: string;
};

export function TextField({
  label,
  helperText,
  error,
  leading,
  trailing,
  multiline,
  editable = true,
  onFocus,
  onBlur,
  className,
  accessibilityLabel,
  ...props
}: Props) {
  const colors = useThemeColors();
  const [focused, setFocused] = React.useState(false);
  const message = error ?? helperText;

  return (
    <View className={cn('gap-1', className)}>
      {label ? <Text variant="label">{label}</Text> : null}
      <View
        className={cn(
          'min-h-[44px] flex-row gap-2 rounded-lg border bg-card px-3',
          multiline ? 'min-h-[88px] items-start py-2' : 'items-center',
          error ? 'border-destructive' : focused ? 'border-primary' : 'border-border',
          !editable && 'opacity-50'
        )}>
        {leading}
        <TextInput
          accessibilityLabel={accessibilityLabel ?? label}
          accessibilityState={{ disabled: !editable }}
          editable={editable}
          multiline={multiline}
          placeholderTextColor={colors.mutedForeground}
          className="min-h-[44px] flex-1 font-sans text-body text-foreground"
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          {...props}
        />
        {trailing}
      </View>
      {message ? (
        <Text
          variant="caption"
          tone={error ? undefined : 'muted'}
          className={error ? 'text-destructive' : undefined}
          accessibilityLiveRegion={error ? 'polite' : 'none'}>
          {message}
        </Text>
      ) : null}
    </View>
  );
}
