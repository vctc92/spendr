import { describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react-native';

import { ConfirmSheet } from '@/components/finance/ConfirmSheet';

const props = { title: 'Delete entry?', message: 'This cannot be undone.', confirmLabel: 'Delete' };

describe('ConfirmSheet', () => {
  it('confirms and cancels', async () => {
    const onConfirm = jest.fn();
    const onCancel = jest.fn();
    await render(<ConfirmSheet visible {...props} onConfirm={onConfirm} onCancel={onCancel} />);
    expect(screen.getByText('This cannot be undone.')).toBeTruthy();
    await fireEvent.press(screen.getByRole('button', { name: 'Delete' }));
    await fireEvent.press(screen.getByRole('button', { name: 'Cancel' }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('shows the loading state and blocks confirming', async () => {
    const onConfirm = jest.fn();
    await render(
      <ConfirmSheet visible {...props} loading onConfirm={onConfirm} onCancel={() => {}} />
    );
    await fireEvent.press(screen.getByRole('button', { name: 'Delete' }));
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it('requires the typed name before confirming', async () => {
    const onConfirm = jest.fn();
    await render(
      <ConfirmSheet
        visible
        {...props}
        confirmationText="Rao family"
        onConfirm={onConfirm}
        onCancel={() => {}}
      />
    );
    await fireEvent.press(screen.getByRole('button', { name: 'Delete' }));
    expect(onConfirm).not.toHaveBeenCalled();
    await fireEvent.changeText(screen.getByLabelText('Type Rao family to confirm'), 'Rao family');
    await fireEvent.press(screen.getByRole('button', { name: 'Delete' }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });
});
