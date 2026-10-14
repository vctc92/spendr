import { Check, Search } from 'lucide-react-native';
import * as React from 'react';
import { View } from 'react-native';

import { Section } from '@/components/dev/Section';
import { Chip } from '@/components/ui/Chip';
import { Icon } from '@/components/ui/Icon';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { TextField } from '@/components/ui/TextField';
import { t } from '@/lib/i18n';

export function FormSection() {
  const [kind, setKind] = React.useState('expense');
  const [selected, setSelected] = React.useState(true);
  const [text, setText] = React.useState('');
  const options = [
    { value: 'expense', label: t('gallery.sample.expense') },
    { value: 'income', label: t('gallery.sample.income') },
    { value: 'transfer', label: t('gallery.sample.transfer') },
  ];

  return (
    <>
      <Section title={t('gallery.section.fields')}>
        <View className="gap-3">
          <TextField
            label={t('gallery.sample.note')}
            placeholder={t('gallery.sample.notePlaceholder')}
            value={text}
            onChangeText={setText}
            leading={<Icon icon={Search} className="text-muted-foreground" />}
          />
          <TextField
            label={t('gallery.sample.note')}
            placeholder={t('gallery.sample.notePlaceholder')}
            helperText={t('gallery.sample.helper')}
          />
          <TextField
            label={t('gallery.sample.note')}
            defaultValue="…"
            error={t('gallery.sample.error')}
          />
          <TextField
            label={t('gallery.sample.note')}
            placeholder={t('gallery.sample.notePlaceholder')}
            multiline
          />
          <TextField
            label={t('gallery.sample.note')}
            placeholder={t('gallery.sample.state.disabled')}
            editable={false}
          />
        </View>
      </Section>

      <Section title={t('gallery.section.segmented')}>
        <SegmentedControl options={options} value={kind} onChange={setKind} />
        <SegmentedControl options={options} value="income" onChange={() => {}} disabled />
      </Section>

      <Section title={t('gallery.section.chips')}>
        <View className="flex-row flex-wrap items-center gap-2">
          <Chip label={t('gallery.sample.category')} />
          <Chip
            label={t('gallery.sample.state.selected')}
            icon={Check}
            selected={selected}
            onPress={() => setSelected((s) => !s)}
          />
          <Chip label={t('gallery.sample.category')} onPress={() => {}} />
          <Chip label={t('gallery.sample.state.disabled')} disabled onPress={() => {}} />
          <Chip label={t('gallery.sample.state.small')} size="sm" onPress={() => {}} />
          <Chip label={t('gallery.sample.tag')} onRemove={() => {}} />
        </View>
      </Section>
    </>
  );
}
