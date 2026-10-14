import { describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react-native';

import { TagChip } from '@/components/finance/TagChip';

describe('TagChip', () => {
  it('shows the tag with a hash', async () => {
    await render(<TagChip tag="late-night" />);
    expect(screen.getByText('#late-night')).toBeTruthy();
  });

  it('removes', async () => {
    const onRemove = jest.fn();
    await render(<TagChip tag="goa-trip" onRemove={onRemove} />);
    await fireEvent.press(screen.getByRole('button', { name: 'Remove #goa-trip' }));
    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it('renders the add-new variant', async () => {
    const onPress = jest.fn();
    await render(<TagChip addNew onPress={onPress} />);
    await fireEvent.press(screen.getByRole('button', { name: 'Add tag' }));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
