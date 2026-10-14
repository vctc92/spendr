import { describe, expect, it } from '@jest/globals';

import { computeDelta } from '@/engine/delta';

describe('computeDelta', () => {
  it('treats a spend increase as debit', () => {
    expect(computeDelta(4_238_000, 3_815_000, 'spend')).toEqual({
      direction: 'up',
      changeMinor: 423_000,
      percent: (423_000 / 3_815_000) * 100,
      tone: 'debit',
    });
  });

  it('treats a spend decrease as credit', () => {
    const delta = computeDelta(90_000, 100_000, 'spend');
    expect(delta).toMatchObject({ direction: 'down', changeMinor: -10_000, tone: 'credit' });
    expect(delta.percent).toBeCloseTo(-10);
  });

  it('flips the meaning for income and savings', () => {
    expect(computeDelta(120, 100, 'income').tone).toBe('credit');
    expect(computeDelta(80, 100, 'income').tone).toBe('debit');
    expect(computeDelta(120, 100, 'savings').tone).toBe('credit');
    expect(computeDelta(80, 100, 'savings').tone).toBe('debit');
  });

  it('is flat and neutral when nothing changed', () => {
    expect(computeDelta(500, 500, 'spend')).toEqual({
      direction: 'flat',
      changeMinor: 0,
      percent: 0,
      tone: 'neutral',
    });
  });

  it('has no percent when both periods are zero', () => {
    expect(computeDelta(0, 0, 'spend')).toMatchObject({ direction: 'flat', percent: null });
  });

  it('has no percent but keeps direction when the baseline is zero', () => {
    expect(computeDelta(500, 0, 'spend')).toEqual({
      direction: 'up',
      changeMinor: 500,
      percent: null,
      tone: 'debit',
    });
  });

  it('reports no-data without a previous period', () => {
    expect(computeDelta(500, null, 'spend')).toEqual({
      direction: 'no-data',
      changeMinor: 0,
      percent: null,
      tone: 'neutral',
    });
    expect(computeDelta(500, undefined, 'income').direction).toBe('no-data');
  });

  it('handles negative baselines with the baseline magnitude', () => {
    expect(computeDelta(-50, -100, 'savings').percent).toBe(50);
  });
});
