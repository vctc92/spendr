import { describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react-native';

import { TransactionRow, type TransactionRowData } from '@/components/finance/TransactionRow';

const base: TransactionRowData = {
  id: '1',
  title: 'BigBasket',
  type: 'expense',
  amountMinor: 234_000,
  currency: 'INR',
  memberName: 'Meera Rao',
  categoryLabel: 'Groceries',
  accountLabel: 'HDFC Savings ••1234',
  needLevel: 'necessary',
  tags: ['weekly'],
  dateLabel: 'Today',
};

describe('TransactionRow', () => {
  it('renders an expense with tag, details and a negative amount', async () => {
    await render(<TransactionRow transaction={base} />);
    expect(screen.getByText('BigBasket')).toBeTruthy();
    expect(screen.getByText('#weekly')).toBeTruthy();
    expect(screen.getByText('Groceries · HDFC Savings ••1234')).toBeTruthy();
    expect(screen.getByText('-₹2,340')).toBeTruthy();
    expect(screen.getByText('Today')).toBeTruthy();
  });

  it('renders income with a plus', async () => {
    await render(
      <TransactionRow
        transaction={{
          ...base,
          type: 'income',
          title: 'Salary',
          amountMinor: 14_500_000,
          needLevel: null,
          tags: [],
        }}
      />
    );
    expect(screen.getByText('+₹1,45,000')).toBeTruthy();
  });

  it('renders a transfer without a sign', async () => {
    await render(
      <TransactionRow
        transaction={{
          ...base,
          type: 'transfer',
          title: 'To savings',
          amountMinor: 500_000,
          needLevel: null,
        }}
      />
    );
    expect(screen.getByText('₹5,000')).toBeTruthy();
  });

  it('flags pending sync', async () => {
    await render(<TransactionRow transaction={{ ...base, pendingSync: true }} />);
    expect(screen.getByText('Pending sync')).toBeTruthy();
  });

  it('is described for screen readers and pressable', async () => {
    const onPress = jest.fn();
    await render(<TransactionRow transaction={base} onPress={onPress} />);
    const row = screen.getByRole('button', {
      name: 'BigBasket, Groceries · HDFC Savings ••1234, minus 2,340 Indian rupees, Today',
    });
    await fireEvent.press(row);
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
