import { describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react-native';

import { CategoryChip } from '@/components/finance/CategoryChip';
import { getCategoryIcon } from '@/components/finance/categoryIcons';

describe('getCategoryIcon', () => {
  it('maps known names and falls back for unknown or missing ones', () => {
    expect(getCategoryIcon('utensils')).not.toBe(getCategoryIcon('zap'));
    expect(getCategoryIcon('nope')).toBe(getCategoryIcon('tag'));
    expect(getCategoryIcon(null)).toBe(getCategoryIcon('tag'));
    expect(getCategoryIcon(undefined)).toBe(getCategoryIcon('tag'));
  });
});

describe('CategoryChip', () => {
  it('renders default, selected and disabled', async () => {
    const onPress = jest.fn();
    await render(
      <>
        <CategoryChip category={{ name: 'Groceries', icon: 'shopping-cart' }} onPress={onPress} />
        <CategoryChip category={{ name: 'Food', icon: 'utensils' }} selected onPress={onPress} />
        <CategoryChip category={{ name: 'Misc' }} disabled onPress={onPress} />
      </>
    );
    expect(screen.getByRole('button', { name: 'Food' }).props.accessibilityState).toMatchObject({
      selected: true,
    });
    await fireEvent.press(screen.getByRole('button', { name: 'Groceries' }));
    await fireEvent.press(screen.getByRole('button', { name: 'Misc' }));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
