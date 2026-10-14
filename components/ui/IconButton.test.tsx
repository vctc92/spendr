import { describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react-native';

import { X } from 'lucide-react-native';

import { IconButton } from '@/components/ui/IconButton';

describe('IconButton', () => {
  it.each(['ghost', 'tonal', 'primary'] as const)('renders %s', async (variant) => {
    await render(<IconButton icon={X} variant={variant} accessibilityLabel="Close" />);
    expect(screen.getByRole('button', { name: 'Close' })).toBeTruthy();
  });

  it('renders small and disabled', async () => {
    const onPress = jest.fn();
    await render(
      <IconButton icon={X} size="sm" disabled accessibilityLabel="Close" onPress={onPress} />
    );
    await fireEvent.press(screen.getByRole('button', { name: 'Close' }));
    expect(onPress).not.toHaveBeenCalled();
  });
});
