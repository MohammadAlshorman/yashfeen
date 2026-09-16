/**
 * Mood engine definitions — design.md §2.2 (exact token sets).
 * The mood shifts accent application + hero ambiance only; never the brand palette.
 */
export type MoodId = 'calm' | 'energized' | 'stressed' | 'tired' | 'joyful'

export interface MoodDef {
  id: MoodId
  /** --mood-accent */
  accent: string
  /** --mood-accent-deep (text-safe on light) */
  accentDeep: string
  /** --mood-accent-soft */
  accentSoft: string
  /** --mood-glow (orb/halo) */
  glow: string
  /** --mood-ambiance (hero overlay gradient) */
  ambiance: string
  /** sun-disc hue tint per mood */
  sunHue: [string, string]
}

export const MOODS: Record<MoodId, MoodDef> = {
  calm: {
    id: 'calm',
    accent: '#4E8D8B',
    accentDeep: '#35605F',
    accentSoft: '#C4DEDD',
    glow: 'rgba(78,141,139,.45)',
    ambiance: 'linear-gradient(180deg, #4E8D8B14 0%, #D9A05B33 55%, #B76E5826 100%)',
    sunHue: ['#F6EBDD', '#D9A05B'],
  },
  energized: {
    id: 'energized',
    accent: '#D9A05B',
    accentDeep: '#9A6A2E',
    accentSoft: '#F0DDC0',
    glow: 'rgba(217,160,91,.5)',
    ambiance: 'linear-gradient(180deg, #D9A05B2E 0%, #E89B4A3D 50%, #B76E5833 100%)',
    sunHue: ['#FBF7EF', '#E89B4A'],
  },
  stressed: {
    id: 'stressed',
    accent: '#B76E58',
    accentDeep: '#8F4F3D',
    accentSoft: '#E8C9BC',
    glow: 'rgba(183,110,88,.42)',
    ambiance: 'linear-gradient(180deg, #B76E5826 0%, #C98A6B2E 55%, #8F4F3D2B 100%)',
    sunHue: ['#F6EBDD', '#C98A6B'],
  },
  tired: {
    id: 'tired',
    accent: '#7A6A8F',
    accentDeep: '#5A4E6E',
    accentSoft: '#D8CFE3',
    glow: 'rgba(122,106,143,.4)',
    ambiance: 'linear-gradient(180deg, #1B161140 0%, #7A6A8F33 55%, #D9A05B29 100%)',
    sunHue: ['#EFE7DA', '#B9AC9A'],
  },
  joyful: {
    id: 'joyful',
    accent: '#A63A3A',
    accentDeep: '#A63A3A',
    accentSoft: '#F0CFCB',
    glow: 'rgba(198,110,74,.48)',
    ambiance: 'linear-gradient(180deg, #E89B4A33 0%, #D9704E30 55%, #A63A3A26 100%)',
    sunHue: ['#FBF7EF', '#E89B4A'],
  },
}

export const MOOD_ORDER: MoodId[] = ['calm', 'energized', 'stressed', 'tired', 'joyful']

export const MOOD_STORAGE_KEY = 'afya-mood'

export function isMoodId(value: unknown): value is MoodId {
  return typeof value === 'string' && value in MOODS
}
