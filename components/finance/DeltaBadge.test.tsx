import { describe, expect, it } from '@jest/globals';
import { render, screen } from '@testing-library/react-native';

import { DeltaBadge } from '@/components/finance/DeltaBadge';

describe('DeltaBadge', () => {
  it('shows an increase with ₹ and percent', async () => {
    await render(
      <DeltaBadge current={4_238_000} previous={3_815_000} kind="spend" currency="INR" />
    );
    expect(screen.getByText('+₹4,230 (11%)')).toBeTruthy();
    expect(screen.getByLabelText('Up 4,230 Indian rupees, 11 percent')).toBeTruthy();
  });

  it('shows a decrease', async () => {
    await render(<DeltaBadge current={90_000} previous={100_000} kind="spend" currency="INR" />);
    expect(screen.getByText('-₹100 (10%)')).toBeTruthy();
  });

  it('omits the percent when the baseline is zero', async () => {
    await render(<DeltaBadge current={50_000} previous={0} kind="income" currency="INR" />);
    expect(screen.getByText('+₹500')).toBeTruthy();
  });

  it('shows flat and no-data states', async () => {
    await render(
      <>
        <DeltaBadge current={5} previous={5} kind="spend" currency="INR" />
        <DeltaBadge current={5} previous={null} kind="spend" currency="INR" />
      </>
    );
    expect(screen.getByText('No change')).toBeTruthy();
    expect(screen.getByText('No comparison yet')).toBeTruthy();
  });
});
