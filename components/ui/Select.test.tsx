import { describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react-native';

import { Select } from '@/components/ui/Select';

const options = [
  { value: 'hdfc', label: 'HDFC Savings' },
  { value: 'cash', label: 'Cash' },
] as const;

describe('Select', () => {
  it('shows the placeholder when nothing is selected', async () => {
    await render(
      <Select
        label="Account"
        options={options}
        value={null}
        onChange={() => {}}
        placeholder="Choose"
      />
    );
    expect(screen.getByText('Choose')).toBeTruthy();
  });

  it('shows the selected label', async () => {
    await render(<Select label="Account" options={options} value="cash" onChange={() => {}} />);
    expect(screen.getByRole('button', { name: 'Account, Cash' })).toBeTruthy();
  });

  it('opens the list and reports a choice', async () => {
    const onChange = jest.fn();
    await render(<Select label="Account" options={options} value={null} onChange={onChange} />);
    await fireEvent.press(screen.getByRole('button', { name: 'Account' }));
    await fireEvent.press(screen.getByRole('radio', { name: 'HDFC Savings' }));
    expect(onChange).toHaveBeenCalledWith('hdfc');
  });

  it('shows an error and ignores presses when disabled', async () => {
    await render(
      <Select
        label="Account"
        options={options}
        value={null}
        error="Required"
        disabled
        onChange={() => {}}
      />
    );
    expect(screen.getByText('Required')).toBeTruthy();
    expect(screen.getByRole('button').props.accessibilityState).toMatchObject({ disabled: true });
  });
});
