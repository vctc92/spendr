import { describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react-native';

import { TextField } from '@/components/ui/TextField';

describe('TextField', () => {
  it('renders label and placeholder, and reports changes', async () => {
    const onChangeText = jest.fn();
    await render(<TextField label="Note" placeholder="Add a note" onChangeText={onChangeText} />);
    await fireEvent.changeText(screen.getByPlaceholderText('Add a note'), 'hello');
    expect(screen.getByText('Note')).toBeTruthy();
    expect(onChangeText).toHaveBeenCalledWith('hello');
  });

  it('shows helper text', async () => {
    await render(<TextField label="Note" helperText="Optional" />);
    expect(screen.getByText('Optional')).toBeTruthy();
  });

  it('shows the error instead of helper text', async () => {
    await render(<TextField label="Note" helperText="Optional" error="Too long" />);
    expect(screen.getByText('Too long')).toBeTruthy();
    expect(screen.queryByText('Optional')).toBeNull();
  });

  it('renders focused, multiline and disabled', async () => {
    await render(<TextField label="Note" multiline editable={false} placeholder="x" />);
    const input = screen.getByPlaceholderText('x');
    await fireEvent(input, 'focus');
    expect(input.props.editable).toBe(false);
  });
});
