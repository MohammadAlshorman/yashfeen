import { useEffect, useMemo, useState } from 'react'
import { trpc } from '@/providers/trpc'
import { useLanguage } from '@/context/LanguageProvider'
import { Chip } from '@/components/ui-yashfeen'
import { cn } from '@/lib/utils'
import type { ContentType } from '@contracts/content'
import type { AdminRow } from './fields'
import { cell, configFor, rowSubtitle, rowTitle } from './fields'
import { EditorForm } from './EditorForm'
import { ConfirmDialog } from './ConfirmDialog'

const primaryBtn =
  'inline-flex min-h-[44px] items-center justify-center rounded-pill bg-mood-deep px-6 text-small font-semibold text-cream-text transition-transform duration-instant ease-soft hover:opacity-90 active:scale-[.97] disabled:opacity-50'
const rowActionBtn =
  'inline-flex min-h-[44px] items-center justify-center rounded-pill px-3 text-small font-semibold transition-colors duration-instant ease-soft disabled:opacity-50'

type StatusFilter = 'all' | 'draft' | 'published'
type EditorState = { mode: 'create' } | { mode: 'edit'; row: AdminRow } | null

interface ContentListProps {
  type: ContentType
  rows: AdminRow[]
  isLoading: boolean
  isError: boolean
  onRetry: () => void
}

/**
 * List view for one content type: search (EN/AR title/name), status filter
 * chips, afya-card rows with status/sample chips, and row actions
 * (Edit · Publish/Unpublish · Delete with confirm). All mutations invalidate
 * trpc.admin.list.
 */
export function ContentList({ type, rows, isLoading, isError, onRetry }: ContentListProps) {
  const { t, lang } = useLanguage()
  const cfg = configFor(type)

  const [query, setQuery] = useState('')
  const [q, setQ] = useState('')
  const [status, setStatus] = useState<StatusFilter>('all')
  const [editor, setEditor] = useState<EditorState>(null)
  const [deleting, setDeleting] = useState<AdminRow | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  // Reset filters when switching tabs
  useEffect(() => {
    setQuery('')
    setQ('')
    setStatus('all')
    setActionError(null)
  }, [type])

  // Debounced search (200ms, mirrors Directory)
  useEffect(() => {
    const id = setTimeout(() => setQ(query.trim().toLowerCase()), 200)
    return () => clearTimeout(id)
  }, [query])

  const utils = trpc.useUtils()
  const invalidate = async () => {
    await utils.admin.list.invalidate()
  }
  const statusMut = trpc.admin.setStatus.useMutation({
    onSuccess: invalidate,
    onError: (e) => setActionError(e.message),
  })
  const removeMut = trpc.admin.remove.useMutation({
    onSuccess: async () => {
      setDeleting(null)
      await invalidate()
    },
    onError: (e) => setActionError(e.message),
  })

  const dateFmt = useMemo(
    () =>
      new Intl.DateTimeFormat(lang === 'ar' ? 'ar-JO-u-nu-latn' : 'en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
    [lang],
  )

  const filtered = useMemo(() => {
    return rows.filter((row) => {
      if (status !== 'all' && row.status !== status) return false
      if (!q) return true
      const bases = [cfg.titleBase, ...cfg.subtitleBases]
      return bases.some((base) => {
        const en = String(cell(row, `${base}En`) ?? '').toLowerCase()
        const ar = String(cell(row, `${base}Ar`) ?? '').toLowerCase()
        return en.includes(q) || ar.includes(q)
      })
    })
  }, [rows, status, q, cfg])

  const metaFor = (row: AdminRow): string[] =>
    (cfg.metaCols ?? [])
      .map(({ col, enumGroup }) => {
        const raw = cell(row, col)
        if (raw === null || raw === undefined || raw === '') return ''
        if (enumGroup) return (t.admin.enums[enumGroup] as Record<string, string>)[String(raw)] ?? String(raw)
        if (col === 'durationMins' || col === 'readMins') return t.common.mins(Number(raw))
        return String(raw)
      })
      .filter(Boolean)

  const busy = statusMut.isPending || removeMut.isPending

  return (
    <div>
      {/* ——— Toolbar: search + status filter + new entry ——— */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="w-full lg:max-w-sm">
          <label htmlFor="admin-search" className="sr-only">
            {t.admin.searchLabel}
          </label>
          <div className="relative">
            <svg
              aria-hidden="true"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              className="pointer-events-none absolute start-3.5 top-1/2 -translate-y-1/2 text-ink-muted"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            <input
              id="admin-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.admin.searchPlaceholder}
              className="min-h-[44px] w-full rounded-pill border border-line bg-raised ps-10 pe-4 text-small text-ink shadow-card placeholder:text-ink-muted"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2" role="group" aria-label={t.admin.statusFilterLabel}>
          {(['all', 'draft', 'published'] as const).map((s) => (
            <Chip key={s} active={status === s} onClick={() => setStatus(s)}>
              {t.admin.filters[s]}
            </Chip>
          ))}
        </div>

        <button type="button" onClick={() => setEditor({ mode: 'create' })} className={primaryBtn}>
          + {t.admin.newEntry}
        </button>
      </div>

      {actionError && (
        <p className="mt-4 rounded-sm border border-danger/40 bg-raised px-4 py-2.5 text-small text-danger" role="alert">
          {actionError}
        </p>
      )}

      {/* ——— Results ——— */}
      <p className="mt-5 text-small text-ink-muted" aria-live="polite">
        {isLoading ? '…' : t.admin.results(filtered.length)}
      </p>

      {isLoading ? (
        <ul className="mt-4 space-y-3" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <li key={i} className="afya-card h-24 animate-pulse" />
          ))}
        </ul>
      ) : isError ? (
        <div className="afya-card mt-4 p-6 text-center">
          <p className="text-body text-ink">{t.admin.loadError}</p>
          <button type="button" onClick={onRetry} className={cn(primaryBtn, 'mt-4')}>
            {t.admin.retry}
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="afya-card mt-4 p-8 text-center">
          <p className="text-body text-ink-muted">
            {rows.length === 0 ? t.admin.emptyType : t.admin.emptyFilter}
          </p>
          {rows.length > 0 && (
            <button
              type="button"
              onClick={() => {
                setQuery('')
                setQ('')
                setStatus('all')
              }}
              className="mt-3 inline-flex min-h-[44px] items-center rounded-pill px-4 text-small font-semibold text-interactive-accent underline-offset-4 hover:underline"
            >
              {t.admin.clearFilters}
            </button>
          )}
        </div>
      ) : (
        <ul className="mt-4 space-y-3">
          {filtered.map((row) => {
            const title = rowTitle(row, cfg, lang)
            const subtitle = rowSubtitle(row, cfg, lang)
            const meta = metaFor(row)
            const published = row.status === 'published'
            return (
              <li key={row.id} className="afya-card p-4 md:p-5">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-display text-h3 text-ink">{title}</h3>
                      <span
                        className={cn(
                          'inline-flex items-center rounded-pill px-2.5 py-0.5 text-micro font-semibold',
                          published ? 'bg-teal-soft text-teal-deep' : 'bg-sand-soft text-sand-deep',
                        )}
                      >
                        {published ? t.admin.status.published : t.admin.status.draft}
                      </span>
                      {row.sample && (
                        <span className="inline-flex items-center rounded-pill border border-line px-2.5 py-0.5 text-micro font-medium text-ink-muted">
                          {t.admin.sampleTag}
                        </span>
                      )}
                    </div>
                    {subtitle && <p className="mt-1 truncate text-small text-ink-muted">{subtitle}</p>}
                    <p className="mt-1 text-micro text-ink-muted">
                      {meta.length > 0 && <span>{meta.join(' · ')} · </span>}
                      <span>{t.admin.updated(dateFmt.format(row.updatedAt))}</span>
                    </p>
                  </div>

                  <div className="flex shrink-0 flex-wrap items-center gap-1">
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => setEditor({ mode: 'edit', row })}
                      className={cn(rowActionBtn, 'text-interactive hover:bg-surface')}
                    >
                      {t.admin.actions.edit}
                    </button>
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => {
                        setActionError(null)
                        statusMut.mutate({ type, id: row.id, status: published ? 'draft' : 'published' })
                      }}
                      className={cn(
                        rowActionBtn,
                        published ? 'text-sand-deep hover:bg-surface' : 'text-teal-deep hover:bg-surface',
                      )}
                    >
                      {published ? t.admin.actions.unpublish : t.admin.actions.publish}
                    </button>
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => {
                        setActionError(null)
                        setDeleting(row)
                      }}
                      className={cn(rowActionBtn, 'text-danger hover:bg-surface')}
                    >
                      {t.admin.actions.delete}
                    </button>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      )}

      {editor && (
        <EditorForm
          key={editor.mode === 'create' ? 'create' : editor.row.id}
          type={type}
          row={editor.mode === 'edit' ? editor.row : null}
          onClose={() => setEditor(null)}
        />
      )}
      {deleting && (
        <ConfirmDialog
          name={rowTitle(deleting, cfg, lang)}
          busy={removeMut.isPending}
          onConfirm={() => removeMut.mutate({ type, id: deleting.id })}
          onCancel={() => setDeleting(null)}
        />
      )}
    </div>
  )
}
