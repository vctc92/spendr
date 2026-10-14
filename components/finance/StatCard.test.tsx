import { describe, expect, it } from '@jest/globals';
import { render, screen } from '@testing-library/react-native';

import { AmountText } from '@/components/finance/AmountText';
import { StatCard } from '@/components/finance/StatCard';
import { Text } from '@/components/ui/Text';

describe('StatCard', () => {
  it('renders the normal hero card', async () => {
    await render(
      <StatCard
        size="hero"
        label="Spent this month"
        period="September"
        value={<AmountText amountMinor={4_238_000} currency="INR" size="display" />}
        delta={<Text>delta</Text>}
        deltaCaption="vs same day last month"
      />
    );
    expect(screen.getByText('Spent this month')).toBeTruthy();
    expect(screen.getByText('September')).toBeTruthy();
    expect(screen.getByText('₹42,380')).toBeTruthy();
    expect(screen.getByText('vs same day last month')).toBeTruthy();
  });

  it('renders the compact card', async () => {
    await render(<StatCard label="Savings rate" value={<Text>34%</Text>} />);
    expect(screen.getByText('34%')).toBeTruthy();
  });

  it('renders the loading state without the value', async () => {
    await render(<StatCard label="Spent" loading value={<Text>hidden</Text>} />);
    expect(screen.getByLabelText('Loading')).toBeTruthy();
    expect(screen.queryByText('hidden')).toBeNull();
  });

  it('renders the empty state', async () => {
    await render(<StatCard label="Spent" empty value={<Text>hidden</Text>} />);
    expect(screen.getByText('No data yet')).toBeTruthy();
    expect(screen.queryByText('hidden')).toBeNull();
  });
});
