import * as React from 'react';
import { View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Sheet } from '@/components/ui/Sheet';
import { Text } from '@/components/ui/Text';
import { TextField } from '@/components/ui/TextField';
import { t } from '@/lib/i18n';

type Props = {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
  /** When set, the user must type this text (e.g. the household name) before confirming. */
  confirmationText?: string;
};

function Body({
  message,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
  loading,
  confirmationText,
}: Omit<Props, 'visible' | 'title'>) {
  // Lives inside the Sheet, which unmounts it on close, so the typed text resets by itself.
  const [typed, setTyped] = React.useState('');
  const locked = confirmationText !== undefined && typed !== confirmationText;

  return (
    <View className="gap-3">
      <Text tone="muted">{message}</Text>
      {confirmationText !== undefined ? (
        <TextField
          label={t('confirm.typeToConfirm', { text: confirmationText })}
          value={typed}
          onChangeText={setTyped}
          autoCapitalize="none"
          autoCorrect={false}
        />
      ) : null}
      <View className="flex-row justify-end gap-2">
        <Button variant="ghost" label={cancelLabel ?? t('common.cancel')} onPress={onCancel} />
        <Button
          variant="destructive"
          label={confirmLabel}
          loading={loading}
          disabled={locked}
          onPress={onConfirm}
        />
      </View>
    </View>
  );
}

/** Confirms destructive actions: delete entry, leave household, delete everything. */
export function ConfirmSheet({ visible, title, onCancel, ...body }: Props) {
  return (
    <Sheet visible={visible} onClose={onCancel} title={title}>
      <Body onCancel={onCancel} {...body} />
    </Sheet>
  );
}
