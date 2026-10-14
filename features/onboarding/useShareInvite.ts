import { Share } from 'react-native';

import { t } from '@/lib/i18n';

export function shareInvite(code: string) {
  return Share.share({ message: t('onboarding.setup.inviteShare', { code }) });
}
