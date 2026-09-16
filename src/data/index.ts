/**
 * Yashfeen data layer barrel — page agents import from '@/data' or '@/data/<module>'.
 * All entries are EN/AR-paired and flagged `_sample: true` (design.md §2.11).
 */
export type * from './types'
export { articles } from './articles'
export { doctors } from './doctors'
export { pharmacies } from './pharmacies'
export { services } from './services'
export { events } from './events'
export { episodes } from './episodes'
export { stories } from './stories'
export { destinations } from './destinations'
export type { Destination, DestinationId } from './destinations'

import type { Localized } from './types'
import type { Lang } from '@/context/LanguageProvider'

/** Pick the active-language string from a Localized pair. */
export function pick(loc: Localized, lang: Lang): string {
  return lang === 'ar' ? loc.ar : loc.en
}

/** Format an ISO date for display (Western numerals in both languages, §2.9). */
export function formatDate(iso: string, lang: Lang): string {
  const d = new Date(`${iso}T00:00:00`)
  return new Intl.DateTimeFormat(lang === 'ar' ? 'ar-JO-u-nu-latn' : 'en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(d)
}
