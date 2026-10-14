import { describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react-native';

import { SegmentedControl } from '@/components/ui/SegmentedControl';

const options = [
  { value: 'expense', label: 'Expense' },
  { value: 'income', label: 'Income' },
  { value: 'transfer', label: 'Transfer' },
] as const;

describe('SegmentedControl', () => {
  it('marks the selected option and reports changes', async () => {
    const onChange = jest.fn();
    await render(<SegmentedControl options={options} value="expense" onChange={onChange} />);
    expect(screen.getByRole('tab', { name: 'Expense' }).props.accessibilityState).toMatchObject({
      selected: true,
    });
    await fireEvent.press(screen.getByRole('tab', { name: 'Income' }));
    expect(onChange).toHaveBeenCalledWith('income');
  });

  it('ignores presses when disabled', async () => {
    const onChange = jest.fn();
    await render(
      <SegmentedControl options={options} value="expense" disabled onChange={onChange} />
    );
    await fireEvent.press(screen.getByRole('tab', { name: 'Income' }));
    expect(onChange).not.toHaveBeenCalled();
  });
});
