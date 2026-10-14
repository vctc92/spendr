import type { LucideIcon } from 'lucide-react-native';
import * as React from 'react';
import { View } from 'react-native';
import Animated, { FadeIn, FadeOut, ReduceMotion } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon } from '@/components/ui/Icon';
import { Text } from '@/components/ui/Text';
import { tokens } from '@/theme/tokens';

const TOAST_DURATION_MS = 3000;

type ToastProps = { message: string; icon?: LucideIcon };

/** Neutral, shadowless toast (D-024). Announced to screen readers when it appears. */
export function Toast({ message, icon }: ToastProps) {
  return (
    <Animated.View
      entering={FadeIn.duration(tokens.motion.fast).reduceMotion(ReduceMotion.System)}
      exiting={FadeOut.duration(tokens.motion.fast).reduceMotion(ReduceMotion.System)}
      accessible
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
      className="min-h-[44px] flex-row items-center gap-2 self-center rounded-lg bg-foreground px-4 py-2">
      {icon ? <Icon icon={icon} className="text-background" /> : null}
      <Text variant="label" className="text-background">
        {message}
      </Text>
    </Animated.View>
  );
}

type ToastContextValue = { show: (message: string, options?: { icon?: LucideIcon }) => void };

const ToastContext = React.createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const insets = useSafeAreaInsets();
  const [toast, setToast] = React.useState<(ToastProps & { id: number }) | null>(null);
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    []
  );

  const show = React.useCallback<ToastContextValue['show']>((message, options) => {
    if (timer.current) clearTimeout(timer.current);
    setToast({ id: Date.now(), message, icon: options?.icon });
    timer.current = setTimeout(() => setToast(null), TOAST_DURATION_MS);
  }, []);

  const value = React.useMemo(() => ({ show }), [show]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <View
        pointerEvents="none"
        className="absolute inset-x-0 bottom-0 px-4"
        style={{ paddingBottom: insets.bottom + 16 }}>
        {toast ? <Toast key={toast.id} message={toast.message} icon={toast.icon} /> : null}
      </View>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const context = React.useContext(ToastContext);
  if (!context) throw new Error('useToast must be used inside ToastProvider');
  return context;
}
