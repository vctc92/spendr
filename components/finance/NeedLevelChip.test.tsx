import { describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react-native';

import { NeedLevelChip } from '@/components/finance/NeedLevelChip';
import type { NeedLevel } from '@/theme/tokens';

const LEVELS: [NeedLevel, string][] = [
  ['must_have', 'Must-have'],
  ['necessary', 'Necessary'],
  ['nice_to_have', 'Nice-to-have'],
  ['avoidable', 'Avoidable'],
];

describe('NeedLevelChip', () => {
  it.each(LEVELS)('renders %s selectable, selected and small', async (level, label) => {
    const onPress = jest.fn();
    await render(
      <>
        <NeedLevelChip level={level} onPress={onPress} />
        <NeedLevelChip level={level} selected onPress={onPress} />
        <NeedLevelChip level={level} size="sm" />
      </>
    );
    expect(screen.getAllByText(label)).toHaveLength(3);
    const buttons = screen.getAllByRole('button', { name: label });
    expect(buttons[1]!.props.accessibilityState).toMatchObject({ selected: true });
    await fireEvent.press(buttons[0]!);
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('ignores presses when disabled', async () => {
    const onPress = jest.fn();
    await render(<NeedLevelChip level="avoidable" disabled onPress={onPress} />);
    await fireEvent.press(screen.getByRole('button', { name: 'Avoidable' }));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('is not a button in the small display size', async () => {
    await render(<NeedLevelChip level="necessary" size="sm" />);
    expect(screen.queryByRole('button')).toBeNull();
  });
});
