import { DataError } from '@/data/errors';

type Failure = { message?: string; status?: number; code?: string } | null;

/** Maps any backend failure to a safe code so raw messages never reach the UI. */
export function toDataError(
  error: NonNullable<Failure>,
  fallback: 'unknown' | 'invalid_code' = 'unknown'
) {
  if (error.status === 429 || error.code === 'over_email_send_rate_limit') {
    return new DataError('rate_limited');
  }
  if (error.code === 'P0002') return new DataError('invalid_invite');
  if (error.status === 0 || /network|fetch/i.test(error.message ?? '')) {
    return new DataError('network');
  }
  return new DataError(fallback);
}
