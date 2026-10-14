import { describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react-native';

import { Checkbox } from '@/components/ui/Checkbox';

describe('Checkbox', () => {
  it('reflects checked state and toggles', async () => {
    const onChange = jest.fn();
    await render(<Checkbox label="Remember me" checked={false} onChange={onChange} />);
    const box = screen.getByRole('checkbox', { name: 'Remember me' });
    expect(box.props.accessibilityState).toMatchObject({ checked: false });
    await fireEvent.press(box);
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('renders checked', async () => {
    await render(<Checkbox label="Remember me" checked onChange={() => {}} />);
    expect(screen.getByRole('checkbox').props.accessibilityState).toMatchObject({ checked: true });
  });

  it('ignores presses when disabled', async () => {
    const onChange = jest.fn();
    await render(<Checkbox label="Remember me" checked={false} disabled onChange={onChange} />);
    await fireEvent.press(screen.getByRole('checkbox'));
    expect(onChange).not.toHaveBeenCalled();
  });
});
