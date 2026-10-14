import { DataError } from '@/data';
import { t } from '@/lib/i18n';

export function errorMessage(error: unknown): string {
  const code = error instanceof DataError ? error.code : 'unknown';
  return t(`auth.error.${code}`);
}
