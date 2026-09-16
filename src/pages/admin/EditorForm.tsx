import { useState } from 'react'
import type { z } from 'zod'
import { trpc } from '@/providers/trpc'
import { useLanguage } from '@/context/LanguageProvider'
import { Sheet } from '@/components/pages/directory/Sheet'
import { cn } from '@/lib/utils'
import type { ContentType } from '@contracts/content'
import type { createContentInput, updateContentInput } from '@contracts/content'
import type { AdminRow, FieldDef, FormState } from './fields'
import { buildPayload, configFor, fieldColumns, initialFormState, validatePayload } from './fields'
import {
  DateField,
  FieldShell,
  NumberField,
  SelectField,
  TextAreaField,
  TextField,
  ToggleField,
} from './inputs'

const primaryBtn =
  'inline-flex min-h-[44px] items-center justify-center rounded-pill bg-mood-deep px-6 text-small font-semibold text-cream-text transition-transform duration-instant ease-soft hover:opacity-90 active:scale-[.97] disabled:opacity-50'
const ghostBtn =
  'inline-flex min-h-[44px] items-center justify-center rounded-pill border border-line px-6 text-small font-semibold text-ink transition-colors duration-instant hover:bg-surface'

type CreateInput = z.infer<typeof createContentInput>
type UpdateInput = z.infer<typeof updateContentInput>

interface EditorFormProps {
  type: ContentType
  /** null → create a new draft; otherwise edit this row. */
  row: AdminRow | null
  onClose: () => void
}

/**
 * Create/edit slide-over for one CMS entry. Renders EVERY zod contract field:
 * EN/AR pairs side-by-side (AR dir="rtl" font-ar), string arrays as one-per-line
 * textareas, booleans as switches, enums as labeled selects, ISO dates as date
 * inputs, ints as number inputs. Client-side validation runs the same zod
 * schema the server uses; server errors surface inline. Creates land as drafts.
 */
export function EditorForm({ type, row, onClose }: EditorFormProps) {
  const { t } = useLanguage()
  const cfg = configFor(type)
  const [state, setState] = useState<FormState>(() => initialFormState(cfg, row ?? undefined))
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [serverError, setServerError] = useState<string | null>(null)

  const utils = trpc.useUtils()
  const onError = (e: { message: string }) => setServerError(e.message)
  const onSuccess = async () => {
    await utils.admin.list.invalidate()
    onClose()
  }
  const createMut = trpc.admin.create.useMutation({ onSuccess, onError })
  const updateMut = trpc.admin.update.useMutation({ onSuccess, onError })
  const saving = createMut.isPending || updateMut.isPending

  const setCol = (col: string, v: string | boolean) => {
    setState((s) => ({ ...s, [col]: v }))
    setErrors((e) => {
      if (!e[col]) return e
      const next = { ...e }
      delete next[col]
      return next
    })
  }

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault()
    setServerError(null)
    const payload = buildPayload(cfg, state)
    const parsed = validatePayload(type, payload)
    if (!parsed.success) {
      const next: Record<string, string> = {}
      for (const issue of parsed.error.issues) {
        const col = String(issue.path[0] ?? '')
        if (!col || next[col]) continue
        const v = payload[col]
        const empty =
          v === undefined || v === '' || (Array.isArray(v) && v.length === 0) || (typeof v === 'number' && Number.isNaN(v))
        next[col] = empty ? t.admin.editor.required : issue.message
      }
      setErrors(next)
      // Focus the first invalid control in config order
      for (const f of cfg.fields) {
        const col = fieldColumns(f).find((c) => next[c])
        if (col) {
          document.getElementById(`f-${col}`)?.focus()
          break
        }
      }
      return
    }
    setErrors({})
    if (row) {
      updateMut.mutate({ type, id: row.id, data: parsed.data } as UpdateInput)
    } else {
      createMut.mutate({ type, data: parsed.data } as CreateInput)
    }
  }

  const fieldLabel = (f: FieldDef) => t.admin.fields[f.key as keyof typeof t.admin.fields] ?? f.key
  const isRequired = (f: FieldDef) => !f.nullable && f.kind !== 'url'
  const titleId = 'admin-editor-title'
  const typeLabel = t.admin.typeSingular[type]

  const renderPair = (f: FieldDef) => {
    const [colEn, colAr] = fieldColumns(f)
    const label = fieldLabel(f)
    const pairControl = (col: string, localeLabel: string, rtl: boolean) => {
      const common = {
        id: `f-${col}`,
        value: String(state[col] ?? ''),
        onChange: (v: string) => setCol(col, v),
        error: !!errors[col],
        ariaLabel: `${label} — ${localeLabel}`,
      }
      return f.kind === 'text' ? (
        <TextField {...common} dir={rtl ? 'rtl' : 'ltr'} arabic={rtl} />
      ) : (
        <TextAreaField {...common} dir={rtl ? 'rtl' : 'ltr'} arabic={rtl} rows={f.kind === 'array' ? 5 : 3} />
      )
    }
    return (
      <fieldset key={f.key} className="md:col-span-2">
        <legend className="mb-1.5 flex items-baseline gap-2 text-small font-semibold text-ink">
          {label}
          {isRequired(f) ? (
            <span className="text-micro font-medium text-danger">{t.admin.editor.required}</span>
          ) : (
            <span className="text-micro font-medium text-ink-muted">{t.admin.editor.optional}</span>
          )}
        </legend>
        <div className="grid gap-4 md:grid-cols-2">
          {(
            [
              [colEn, t.admin.editor.enCol, false],
              [colAr, t.admin.editor.arCol, true],
            ] as const
          ).map(([col, localeLabel, rtl]) => (
            <div key={col}>
              <span className="mb-1 block text-micro uppercase text-ink-muted [html[lang=ar]_&]:normal-case" aria-hidden="true">
                {localeLabel}
              </span>
              {pairControl(col, localeLabel, rtl)}
              {errors[col] && (
                <p id={`f-${col}-error`} className="mt-1.5 text-small text-danger" role="alert">
                  {errors[col]}
                </p>
              )}
            </div>
          ))}
        </div>
        {f.kind === 'array' && <p className="mt-1.5 text-small text-ink-muted">{t.admin.editor.arrayHint}</p>}
      </fieldset>
    )
  }

  const renderSingle = (f: FieldDef) => {
    const col = f.key
    const id = `f-${col}`
    const label = fieldLabel(f)
    const hint =
      f.hint === 'urlHint' ? t.admin.editor.urlHint : f.hint === 'priceHint' ? t.admin.editor.priceHint : undefined

    if (f.kind === 'bool') {
      return (
        <div key={f.key} className={cn(f.full && 'md:col-span-2')}>
          <ToggleField
            id={id}
            label={label}
            checked={state[col] === true}
            onChange={(v) => setCol(col, v)}
            onLabel={t.admin.editor.toggleOn}
            offLabel={t.admin.editor.toggleOff}
          />
        </div>
      )
    }

    const common = {
      id,
      error: !!errors[col],
    }

    return (
      <FieldShell
        key={f.key}
        id={id}
        label={label}
        required={isRequired(f)}
        requiredLabel={t.admin.editor.required}
        error={errors[col]}
        hint={f.kind === 'array' ? t.admin.editor.arrayHint : hint}
        className={cn(f.full && 'md:col-span-2')}
      >
        {f.kind === 'enum' ? (
          <SelectField
            {...common}
            value={String(state[col] ?? '')}
            onChange={(v) => setCol(col, v)}
            placeholder={f.nullable ? t.admin.editor.noDestination : t.admin.editor.selectPlaceholder}
            options={(f.options ?? []).map((v) => ({
              value: v,
              label: f.enumGroup
                ? (t.admin.enums[f.enumGroup] as Record<string, string>)[v] ?? v
                : v,
            }))}
          />
        ) : f.kind === 'date' ? (
          <DateField {...common} value={String(state[col] ?? '')} onChange={(v) => setCol(col, v)} />
        ) : f.kind === 'number' ? (
          <NumberField {...common} min={0} value={String(state[col] ?? '')} onChange={(v) => setCol(col, v)} />
        ) : f.kind === 'array' || f.kind === 'textarea' ? (
          <TextAreaField
            {...common}
            rows={f.kind === 'array' ? 5 : 3}
            value={String(state[col] ?? '')}
            onChange={(v) => setCol(col, v)}
          />
        ) : (
          <TextField
            {...common}
            dir={f.kind === 'url' || f.key === 'phone' || f.key === 'slug' ? 'ltr' : undefined}
            value={String(state[col] ?? '')}
            onChange={(v) => setCol(col, v)}
          />
        )}
      </FieldShell>
    )
  }

  return (
    <Sheet open onRequestClose={onClose} labelledBy={titleId} className="md:max-w-[880px]">
      <form onSubmit={handleSubmit} noValidate>
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-micro uppercase text-interactive-accent [html[lang=ar]_&]:normal-case">
              {t.admin.types[type]}
            </p>
            <h2 id={titleId} className="mt-1 font-display text-h3 text-ink">
              {row ? t.admin.editor.editTitle(typeLabel) : t.admin.editor.createTitle(typeLabel)}
            </h2>
            {!row && <p className="mt-1 text-small text-ink-muted">{t.admin.editor.draftNote}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t.admin.editor.close}
            className="inline-flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-pill text-ink-muted transition-colors duration-instant hover:bg-surface hover:text-ink"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        {Object.keys(errors).length > 0 && (
          <p className="mb-4 rounded-sm border border-danger/40 bg-surface px-4 py-2.5 text-small text-danger" role="alert">
            {t.admin.editor.fixErrors}
          </p>
        )}
        {serverError && (
          <p className="mb-4 rounded-sm border border-danger/40 bg-surface px-4 py-2.5 text-small text-danger" role="alert">
            {t.admin.editor.serverError} {serverError}
          </p>
        )}

        <div className="grid gap-5 md:grid-cols-2">
          {cfg.fields.map((f) => (f.pair ? renderPair(f) : renderSingle(f)))}
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-end gap-3 border-t border-line pt-5">
          <button type="button" onClick={onClose} disabled={saving} className={ghostBtn}>
            {t.admin.cancel}
          </button>
          <button type="submit" disabled={saving} className={primaryBtn}>
            {saving ? t.admin.editor.saving : row ? t.admin.editor.saveEdit : t.admin.editor.saveCreate}
          </button>
        </div>
      </form>
    </Sheet>
  )
}
