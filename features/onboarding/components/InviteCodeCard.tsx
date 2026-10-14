import { Share2 } from 'lucide-react-native';
import { View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Text } from '@/components/ui/Text';
import { t } from '@/lib/i18n';

type Props = { code: string; onShare: () => void };

export function InviteCodeCard({ code, onShare }: Props) {
  return (
    <Card className="gap-3">
      <Text variant="caption" tone="muted">
        {t('onboarding.setup.inviteHint')}
      </Text>
      <View className="items-center py-2">
        <Text variant="display" numeric selectable accessibilityLabel={code.split('').join(' ')}>
          {code}
        </Text>
      </View>
      <Button
        variant="secondary"
        leftIcon={Share2}
        label={t('onboarding.setup.inviteCopy')}
        onPress={onShare}
      />
    </Card>
  );
}
