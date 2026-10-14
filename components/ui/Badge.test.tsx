import { describe, expect, it } from '@jest/globals';
import { render, screen } from '@testing-library/react-native';

import { Check } from 'lucide-react-native';

import { Badge } from '@/components/ui/Badge';

describe('Badge', () => {
  it.each(['neutral', 'primary', 'credit', 'warning', 'debit'] as const)(
    'renders %s',
    async (tone) => {
      await render(<Badge label="Synced" tone={tone} icon={Check} />);
      expect(screen.getByText('Synced')).toBeTruthy();
    }
  );
});
