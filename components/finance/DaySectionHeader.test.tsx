import { describe, expect, it } from '@jest/globals';
import { render, screen } from '@testing-library/react-native';

import { DaySectionHeader } from '@/components/finance/DaySectionHeader';

describe('DaySectionHeader', () => {
  it('labels today', async () => {
    await render(
      <DaySectionHeader date="2026-10-13" today="2026-10-13" totalMinor={434_600} currency="INR" />
    );
    expect(screen.getByText('Today · 13 Oct')).toBeTruthy();
    expect(screen.getByText('₹4,346')).toBeTruthy();
    expect(screen.getByText('Day total')).toBeTruthy();
  });

  // Some ICU builds abbreviate September as "Sept", so the month is matched loosely.
  it('labels yesterday, including across a month boundary', async () => {
    await render(
      <DaySectionHeader date="2026-09-30" today="2026-10-01" totalMinor={0} currency="INR" />
    );
    expect(screen.getByText(/^Yesterday · 30 Sept?$/)).toBeTruthy();
  });

  it('shows only the date for older days', async () => {
    await render(
      <DaySectionHeader date="2026-10-11" today="2026-10-13" totalMinor={98_000} currency="INR" />
    );
    expect(screen.getByText('11 Oct')).toBeTruthy();
  });
});
