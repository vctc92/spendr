import { useColorScheme } from 'nativewind';

import { tokens, type ColorToken } from '@/theme/tokens';

/** Hex values for native props that cannot take a className (spinner, placeholder colour). */
export function useThemeColors(): Record<ColorToken, string> {
  const { colorScheme } = useColorScheme();
  return tokens.color[colorScheme === 'dark' ? 'dark' : 'light'];
}
