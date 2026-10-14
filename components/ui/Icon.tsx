import type { LucideIcon } from 'lucide-react-native';
import { cssInterop } from 'nativewind';
import type { StyleProp, TextStyle } from 'react-native';

import { tokens } from '@/theme/tokens';

type Props = {
  icon: LucideIcon;
  size?: number;
  color?: string;
  className?: string;
  /** Filled in by NativeWind from className; the colour is forwarded as the `color` prop. */
  style?: StyleProp<TextStyle>;
};

function BaseIcon({ icon: Glyph, size = tokens.icon.row, color }: Props) {
  return <Glyph size={size} color={color} strokeWidth={tokens.icon.strokeWidth} />;
}

// Lets callers colour the icon with a text-token class, e.g. className="text-muted-foreground".
const StyledIcon = cssInterop(BaseIcon, {
  className: { target: 'style', nativeStyleToProp: { color: true } },
});

export type IconProps = Omit<Props, 'color' | 'style'>;

/** Lucide icon at the design-system stroke width; 20 in rows, 24 in the tab bar. */
export function Icon({ className = 'text-foreground', ...props }: IconProps) {
  return <StyledIcon className={className} {...props} />;
}
