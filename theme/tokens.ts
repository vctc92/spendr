/**
 * Spendr design tokens for code that cannot use className
 * (charts, navigation theme, status bar, native APIs).
 * MUST stay identical to global.css and tailwind.config.js (PRD §3.3).
 */

export type ColorScheme = 'light' | 'dark';

const light = {
  background: '#FAFAFA',
  card: '#FFFFFF',
  foreground: '#18181B',
  muted: '#F4F4F5',
  mutedForeground: '#71717A',
  border: '#E4E4E7',
  primary: '#4F46E5',
  primaryForeground: '#FFFFFF',
  destructive: '#DC2626',
  destructiveForeground: '#FFFFFF',
  credit: '#16A34A',
  debit: '#DC2626',
  warning: '#D97706',
  creditText: '#15803D',
  warningText: '#B45309',
  scrim: 'rgba(0, 0, 0, 0.4)',
  needMust: '#0F766E',
  needNecessary: '#2563EB',
  needNice: '#A16207',
  needAvoidable: '#BE185D',
} as const;

export type ColorToken = keyof typeof light;

const dark: Record<ColorToken, string> = {
  background: '#0E0E10',
  card: '#18181B',
  foreground: '#F4F4F5',
  muted: '#232326',
  mutedForeground: '#A1A1AA',
  border: '#27272A',
  primary: '#818CF8',
  primaryForeground: '#0E0E10',
  destructive: '#F87171',
  destructiveForeground: '#0E0E10',
  credit: '#4ADE80',
  debit: '#F87171',
  warning: '#FBBF24',
  creditText: '#4ADE80',
  warningText: '#FBBF24',
  scrim: 'rgba(0, 0, 0, 0.7)',
  needMust: '#2DD4BF',
  needNecessary: '#60A5FA',
  needNice: '#FACC15',
  needAvoidable: '#F472B6',
};

export const tokens = {
  color: { light, dark } as Record<ColorScheme, Record<ColorToken, string>>,

  font: {
    regular: 'Inter_400Regular',
    medium: 'Inter_500Medium',
    semibold: 'Inter_600SemiBold',
  },

  fontSize: {
    display: { size: 32, lineHeight: 40 },
    title: { size: 20, lineHeight: 28 },
    heading: { size: 17, lineHeight: 24 },
    body: { size: 15, lineHeight: 22 },
    label: { size: 13, lineHeight: 18 },
    caption: { size: 11, lineHeight: 16 },
  },

  /** 4-pt grid, in px. */
  space: { 1: 4, 2: 8, 3: 12, 4: 16, 6: 24, 8: 32, 12: 48 },
  screenPadding: 16,
  cardGap: 12,

  radius: { input: 8, chip: 8, card: 12, sheet: 16, full: 9999 },

  motion: { fast: 150, base: 250 },

  icon: { row: 20, tab: 24, strokeWidth: 1.75 },

  touchTarget: 44,
} as const;

export type NeedLevel = 'must_have' | 'necessary' | 'nice_to_have' | 'avoidable';

const needToken: Record<NeedLevel, ColorToken> = {
  must_have: 'needMust',
  necessary: 'needNecessary',
  nice_to_have: 'needNice',
  avoidable: 'needAvoidable',
};

/** Colour for a need level, e.g. chart series. */
export function needLevelColor(level: NeedLevel, scheme: ColorScheme): string {
  return tokens.color[scheme][needToken[level]];
}

/** Tailwind background class for a need level, e.g. dots in rows and chips. */
export const needLevelClass: Record<NeedLevel, string> = {
  must_have: 'bg-need-must',
  necessary: 'bg-need-necessary',
  nice_to_have: 'bg-need-nice',
  avoidable: 'bg-need-avoidable',
};
