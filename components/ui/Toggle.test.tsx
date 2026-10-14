import { describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react-native';

import { Toggle } from '@/components/ui/Toggle';

describe('Toggle', () => {
  it('shows its label and reflects the value', async () => {
    await render(<Toggle label="Reminders" value onValueChange={() => {}} />);
    expect(screen.getByText('Reminders')).toBeTruthy();
    expect(screen.getByRole('switch', { name: 'Reminders' }).props.value).toBe(true);
  });

  it('reports changes', async () => {
    const onValueChange = jest.fn();
    await render(<Toggle label="Reminders" value={false} onValueChange={onValueChange} />);
    await fireEvent(screen.getByRole('switch', { name: 'Reminders' }), 'valueChange', true);
    expect(onValueChange).toHaveBeenCalledWith(true);
  });

  it('renders disabled', async () => {
    await render(<Toggle label="Reminders" value={false} disabled onValueChange={() => {}} />);
    expect(screen.getByRole('switch', { name: 'Reminders' }).props.disabled).toBe(true);
  });
});
