import { describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react-native';

import { Receipt } from 'lucide-react-native';

import { EmptyState } from '@/components/finance/EmptyState';

describe('EmptyState', () => {
  it('renders title, description and action', async () => {
    const onPress = jest.fn();
    await render(
      <EmptyState
        icon={Receipt}
        title="No entries yet"
        description="Add your first expense."
        action={{ label: 'Add your first expense', onPress }}
      />
    );
    expect(screen.getByText('No entries yet')).toBeTruthy();
    expect(screen.getByText('Add your first expense.')).toBeTruthy();
    await fireEvent.press(screen.getByRole('button', { name: 'Add your first expense' }));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('renders without description or action', async () => {
    await render(<EmptyState icon={Receipt} title="Nothing here" />);
    expect(screen.getByText('Nothing here')).toBeTruthy();
    expect(screen.queryByRole('button')).toBeNull();
  });
});
