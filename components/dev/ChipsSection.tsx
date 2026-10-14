import * as React from 'react';
import { View } from 'react-native';

import { Section } from '@/components/dev/Section';
import { CategoryChip } from '@/components/finance/CategoryChip';
import { NeedLevelChip } from '@/components/finance/NeedLevelChip';
import { TagChip } from '@/components/finance/TagChip';
import { t } from '@/lib/i18n';
import type { NeedLevel } from '@/theme/tokens';

const LEVELS: NeedLevel[] = ['must_have', 'necessary', 'nice_to_have', 'avoidable'];

export function ChipsSection() {
  const [level, setLevel] = React.useState<NeedLevel>('necessary');
  const [category, setCategory] = React.useState('groceries');
  const categories = [
    { id: 'groceries', name: t('gallery.sample.category'), icon: 'shopping-cart' },
    { id: 'food', name: t('gallery.sample.food'), icon: 'utensils' },
    { id: 'utilities', name: t('gallery.sample.utilities'), icon: 'zap' },
  ];

  return (
    <>
      <Section title={t('gallery.section.needChips')}>
        <View className="flex-row flex-wrap gap-2">
          {LEVELS.map((l) => (
            <NeedLevelChip
              key={l}
              level={l}
              className="min-w-[45%] flex-1"
              selected={level === l}
              onPress={() => setLevel(l)}
            />
          ))}
        </View>
        <NeedLevelChip level="necessary" disabled />
        <View className="flex-row flex-wrap gap-2">
          {LEVELS.map((l) => (
            <NeedLevelChip key={l} level={l} size="sm" />
          ))}
        </View>
      </Section>

      <Section title={t('gallery.section.categoryChips')}>
        <View className="flex-row flex-wrap gap-2">
          {categories.map((c) => (
            <CategoryChip
              key={c.id}
              category={c}
              selected={category === c.id}
              onPress={() => setCategory(c.id)}
            />
          ))}
          <CategoryChip category={{ name: t('gallery.sample.state.disabled') }} disabled />
        </View>
        <View className="flex-row flex-wrap gap-2">
          <TagChip tag={t('gallery.sample.weekly')} />
          <TagChip tag={t('gallery.sample.tag')} onRemove={() => {}} />
          <TagChip addNew onPress={() => {}} />
        </View>
      </Section>
    </>
  );
}
