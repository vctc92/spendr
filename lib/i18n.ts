import en from '@/locales/en.json';

export type TranslationKey = keyof typeof en;

/** Add a locale by dropping a JSON file in locales/ and selecting it here. */
const strings: Record<TranslationKey, string> = en;

export function t(key: TranslationKey, params?: Record<string, string | number>): string {
  const template = strings[key];
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (match, name: string) =>
    name in params ? String(params[name]) : match
  );
}
