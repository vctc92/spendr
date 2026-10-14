import { describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react-native';

import { Text } from '@/components/ui/Text';
import { Sheet } from '@/components/ui/Sheet';

describe('Sheet', () => {
  it('renders title and content when visible', async () => {
    await render(
      <Sheet visible onClose={() => {}} title="Log Entry">
        <Text>Body</Text>
      </Sheet>
    );
    expect(screen.getByText('Log Entry')).toBeTruthy();
    expect(screen.getByText('Body')).toBeTruthy();
  });

  it('closes from the close button', async () => {
    const onClose = jest.fn();
    await render(<Sheet visible onClose={onClose} title="Log Entry" />);
    await fireEvent.press(screen.getAllByRole('button', { name: 'Close' })[0]!);
    expect(onClose).toHaveBeenCalled();
  });

  it('renders nothing when never shown', async () => {
    await render(<Sheet visible={false} onClose={() => {}} title="Hidden" />);
    expect(screen.queryByText('Hidden')).toBeNull();
  });
});
