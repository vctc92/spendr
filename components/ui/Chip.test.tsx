import { describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react-native';

import { Check } from 'lucide-react-native';

import { Chip } from '@/components/ui/Chip';

describe('Chip', () => {
  it('renders a static chip without a button role', async () => {
    await render(<Chip label="Food" />);
    expect(screen.getByText('Food')).toBeTruthy();
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('reports selected state and presses', async () => {
    const onPress = jest.fn();
    await render(<Chip label="Food" icon={Check} selected size="sm" onPress={onPress} />);
    const chip = screen.getByRole('button', { name: 'Food' });
    expect(chip.props.accessibilityState).toMatchObject({ selected: true });
    await fireEvent.press(chip);
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('removes via the remove button', async () => {
    const onRemove = jest.fn();
    await render(<Chip label="late-night" onRemove={onRemove} />);
    await fireEvent.press(screen.getByRole('button', { name: 'Remove late-night' }));
    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it('does not press when disabled', async () => {
    const onPress = jest.fn();
    await render(<Chip label="Food" disabled onPress={onPress} />);
    await fireEvent.press(screen.getByRole('button', { name: 'Food' }));
    expect(onPress).not.toHaveBeenCalled();
  });
});
