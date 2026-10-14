import * as React from 'react';
import { View } from 'react-native';

import { Section } from '@/components/dev/Section';
import { Button } from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/Checkbox';
import { Dialog } from '@/components/ui/Dialog';
import { Select } from '@/components/ui/Select';
import { Toggle } from '@/components/ui/Toggle';
import { t } from '@/lib/i18n';

export function ControlsSection() {
  const [on, setOn] = React.useState(true);
  const [checked, setChecked] = React.useState(false);
  const [account, setAccount] = React.useState<string | null>(null);
  const [dialog, setDialog] = React.useState(false);
  const accounts = [
    { value: 'hdfc', label: t('gallery.sample.accountHdfc') },
    { value: 'cash', label: t('gallery.sample.accountCash') },
  ];

  return (
    <Section title={t('gallery.section.controls')}>
      <View className="gap-1 rounded-xl border border-border bg-card px-4 py-2">
        <Toggle label={t('gallery.sample.reminders')} value={on} onValueChange={setOn} />
        <Toggle
          label={t('gallery.sample.state.disabled')}
          value
          disabled
          onValueChange={() => {}}
        />
        <Checkbox label={t('gallery.sample.remember')} checked={checked} onChange={setChecked} />
        <Checkbox label={t('gallery.sample.state.selected')} checked onChange={() => {}} />
        <Checkbox
          label={t('gallery.sample.state.disabled')}
          checked={false}
          disabled
          onChange={() => {}}
        />
      </View>
      <Select
        label={t('gallery.sample.account')}
        placeholder={t('gallery.sample.accountPlaceholder')}
        options={accounts}
        value={account}
        onChange={setAccount}
      />
      <Select
        label={t('gallery.sample.account')}
        placeholder={t('gallery.sample.accountPlaceholder')}
        options={accounts}
        value={null}
        error={t('gallery.sample.accountError')}
        onChange={() => {}}
      />
      <Select
        label={t('gallery.sample.account')}
        options={accounts}
        value="cash"
        disabled
        onChange={() => {}}
      />
      <View className="flex-row">
        <Button
          variant="secondary"
          label={t('gallery.sample.openDialog')}
          onPress={() => setDialog(true)}
        />
      </View>
      <Dialog
        visible={dialog}
        onClose={() => setDialog(false)}
        title={t('gallery.sample.dialogTitle')}
        message={t('gallery.sample.dialogMessage')}
        actions={[
          { label: t('common.cancel'), onPress: () => setDialog(false) },
          {
            label: t('gallery.sample.leave'),
            variant: 'destructive',
            onPress: () => setDialog(false),
          },
        ]}
      />
    </Section>
  );
}
