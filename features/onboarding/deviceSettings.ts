/** Time zone and locale of this device, passed to the backend as the member's own settings (D-041). */
export function deviceSettings(): { timeZone: string; locale: string } {
  const resolved = Intl.DateTimeFormat().resolvedOptions();
  return { timeZone: resolved.timeZone || 'UTC', locale: resolved.locale || 'en' };
}
