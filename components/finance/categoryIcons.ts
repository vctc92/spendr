import {
  Baby,
  Banknote,
  Briefcase,
  Bus,
  Car,
  Film,
  Fuel,
  Gift,
  GraduationCap,
  HeartPulse,
  House,
  Landmark,
  PiggyBank,
  Plane,
  Shirt,
  ShoppingBag,
  ShoppingCart,
  Smartphone,
  Tag,
  Utensils,
  Wifi,
  Zap,
  type LucideIcon,
} from 'lucide-react-native';

// Categories store a lucide icon name (D-027). A curated map keeps the bundle small;
// unknown or missing names fall back to a tag.
const ICONS: Record<string, LucideIcon> = {
  baby: Baby,
  banknote: Banknote,
  briefcase: Briefcase,
  bus: Bus,
  car: Car,
  film: Film,
  fuel: Fuel,
  gift: Gift,
  'graduation-cap': GraduationCap,
  'heart-pulse': HeartPulse,
  house: House,
  landmark: Landmark,
  'piggy-bank': PiggyBank,
  plane: Plane,
  shirt: Shirt,
  'shopping-bag': ShoppingBag,
  'shopping-cart': ShoppingCart,
  smartphone: Smartphone,
  tag: Tag,
  utensils: Utensils,
  wifi: Wifi,
  zap: Zap,
};

export function getCategoryIcon(name: string | null | undefined): LucideIcon {
  return (name ? ICONS[name] : undefined) ?? Tag;
}
