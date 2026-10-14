import { Chip } from '@/components/ui/Chip';
import { getCategoryIcon } from '@/components/finance/categoryIcons';

type Props = {
  category: { name: string; icon?: string | null };
  selected?: boolean;
  disabled?: boolean;
  onPress?: () => void;
};

export function CategoryChip({ category, selected, disabled, onPress }: Props) {
  return (
    <Chip
      label={category.name}
      icon={getCategoryIcon(category.icon)}
      selected={selected}
      disabled={disabled}
      onPress={onPress}
    />
  );
}
