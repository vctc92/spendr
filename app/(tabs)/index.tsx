import { PartyPopper } from 'lucide-react-native';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EmptyState } from '@/components/finance/EmptyState';
import { Button } from '@/components/ui/Button';
import { useSignOut } from '@/features/auth/hooks/useAuthActions';
import { t } from '@/lib/i18n';

// Temporary landing so the auth gate has a destination; T4 replaces it with the real tabs.
export default function Landing() {
  const insets = useSafeAreaInsets();
  const signOut = useSignOut();
  return (
    <View className="flex-1 justify-center bg-background" style={{ paddingTop: insets.top }}>
      <EmptyState
        icon={PartyPopper}
        title={t('home.temp.title')}
        description={t('home.temp.description')}
      />
      <Button
        variant="ghost"
        label={t('auth.signOut')}
        loading={signOut.isPending}
        onPress={() => signOut.mutate()}
        className="mx-4"
      />
    </View>
  );
}
