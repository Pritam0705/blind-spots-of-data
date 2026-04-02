
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const VISIBILITY_COLORS = {
  high: '#10b981', // Emerald 500
  moderate: '#3b82f6', // Blue 500
  low: '#f59e0b', // Amber 500
  blind: '#ef4444', // Red 500
  missing: '#374151', // Gray 700
};

export const getBandColor = (band: string) => {
  if (band.includes('High')) return VISIBILITY_COLORS.high;
  if (band.includes('Moderate')) return VISIBILITY_COLORS.moderate;
  if (band.includes('Low')) return VISIBILITY_COLORS.low;
  return VISIBILITY_COLORS.blind;
};
