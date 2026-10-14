import { describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react-native';

import { Plus } from 'lucide-react-native';

import { Button } from '@/components/ui/Button';

describe('Button', () => {
  it.each(['primary', 'secondary', 'ghost', 'destructive'] as const)(
    'renders %s',
    async (variant) => {
      await render(<Button label="Save" variant={variant} />);
      expect(screen.getByRole('button', { name: 'Save' })).toBeTruthy();
    }
  );

  it('renders the small size and an icon', async () => {
    await render(<Button label="Add" size="sm" leftIcon={Plus} />);
    expect(screen.getByRole('button', { name: 'Add' })).toBeTruthy();
  });

  it('calls onPress', async () => {
    const onPress = jest.fn();
    await render(<Button label="Save" onPress={onPress} />);
    await fireEvent.press(screen.getByRole('button', { name: 'Save' }));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('ignores presses when disabled or loading', async () => {
    const onPress = jest.fn();
    await render(
      <>
        <Button label="Off" disabled onPress={onPress} />
        <Button label="Busy" loading onPress={onPress} />
      </>
    );
    await fireEvent.press(screen.getByRole('button', { name: 'Off' }));
    await fireEvent.press(screen.getByRole('button', { name: 'Busy' }));
    expect(onPress).not.toHaveBeenCalled();
  });
});
