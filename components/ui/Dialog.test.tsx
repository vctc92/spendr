import { describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react-native';

import { Text } from '@/components/ui/Text';
import { Dialog } from '@/components/ui/Dialog';

describe('Dialog', () => {
  it('renders title, message, children and actions', async () => {
    const onPress = jest.fn();
    await render(
      <Dialog
        visible
        onClose={() => {}}
        title="Leave household?"
        message="You will lose access."
        actions={[{ label: 'Leave', variant: 'destructive', onPress }]}>
        <Text>Extra</Text>
      </Dialog>
    );
    expect(screen.getByText('Leave household?')).toBeTruthy();
    expect(screen.getByText('You will lose access.')).toBeTruthy();
    expect(screen.getByText('Extra')).toBeTruthy();
    await fireEvent.press(screen.getByRole('button', { name: 'Leave' }));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('closes from the scrim', async () => {
    const onClose = jest.fn();
    await render(<Dialog visible onClose={onClose} title="Title" actions={[]} />);
    await fireEvent.press(screen.getByRole('button', { name: 'Close', hidden: true }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('renders nothing when hidden', async () => {
    await render(<Dialog visible={false} onClose={() => {}} title="Hidden" actions={[]} />);
    expect(screen.queryByText('Hidden')).toBeNull();
  });
});
