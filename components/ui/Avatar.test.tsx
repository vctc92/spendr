import { describe, expect, it } from '@jest/globals';
import { render, screen } from '@testing-library/react-native';

import { Text } from '@/components/ui/Text';
import { Avatar, getInitials } from '@/components/ui/Avatar';

describe('getInitials', () => {
  it('uses first and last word', () => {
    expect(getInitials('Meera Rao')).toBe('MR');
    expect(getInitials('arjun kumar nair')).toBe('AN');
  });

  it('handles one word, extra spaces and empty names', () => {
    expect(getInitials('Arjun')).toBe('A');
    expect(getInitials('  Meera   Rao ')).toBe('MR');
    expect(getInitials('   ')).toBe('?');
  });
});

describe('Avatar', () => {
  it.each(['sm', 'md', 'lg'] as const)('renders size %s with initials', async (size) => {
    await render(<Avatar name="Meera Rao" size={size} />);
    expect(screen.getByText('MR')).toBeTruthy();
  });

  it('renders the primary tone and a corner slot', async () => {
    await render(
      <Avatar name="Arjun" tone="primary">
        <Text>dot</Text>
      </Avatar>
    );
    expect(screen.getByText('dot')).toBeTruthy();
  });
});
