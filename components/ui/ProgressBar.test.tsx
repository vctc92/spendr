import { describe, expect, it } from '@jest/globals';
import { render, screen } from '@testing-library/react-native';

import { ProgressBar } from '@/components/ui/ProgressBar';

describe('ProgressBar', () => {
  it.each(['foreground', 'primary', 'warning', 'debit'] as const)('renders %s', async (tone) => {
    await render(<ProgressBar value={0.5} tone={tone} accessibilityLabel="Budget" />);
    expect(screen.getByRole('progressbar', { name: 'Budget' })).toBeTruthy();
  });

  it.each([
    [0.426, 43],
    [-1, 0],
    [3, 100],
    [Number.NaN, 0],
  ])('maps %p to %p percent', async (value, now) => {
    await render(<ProgressBar value={value} accessibilityLabel="Budget" />);
    expect(screen.getByRole('progressbar').props.accessibilityValue).toMatchObject({ now });
  });
});
