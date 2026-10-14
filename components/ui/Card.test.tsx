import { describe, expect, it } from '@jest/globals';
import { render, screen } from '@testing-library/react-native';

import { Text } from '@/components/ui/Text';
import { Card } from '@/components/ui/Card';

describe('Card', () => {
  it.each(['default', 'inset'] as const)('renders %s with children', async (variant) => {
    await render(
      <Card variant={variant} padding="sm">
        <Text>Inside</Text>
      </Card>
    );
    expect(screen.getByText('Inside')).toBeTruthy();
  });
});
