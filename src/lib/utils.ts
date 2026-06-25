import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** Merges Tailwind classes safely, resolving conflicts. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Formats a Date object to YYYY-MM-DD string. */
export function toDateString(date: Date): string {
  return date.toISOString().split('T')[0]
}

/** Returns today's date as YYYY-MM-DD. */
export function today(): string {
  return toDateString(new Date())
}

/** Returns yesterday's date as YYYY-MM-DD. */
export function yesterday(): string {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return toDateString(d)
}

/** Pads a number with leading zero if needed. */
export function pad(n: number): string {
  return String(n).padStart(2, '0')
}

/** Formats seconds into MM:SS display string. */
export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return pad(m) + ':' + pad(s)
}
