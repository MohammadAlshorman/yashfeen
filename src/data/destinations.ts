import type { Localized } from './types'

/**
 * Destination metadata for the 5 Medical Tourism chapters (design.md §2.3).
 * Used by Home's destination ribbon and the /medical-tourism page.
 */
export type DestinationId = 'dead-sea' | 'main-hot-springs' | 'wadi-rum' | 'petra' | 'aqaba'

export interface Destination {
  id: DestinationId
  /** route anchor, e.g. /medical-tourism#dead-sea */
  anchor: string
  name: Localized
  arWordmark: string
  promise: Localized
  /** 3-color sub-palette (canonical — never mood-shifted) */
  palette: [string, string, string]
  /** texture utility class from index.css (§2.3 signature pattern) */
  textureClass: 'texture-salt-lattice' | 'texture-steam-bands' | 'texture-dune-contours' | 'texture-striation' | 'texture-reef'
  /** minimal landmark glyph id (see DestinationGlyph in Home) */
  glyph: 'wave' | 'steam' | 'dune' | 'facade' | 'reef'
}

export const destinations: Destination[] = [
  {
    id: 'dead-sea',
    anchor: 'dead-sea',
    name: { en: 'Dead Sea', ar: 'البحر الميت' },
    arWordmark: 'البحر الميت',
    promise: {
      en: 'The lowest place on earth, made to lift you.',
      ar: 'أخفض بقعة على الأرض، خُلقت لترفعك.',
    },
    palette: ['#2E6B69', '#F4EFE6', '#8A9A97'],
    textureClass: 'texture-salt-lattice',
    glyph: 'wave',
  },
  {
    id: 'main-hot-springs',
    anchor: 'main-hot-springs',
    name: { en: 'Ma’in Hot Springs', ar: 'حمامات ماعين' },
    arWordmark: 'حمامات ماعين',
    promise: {
      en: 'Where the mountain gives its warmth back to you.',
      ar: 'حيث يردّ الجبل دفئه إليك.',
    },
    palette: ['#C26A4A', '#F6EBDD', '#3E3A36'],
    textureClass: 'texture-steam-bands',
    glyph: 'steam',
  },
  {
    id: 'wadi-rum',
    anchor: 'wadi-rum',
    name: { en: 'Wadi Rum', ar: 'وادي رم' },
    arWordmark: 'وادي رم',
    promise: {
      en: 'Silence you can walk through.',
      ar: 'صمتٌ تستطيع أن تمشي فيه.',
    },
    palette: ['#D9A05B', '#1B1611', '#B76E58'],
    textureClass: 'texture-dune-contours',
    glyph: 'dune',
  },
  {
    id: 'petra',
    anchor: 'petra',
    name: { en: 'Petra', ar: 'البتراء' },
    arWordmark: 'البتراء',
    promise: {
      en: 'Carved by water and time; a city that heals wonder.',
      ar: 'نحتها الماء والزمن؛ مدينةٌ تُعيد إليك الدهشة.',
    },
    palette: ['#B76E58', '#EFE3D3', '#5C4033'],
    textureClass: 'texture-striation',
    glyph: 'facade',
  },
  {
    id: 'aqaba',
    anchor: 'aqaba',
    name: { en: 'Aqaba', ar: 'العقبة' },
    arWordmark: 'العقبة',
    promise: {
      en: 'The Red Sea at the desert’s door.',
      ar: 'البحر الأحمر على باب الصحراء.',
    },
    palette: ['#3E7E8F', '#D9704E', '#F6F2E8'],
    textureClass: 'texture-reef',
    glyph: 'reef',
  },
]
