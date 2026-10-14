import * as React from 'react';
import { Modal, Pressable, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { t } from '@/lib/i18n';

type DialogAction = {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';
  loading?: boolean;
};

type Props = {
  visible: boolean;
  onClose: () => void;
  title: string;
  message?: string;
  children?: React.ReactNode;
  actions: readonly DialogAction[];
};

/** Centred modal for short decisions. Flat: only sheets and the FAB carry a shadow (D-024). */
export function Dialog({ visible, onClose, title, message, children, actions }: Props) {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}>
      <View className="flex-1 items-center justify-center bg-scrim px-4">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('common.close')}
          className="absolute inset-0"
          onPress={onClose}
        />
        <View
          accessibilityViewIsModal
          className="w-full max-w-[400px] gap-3 rounded-2xl border border-border bg-card p-4">
          <Text variant="title" accessibilityRole="header">
            {title}
          </Text>
          {message ? <Text tone="muted">{message}</Text> : null}
          {children}
          <View className="mt-1 flex-row justify-end gap-2">
            {actions.map((action) => (
              <Button
                key={action.label}
                label={action.label}
                variant={action.variant ?? 'ghost'}
                loading={action.loading}
                onPress={action.onPress}
              />
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
}
