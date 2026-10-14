import type * as React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { OnboardingProgress } from './OnboardingProgress';

type Props = { step: 1 | 2 | 3; children: React.ReactNode };

/** Shared frame for the three onboarding steps: progress dots on top, scrolling content below. */
export function OnboardingScreen({ step, children }: Props) {
  const insets = useSafeAreaInsets();
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="flex-1 bg-background"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}>
      <View className="pb-4 pt-4">
        <OnboardingProgress step={step} />
      </View>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerClassName="gap-6 px-4 pb-8 pt-4">
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
