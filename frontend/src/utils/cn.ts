import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(ms: number) {
  if (ms < 0.001) return "< 0.001ms";
  return `${ms.toFixed(3)}ms`;
}

export function formatNumber(n: number) {
  return new Intl.NumberFormat().format(n);
}
