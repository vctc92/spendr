import type * as React from 'react';
import { View } from 'react-native';

import { Text } from '@/components/ui/Text';

type Props = { title: string; children: React.ReactNode };

export function Section({ title, children }: Props) {
  return (
    <View className="gap-3">
      <Text variant="heading">{title}</Text>
      {children}
    </View>
  );
}
