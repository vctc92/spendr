import { describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react-native';

import { ListRow } from '@/components/ui/ListRow';

describe('ListRow', () => {
  it('renders a static two-line row', async () => {
    await render(<ListRow title="Rent" subtitle="Monthly" divider />);
    expect(screen.getByText('Rent')).toBeTruthy();
    expect(screen.getByText('Monthly')).toBeTruthy();
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('is pressable when onPress is given', async () => {
    const onPress = jest.fn();
    await render(<ListRow title="Tags" showChevron onPress={onPress} />);
    await fireEvent.press(screen.getByRole('button', { name: 'Tags' }));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
