import type { Lang } from '@/context/LanguageProvider'

/** English weekday prefixes used in sample slot strings, e.g. 'Sun 10:30'. */
const EN_DAY_PREFIXES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const

/**
 * Localize a sample slot string ('Sun 10:30') — weekday prefix flips to Arabic,
 * numerals stay Western (design.md §2.9).
 */
export function localizeSlot(slot: string, lang: Lang, daysShort: string[]): string {
  if (lang !== 'ar') return slot
  const idx = EN_DAY_PREFIXES.findIndex((d) => slot.startsWith(d))
  return idx >= 0 ? slot.replace(EN_DAY_PREFIXES[idx], daysShort[idx] ?? EN_DAY_PREFIXES[idx]) : slot
}

/** Loose Jordanian mobile validation: 07XXXXXXXX / 7XXXXXXXX / +962 7X XXX XXXX. */
export function isValidJordanPhone(phone: string): boolean {
  let d = phone.replace(/\D/g, '')
  if (d.startsWith('00962')) d = d.slice(5)
  else if (d.startsWith('962')) d = d.slice(3)
  else if (d.startsWith('0')) d = d.slice(1)
  return /^7\d{8}$/.test(d)
}

/** Two-letter initials for a medallion, tolerant of 'Dr.' / 'د.' prefixes. */
export function initialsFor(name: string): string {
  const cleaned = name.replace(/^(Dr\.?|د\.?)\s*/u, '').trim()
  const parts = cleaned.split(/\s+/).filter(Boolean)
  const first = parts[0]?.[0] ?? ''
  const second = parts[1]?.[0] ?? ''
  return `${first}${second}`.toUpperCase()
}
