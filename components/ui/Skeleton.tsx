import * as React from 'react';
import Animated, {
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { cn } from '@/lib/cn';
import { tokens } from '@/theme/tokens';

type Props = { className?: string };

/** Loading placeholder; size it with className, e.g. `h-4 w-32`. Static when reduce-motion is on. */
export function Skeleton({ className }: Props) {
  const opacity = useSharedValue(1);

  React.useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0.5, { duration: tokens.motion.base * 3, reduceMotion: ReduceMotion.System }),
      -1,
      true,
      undefined,
      ReduceMotion.System
    );
  }, [opacity]);

  const style = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      accessible={false}
      importantForAccessibility="no-hide-descendants"
      className={cn('rounded-lg bg-muted', className)}
      style={style}
    />
  );
}
