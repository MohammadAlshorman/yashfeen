/**
 * Yashfeen typed local data layer (design.md §2.11) — no network calls.
 * Every entry is EN/AR-paired via `Localized` and flagged `_sample: true`.
 */

/** EN/AR-paired string. Render with `pick(loc, lang)` from '@/data'. */
export interface Localized {
  en: string
  ar: string
}

export interface Source {
  name: Localized
  /** Placeholder '#' in sample data — external links wire in later (rel="nofollow"). */
  url: string
}

export interface SampleFlag {
  /** Local seed entries are all `true`; CMS API rows carry `false` for non-sample content. */
  _sample: boolean
}

export type ArticleCategory = 'public-health' | 'nutrition' | 'mental-health' | 'research' | 'policy'

export interface Article extends SampleFlag {
  id: string
  slug: string
  title: Localized
  dek: Localized
  category: ArticleCategory
  categoryLabel: Localized
  body: Localized[]
  source: Source
  /** ISO date string */
  publishedAt: string
  readMins: number
  disclaimer: true
}

export interface Doctor extends SampleFlag {
  id: string
  name: Localized
  specialty: Localized
  languages: string[]
  clinic: Localized
  city: Localized
  phone: string
  verified: boolean
  bio: Localized
  /** e.g. 'Sun 10:30' */
  slots: string[]
  source: Source
  /** Short verified update text for the Verified section (verified.md). */
  update: Localized
  updateSource: Localized
  updateDate: string
}

export interface Pharmacy extends SampleFlag {
  id: string
  name: Localized
  area: Localized
  city: Localized
  hours: Localized
  onDuty: boolean
  phone: string
  verified: boolean
  source: Source
  update: Localized
  updateSource: Localized
  updateDate: string
}

export type ServiceType = 'lab' | 'imaging' | 'physio' | 'home-care'

export interface Service extends SampleFlag {
  id: string
  name: Localized
  type: ServiceType
  city: Localized
  /** JOD */
  priceFrom: number
  provider: Localized
  source: Source
}

export type EventCategory = 'screening' | 'workshop' | 'walk' | 'talk'

export interface AfyaEvent extends SampleFlag {
  id: string
  title: Localized
  category: EventCategory
  /** ISO date string (sample window Mar–Aug 2025, events.md) */
  date: string
  time: Localized
  city: Localized
  venue: Localized
  host: Localized
  free: boolean
  /** JOD, when not free */
  price?: number
  source: Source
}

export interface Episode extends SampleFlag {
  id: string
  number: number
  title: Localized
  guests: Localized[]
  /** ISO date string */
  airedAt: string
  durationMins: number
  topics: Localized[]
  summary: Localized
  notes: Localized
}

export interface Story extends SampleFlag {
  id: string
  /** First name + initial */
  author: Localized
  city: Localized
  title: Localized
  /** The story's most human line — Fraunces italic quote hook */
  quote: Localized
  excerpt: Localized
  body: Localized[]
  destination?: 'dead-sea' | 'main-hot-springs' | 'wadi-rum' | 'petra' | 'aqaba'
  destinationLabel?: Localized
  moodTag: 'calm' | 'energized' | 'stressed' | 'tired' | 'joyful'
}
