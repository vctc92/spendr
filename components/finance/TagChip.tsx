import { Plus } from 'lucide-react-native';

import { Chip } from '@/components/ui/Chip';
import { t } from '@/lib/i18n';

type Props = {
  /** Stored form: lowercase, no spaces, no "#". Ignored for the add-new variant. */
  tag?: string;
  onRemove?: () => void;
  onPress?: () => void;
  /** Renders the "Add tag" chip instead of a tag. */
  addNew?: boolean;
  size?: 'md' | 'sm';
};

export function TagChip({ tag = '', onRemove, onPress, addNew = false, size }: Props) {
  if (addNew) return <Chip label={t('tag.add')} icon={Plus} size={size} onPress={onPress} />;
  return <Chip label={`#${tag}`} size={size} onPress={onPress} onRemove={onRemove} />;
}
