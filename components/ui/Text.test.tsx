import { describe, expect, it } from '@jest/globals';
import { render, screen } from '@testing-library/react-native';

import { Text } from '@/components/ui/Text';

const VARIANTS = {
  display: 'text-display',
  title: 'text-title',
  heading: 'text-heading',
  body: 'text-body',
  label: 'text-label',
  caption: 'text-caption',
} as const;

const TONES = {
  default: 'text-foreground',
  muted: 'text-muted-foreground',
  primary: 'text-primary',
  credit: 'text-credit-text',
  debit: 'text-debit',
  warning: 'text-warning-text',
  onPrimary: 'text-primary-foreground',
} as const;

describe('Text', () => {
  it.each(Object.keys(VARIANTS) as (keyof typeof VARIANTS)[])(
    'renders variant %s',
    async (variant) => {
      await render(<Text variant={variant}>Sample</Text>);
      expect(screen.getByText('Sample')).toBeTruthy();
    }
  );

  it.each(Object.keys(TONES) as (keyof typeof TONES)[])('renders tone %s', async (tone) => {
    await render(<Text tone={tone}>Sample</Text>);
    expect(screen.getByText('Sample')).toBeTruthy();
  });

  it('renders numeric text', async () => {
    await render(<Text numeric>₹1,23,456</Text>);
    expect(screen.getByText('₹1,23,456')).toBeTruthy();
  });
});
