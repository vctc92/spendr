import { X } from 'lucide-react-native';
import * as React from 'react';
import { Modal, Pressable, View, useWindowDimensions } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
  ReduceMotion,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scheduleOnRN } from 'react-native-worklets';

import { IconButton } from '@/components/ui/IconButton';
import { Text } from '@/components/ui/Text';
import { t } from '@/lib/i18n';
import { tokens } from '@/theme/tokens';

type Props = {
  visible: boolean;
  onClose: () => void;
  title: string;
  children?: React.ReactNode;
};

const DISMISS_DISTANCE = 100;
const DISMISS_VELOCITY = 800;

const slide = (to: number, onDone?: (finished?: boolean) => void) => {
  'worklet';
  return withTiming(
    to,
    { duration: tokens.motion.base, reduceMotion: ReduceMotion.System },
    onDone
  );
};

/** Bottom sheet. Closes via the scrim, the close button, Android back or a swipe down. */
export function Sheet({ visible, onClose, title, children }: Props) {
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const translateY = useSharedValue(height);
  // Stay mounted until the slide-out finishes.
  const [mounted, setMounted] = React.useState(visible);

  if (visible && !mounted) setMounted(true);

  React.useEffect(() => {
    if (visible) {
      translateY.set(slide(0));
    } else {
      translateY.set(
        slide(height, (finished) => {
          if (finished) scheduleOnRN(setMounted, false);
        })
      );
    }
  }, [visible, height, translateY]);

  const pan = Gesture.Pan()
    .onUpdate((e) => {
      translateY.set(Math.max(0, e.translationY));
    })
    .onEnd((e) => {
      if (e.translationY > DISMISS_DISTANCE || e.velocityY > DISMISS_VELOCITY) {
        scheduleOnRN(onClose);
      } else {
        translateY.set(slide(0));
      }
    });

  const panelStyle = useAnimatedStyle(() => ({ transform: [{ translateY: translateY.get() }] }));
  const scrimStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateY.get(), [0, height], [1, 0]),
  }));

  return (
    <Modal transparent visible={mounted} statusBarTranslucent onRequestClose={onClose}>
      <GestureHandlerRootView className="flex-1 justify-end">
        <Animated.View className="absolute inset-0 bg-scrim" style={scrimStyle}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t('common.close')}
            className="flex-1"
            onPress={onClose}
          />
        </Animated.View>
        <Animated.View
          className="max-h-[90%] rounded-t-2xl border-t border-border bg-card shadow-lg"
          style={[panelStyle, { paddingBottom: insets.bottom }]}>
          <GestureDetector gesture={pan}>
            <View className="px-4 pb-2 pt-2">
              <View className="mb-2 h-1 w-10 self-center rounded-full bg-border" />
              <View className="flex-row items-center justify-between">
                <Text variant="title" accessibilityRole="header" className="flex-1">
                  {title}
                </Text>
                <IconButton icon={X} accessibilityLabel={t('common.close')} onPress={onClose} />
              </View>
            </View>
          </GestureDetector>
          <View className="px-4 pb-4">{children}</View>
        </Animated.View>
      </GestureHandlerRootView>
    </Modal>
  );
}
