import {
  LayoutGrid,
  Palette,
  ShieldCheck,
  WifiOff,
  EyeOff,
  Move,
  Code2,
  Rocket,
  Star,
  Zap,
  Settings,
  Globe,
  Lock,
  Database,
  FileText,
  Layers,
  BarChart3,
  Sparkles,
  Heart,
  Bell,
  FileQuestion,
  Inbox,
  HelpCircle,
} from 'lucide-react';

// A curated, explicitly-imported map (rather than `import * as icons`) so
// the bundler only includes the handful of glyphs this app actually uses,
// instead of the entire lucide-react icon set.
const ICON_MAP = {
  LayoutGrid,
  Palette,
  ShieldCheck,
  WifiOff,
  EyeOff,
  Move,
  Code2,
  Rocket,
  Star,
  Zap,
  Settings,
  Globe,
  Lock,
  Database,
  FileText,
  Layers,
  BarChart3,
  Sparkles,
  Heart,
  Bell,
  FileQuestion,
  Inbox,
  HelpCircle,
};

/**
 * Renders a lucide-react icon by name (a plain string is what gets stored
 * in localStorage for modules/features/nav, since components can't be
 * serialized to JSON). Falls back to a generic icon if the stored name
 * doesn't match -- keeps old/invalid data from crashing the page.
 */
export default function Icon({ name, className = 'w-5 h-5', ...rest }) {
  const Cmp = (name && ICON_MAP[name]) || HelpCircle;
  return <Cmp className={className} aria-hidden="true" {...rest} />;
}

export const ICON_CHOICES = [
  'LayoutGrid',
  'Palette',
  'ShieldCheck',
  'WifiOff',
  'EyeOff',
  'Move',
  'Code2',
  'Rocket',
  'Star',
  'Zap',
  'Settings',
  'Globe',
  'Lock',
  'Database',
  'FileText',
  'Layers',
  'BarChart3',
  'Sparkles',
  'Heart',
  'Bell',
];
