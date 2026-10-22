import { Compass, Scale, Radar, Bug, Layers, type LucideIcon } from 'lucide-react';

/**
 * Static UI helpers for LearningPath rendering.
 * All Tailwind class names here are literal strings so the Tailwind
 * scanner can see them — never build color class names dynamically.
 */

const ICONS: Record<string, LucideIcon> = {
  Compass,
  Scale,
  Radar,
  Bug,
  Layers
};

export const pathIcon = (iconName: string): LucideIcon => ICONS[iconName] || Compass;

/** Small solid dot used in pills/headers. */
export const pathDotClass = (accent: string): string => {
  switch (accent) {
    case 'amber': return 'bg-amber-400';
    case 'emerald': return 'bg-emerald-400';
    case 'purple': return 'bg-purple-400';
    default: return 'bg-cyan-400';
  }
};

/** Text/border tint for an active path pill. */
export const pathActiveTextClass = (accent: string): string => {
  switch (accent) {
    case 'amber': return 'text-amber-300';
    case 'emerald': return 'text-emerald-300';
    case 'purple': return 'text-purple-300';
    default: return 'text-cyan-300';
  }
};
