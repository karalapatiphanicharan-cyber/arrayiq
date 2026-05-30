import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(ms: number) {
  if (ms === 0) return "0ms";
  if (ms < 0.0001) return "< 0.0001ms";
  if (ms < 0.01) return `${ms.toFixed(5)}ms`;
  if (ms < 1) return `${ms.toFixed(4)}ms`;
  return `${ms.toFixed(3)}ms`;
}

export function formatNumber(n: number) {
  return new Intl.NumberFormat().format(n);
}
