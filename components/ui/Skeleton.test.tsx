import { describe, expect, it } from '@jest/globals';
import { render, screen } from '@testing-library/react-native';

import { Skeleton } from '@/components/ui/Skeleton';

describe('Skeleton', () => {
  it('renders', async () => {
    await render(<Skeleton className="h-4 w-32" />);
    expect(screen.toJSON()).not.toBeNull();
  });
});
