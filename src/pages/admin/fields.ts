import type { ContentType } from '@contracts/content'
import { inputSchemas } from '@contracts/content'
import type { inferRouterOutputs } from '@trpc/server'
import type { AppRouter } from '../../../api/router'

/** One row from trpc.admin.list (union across the 7 content tables). */
export type AdminRow = inferRouterOutputs<AppRouter>['admin']['list'][number]

export type FieldKind =
  | 'text'
  | 'textarea'
  | 'array'
  | 'bool'
  | 'enum'
  | 'date'
  | 'number'
  | 'url'

export type EnumGroup = 'articleCategory' | 'serviceType' | 'eventCategory' | 'moodTag' | 'destination'

export interface FieldDef {
  /** Column base name; paired fields expand to `<key>En` / `<key>Ar`. */
  key: string
  kind: FieldKind
  /** EN/AR column pair, rendered side-by-side. */
  pair?: boolean
  /** Cleared values are stored as null (nullable columns). */
  nullable?: boolean
  /** Raw enum values for kind 'enum'. */
  options?: readonly string[]
  /** Label group under t.admin.enums for enum options. */
  enumGroup?: EnumGroup
  /** Render full-width instead of inside the EN/AR grid rhythm. */
  full?: boolean
  /** Hint text key under t.admin.editor. */
  hint?: 'urlHint' | 'priceHint'
  /** Default for kind 'bool' when creating. */
  boolDefault?: boolean
}

export interface TypeConfig {
  type: ContentType
  /** Base key of the display title (`<titleBase>En/Ar`). */
  titleBase: 'title' | 'name'
  /** Extra EN/AR bases joined into the row subtitle. */
  subtitleBases: string[]
  /** Raw columns appended as a meta line (dates, phones, enum tags). */
  metaCols?: { col: string; enumGroup?: EnumGroup }[]
  fields: FieldDef[]
}

/* Enum option lists pulled straight from the zod contracts so the admin UI
   can never drift from server-side validation. */
const articleCategories = inputSchemas.article.shape.category.options
const serviceTypes = inputSchemas.service.shape.type.options
const eventCategories = inputSchemas.event.shape.category.options
const moodTags = inputSchemas.story.shape.moodTag.options
const destinationValues = ['dead-sea', 'main-hot-springs', 'wadi-rum', 'petra', 'aqaba'] as const

const sourceFields: FieldDef[] = [
  { key: 'sourceName', kind: 'text', pair: true },
  { key: 'sourceUrl', kind: 'url', full: true, hint: 'urlHint' },
]

const updateFields: FieldDef[] = [
  { key: 'update', kind: 'textarea', pair: true, full: true },
  { key: 'updateSource', kind: 'text', pair: true },
  { key: 'updateDate', kind: 'date' },
]

export const TYPE_CONFIGS: TypeConfig[] = [
  {
    type: 'article',
    titleBase: 'title',
    subtitleBases: ['categoryLabel'],
    metaCols: [{ col: 'publishedAt' }],
    fields: [
      { key: 'slug', kind: 'text', full: true },
      { key: 'title', kind: 'text', pair: true },
      { key: 'dek', kind: 'textarea', pair: true, full: true },
      { key: 'category', kind: 'enum', options: articleCategories, enumGroup: 'articleCategory' },
      { key: 'categoryLabel', kind: 'text', pair: true },
      { key: 'body', kind: 'array', pair: true, full: true },
      ...sourceFields,
      { key: 'publishedAt', kind: 'date' },
      { key: 'readMins', kind: 'number' },
    ],
  },
  {
    type: 'doctor',
    titleBase: 'name',
    subtitleBases: ['specialty', 'city'],
    fields: [
      { key: 'name', kind: 'text', pair: true },
      { key: 'specialty', kind: 'text', pair: true },
      { key: 'languages', kind: 'array', full: true },
      { key: 'clinic', kind: 'text', pair: true },
      { key: 'city', kind: 'text', pair: true },
      { key: 'phone', kind: 'text' },
      { key: 'verified', kind: 'bool', boolDefault: false },
      { key: 'bio', kind: 'textarea', pair: true, full: true },
      { key: 'slots', kind: 'array', full: true },
      ...sourceFields,
      ...updateFields,
    ],
  },
  {
    type: 'pharmacy',
    titleBase: 'name',
    subtitleBases: ['area', 'city'],
    fields: [
      { key: 'name', kind: 'text', pair: true },
      { key: 'area', kind: 'text', pair: true },
      { key: 'city', kind: 'text', pair: true },
      { key: 'hours', kind: 'text', pair: true },
      { key: 'onDuty', kind: 'bool', boolDefault: false },
      { key: 'verified', kind: 'bool', boolDefault: false },
      { key: 'phone', kind: 'text', full: true },
      ...sourceFields,
      ...updateFields,
    ],
  },
  {
    type: 'service',
    titleBase: 'name',
    subtitleBases: ['provider', 'city'],
    fields: [
      { key: 'name', kind: 'text', pair: true },
      { key: 'type', kind: 'enum', options: serviceTypes, enumGroup: 'serviceType' },
      { key: 'city', kind: 'text', pair: true },
      { key: 'priceFrom', kind: 'number' },
      { key: 'provider', kind: 'text', pair: true },
      ...sourceFields,
    ],
  },
  {
    type: 'event',
    titleBase: 'title',
    subtitleBases: ['city', 'venue'],
    metaCols: [{ col: 'date' }],
    fields: [
      { key: 'title', kind: 'text', pair: true },
      { key: 'category', kind: 'enum', options: eventCategories, enumGroup: 'eventCategory' },
      { key: 'date', kind: 'date' },
      { key: 'time', kind: 'text', pair: true },
      { key: 'city', kind: 'text', pair: true },
      { key: 'venue', kind: 'text', pair: true },
      { key: 'host', kind: 'text', pair: true },
      { key: 'free', kind: 'bool', boolDefault: true },
      { key: 'price', kind: 'number', nullable: true, hint: 'priceHint' },
      ...sourceFields,
    ],
  },
  {
    type: 'episode',
    titleBase: 'title',
    subtitleBases: [],
    metaCols: [{ col: 'airedAt' }, { col: 'durationMins' }],
    fields: [
      { key: 'number', kind: 'number' },
      { key: 'airedAt', kind: 'date' },
      { key: 'durationMins', kind: 'number' },
      { key: 'title', kind: 'text', pair: true },
      { key: 'guests', kind: 'array', pair: true, full: true },
      { key: 'topics', kind: 'array', pair: true, full: true },
      { key: 'summary', kind: 'textarea', pair: true, full: true },
      { key: 'notes', kind: 'textarea', pair: true, full: true },
    ],
  },
  {
    type: 'story',
    titleBase: 'title',
    subtitleBases: ['author', 'city'],
    metaCols: [{ col: 'moodTag', enumGroup: 'moodTag' }],
    fields: [
      { key: 'author', kind: 'text', pair: true },
      { key: 'city', kind: 'text', pair: true },
      { key: 'title', kind: 'text', pair: true },
      { key: 'quote', kind: 'textarea', pair: true, full: true },
      { key: 'excerpt', kind: 'textarea', pair: true, full: true },
      { key: 'body', kind: 'array', pair: true, full: true },
      { key: 'destination', kind: 'enum', options: destinationValues, enumGroup: 'destination', nullable: true },
      { key: 'destinationLabel', kind: 'text', pair: true, nullable: true },
      { key: 'moodTag', kind: 'enum', options: moodTags, enumGroup: 'moodTag' },
    ],
  },
]

export function configFor(type: ContentType): TypeConfig {
  const cfg = TYPE_CONFIGS.find((c) => c.type === type)
  if (!cfg) throw new Error(`Unknown content type: ${type}`)
  return cfg
}

/* ---------- row access helpers ---------- */

/** Loose cell read over the 7-table row union. */
export function cell(row: AdminRow, col: string): unknown {
  return (row as unknown as Record<string, unknown>)[col]
}

export function rowTitle(row: AdminRow, cfg: TypeConfig, lang: 'en' | 'ar'): string {
  const primary = cell(row, `${cfg.titleBase}${lang === 'ar' ? 'Ar' : 'En'}`)
  const fallback = cell(row, `${cfg.titleBase}${lang === 'ar' ? 'En' : 'Ar'}`)
  return String(primary || fallback || `#${row.id}`)
}

export function rowSubtitle(row: AdminRow, cfg: TypeConfig, lang: 'en' | 'ar'): string {
  return cfg.subtitleBases
    .map((base) => String(cell(row, `${base}${lang === 'ar' ? 'Ar' : 'En'}`) ?? ''))
    .filter(Boolean)
    .join(' · ')
}

/* ---------- form state ---------- */

export type FormState = Record<string, string | boolean>

export function fieldColumns(f: FieldDef): string[] {
  return f.pair ? [`${f.key}En`, `${f.key}Ar`] : [f.key]
}

export function initialFormState(cfg: TypeConfig, row?: AdminRow): FormState {
  const state: FormState = {}
  for (const f of cfg.fields) {
    for (const col of fieldColumns(f)) {
      const raw = row ? cell(row, col) : undefined
      switch (f.kind) {
        case 'bool':
          state[col] = raw === undefined || raw === null ? (f.boolDefault ?? false) : Boolean(raw)
          break
        case 'array':
          state[col] = Array.isArray(raw) ? (raw as unknown[]).map(String).join('\n') : ''
          break
        default:
          state[col] = raw === undefined || raw === null ? '' : String(raw)
      }
    }
  }
  return state
}

/** Convert form state into a zod-ready data payload (empty required fields are
    omitted so zod reports them as missing; cleared nullable fields become null). */
export function buildPayload(cfg: TypeConfig, state: FormState): Record<string, unknown> {
  const data: Record<string, unknown> = {}
  for (const f of cfg.fields) {
    for (const col of fieldColumns(f)) {
      const v = state[col]
      switch (f.kind) {
        case 'bool':
          data[col] = v === true
          break
        case 'array':
          data[col] = String(v ?? '')
            .split('\n')
            .map((s) => s.trim())
            .filter(Boolean)
          break
        case 'number': {
          const s = String(v ?? '').trim()
          if (s === '') {
            if (f.nullable) data[col] = null
          } else {
            data[col] = Number(s)
          }
          break
        }
        case 'enum': {
          const s = String(v ?? '')
          if (s === '') {
            if (f.nullable) data[col] = null
          } else {
            data[col] = s
          }
          break
        }
        case 'url': {
          const s = String(v ?? '').trim()
          data[col] = s === '' ? '#' : s
          break
        }
        default: {
          const s = String(v ?? '')
          data[col] = f.nullable && s.trim() === '' ? null : s
        }
      }
    }
  }
  return data
}

export function validatePayload(type: ContentType, data: Record<string, unknown>) {
  return inputSchemas[type].safeParse(data)
}
