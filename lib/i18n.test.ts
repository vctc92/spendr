import { describe, expect, it } from '@jest/globals';
import { t } from '@/lib/i18n';

describe('t', () => {
  it('returns the English string for a key', () => {
    expect(t('need.must_have')).toBe('Must-have');
  });
});
