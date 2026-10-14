// Pure TypeScript: no React, no UI. All amounts are integer minor units.

export type DeltaKind = 'spend' | 'income' | 'savings';
export type DeltaDirection = 'up' | 'down' | 'flat' | 'no-data';
/** Meaning of the change, not a colour: the UI maps `debit`/`credit` to tokens. */
export type DeltaTone = 'debit' | 'credit' | 'neutral';

export type Delta = {
  direction: DeltaDirection;
  /** Signed: current minus previous. 0 when there is no comparison. */
  changeMinor: number;
  /** Signed, unrounded; null when there is no baseline to divide by. */
  percent: number | null;
  tone: DeltaTone;
};

/**
 * Change between two periods. Any spend increase is `debit` and any decrease `credit`;
 * for income and savings it flips (D-016). Equal values and missing baselines are neutral.
 */
export function computeDelta(
  current: number,
  previous: number | null | undefined,
  kind: DeltaKind
): Delta {
  if (previous === null || previous === undefined) {
    return { direction: 'no-data', changeMinor: 0, percent: null, tone: 'neutral' };
  }

  const changeMinor = current - previous;
  if (changeMinor === 0) {
    return {
      direction: 'flat',
      changeMinor: 0,
      percent: previous === 0 ? null : 0,
      tone: 'neutral',
    };
  }

  const direction = changeMinor > 0 ? 'up' : 'down';
  const percent = previous === 0 ? null : (changeMinor / Math.abs(previous)) * 100;
  const goodWhenUp = kind !== 'spend';
  const tone = (direction === 'up') === goodWhenUp ? 'credit' : 'debit';

  return { direction, changeMinor, percent, tone };
}
