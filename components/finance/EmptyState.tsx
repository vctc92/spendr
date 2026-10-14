import type { LucideIcon } from 'lucide-react-native';
import { View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Text } from '@/components/ui/Text';
import { cn } from '@/lib/cn';
import { tokens } from '@/theme/tokens';

type Props = {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: { label: string; onPress: () => void };
  className?: string;
};

/** One line icon, one sentence, one button. */
export function EmptyState({ icon, title, description, action, className }: Props) {
  return (
    <View className={cn('items-center gap-3 px-6 py-8', className)}>
      <View className="h-14 w-14 items-center justify-center rounded-full bg-muted">
        <Icon icon={icon} size={tokens.icon.tab} className="text-muted-foreground" />
      </View>
      <Text variant="heading" className="text-center" accessibilityRole="header">
        {title}
      </Text>
      {description ? (
        <Text tone="muted" className="text-center">
          {description}
        </Text>
      ) : null}
      {action ? <Button label={action.label} onPress={action.onPress} /> : null}
    </View>
  );
}
