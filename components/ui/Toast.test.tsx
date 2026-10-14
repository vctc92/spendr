import { describe, expect, it, jest } from '@jest/globals';
import { act, fireEvent, render, screen } from '@testing-library/react-native';

import { Check } from 'lucide-react-native';
import { Pressable } from 'react-native';

import { Text } from '@/components/ui/Text';
import { Toast, ToastProvider, useToast } from '@/components/ui/Toast';

function Trigger() {
  const { show } = useToast();
  return (
    <Pressable accessibilityRole="button" accessibilityLabel="show" onPress={() => show('Saved')}>
      <Text>go</Text>
    </Pressable>
  );
}

describe('Toast', () => {
  it('renders the message with an icon', async () => {
    await render(<Toast message="Saved · syncs when online" icon={Check} />);
    expect(screen.getByRole('alert')).toBeTruthy();
    expect(screen.getByText('Saved · syncs when online')).toBeTruthy();
  });

  it('shows from useToast and hides after the timeout', async () => {
    jest.useFakeTimers();
    await render(
      <ToastProvider>
        <Trigger />
      </ToastProvider>
    );
    await fireEvent.press(screen.getByRole('button', { name: 'show' }));
    expect(screen.getByText('Saved')).toBeTruthy();
    await act(async () => {
      await jest.advanceTimersByTimeAsync(3100);
    });
    expect(screen.queryByText('Saved')).toBeNull();
    jest.useRealTimers();
  });

  it('throws outside the provider', async () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    await expect(render(<Trigger />)).rejects.toThrow('ToastProvider');
    spy.mockRestore();
  });
});
