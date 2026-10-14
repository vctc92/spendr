import { ArrowDown, ArrowUp, Minus } from 'lucide-react-native';

import { Badge } from '@/components/ui/Badge';
import { computeDelta, type DeltaKind } from '@/engine/delta';
import { DEFAULT_LOCALE, formatMoney, formatSpokenMoney } from '@/lib/format';
import { t } from '@/lib/i18n';

const ICON = { up: ArrowUp, down: ArrowDown, flat: Minus, 'no-data': Minus } as const;
const TONE = { credit: 'credit', debit: 'debit', neutral: 'neutral' } as const;

type Props = {
  current: number;
  /** null or undefined when there is no comparison period yet. */
  previous: number | null | undefined;
  kind: DeltaKind;
  currency: string;
  locale?: string;
  className?: string;
};

/** Owns the red/green rule (D-016): screens never choose these colours. */
export function DeltaBadge({
  current,
  previous,
  kind,
  currency,
  locale = DEFAULT_LOCALE,
  className,
}: Props) {
  const delta = computeDelta(current, previous, kind);
  const percent = delta.percent === null ? null : Math.round(Math.abs(delta.percent));

  let label: string;
  let spoken: string;
  if (delta.direction === 'no-data') {
    label = spoken = t('delta.noData');
  } else if (delta.direction === 'flat') {
    label = spoken = t('delta.flat');
  } else {
    const money = formatMoney(delta.changeMinor, currency, { locale, sign: 'always' });
    label = percent === null ? money : `${money} (${percent}%)`;
    const amount = formatSpokenMoney(delta.changeMinor, currency, locale);
    const key = delta.direction === 'up' ? 'delta.up' : 'delta.down';
    spoken =
      percent === null
        ? t(delta.direction === 'up' ? 'delta.upNoPercent' : 'delta.downNoPercent', { amount })
        : t(key, { amount, percent });
  }

  return (
    <Badge
      size="md"
      tone={TONE[delta.tone]}
      icon={ICON[delta.direction]}
      label={label}
      accessibilityLabel={spoken}
      className={className}
    />
  );
}
