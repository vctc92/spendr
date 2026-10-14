import { describe, expect, it } from '@jest/globals';
import { render, screen } from '@testing-library/react-native';

import { AmountText } from '@/components/finance/AmountText';

describe('AmountText', () => {
  it.each(['display', 'body', 'caption'] as const)('renders size %s', async (size) => {
    await render(<AmountText amountMinor={12_345_600} currency="INR" size={size} />);
    expect(screen.getByText('₹1,23,456')).toBeTruthy();
  });

  it.each(['neutral', 'credit', 'debit'] as const)('renders tone %s', async (tone) => {
    await render(<AmountText amountMinor={100} currency="INR" tone={tone} />);
    expect(screen.getByText('₹1')).toBeTruthy();
  });

  it('shows a plus for credits when asked and reads it aloud', async () => {
    await render(<AmountText amountMinor={14_500_000} currency="INR" sign="always" />);
    expect(screen.getByLabelText('plus 1,45,000 Indian rupees')).toBeTruthy();
    expect(screen.getByText('+₹1,45,000')).toBeTruthy();
  });

  it('shows and speaks negatives', async () => {
    await render(<AmountText amountMinor={-234_000} currency="INR" />);
    expect(screen.getByText('-₹2,340')).toBeTruthy();
    expect(screen.getByLabelText('minus 2,340 Indian rupees')).toBeTruthy();
  });

  it('formats dollars', async () => {
    await render(<AmountText amountMinor={12_345_600} currency="USD" locale="en-US" />);
    expect(screen.getByText('$123,456')).toBeTruthy();
  });
});
