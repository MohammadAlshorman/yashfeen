import { useLanguage } from '@/context/LanguageProvider'
import { Sheet } from '@/components/pages/directory/Sheet'

const dangerBtn =
  'inline-flex min-h-[44px] items-center justify-center rounded-pill bg-danger px-6 text-small font-semibold text-surface transition-transform duration-instant ease-soft hover:opacity-90 active:scale-[.97] disabled:opacity-50'
const ghostBtn =
  'inline-flex min-h-[44px] items-center justify-center rounded-pill border border-line px-6 text-small font-semibold text-ink transition-colors duration-instant hover:bg-surface'

interface ConfirmDialogProps {
  /** Localized entry title shown in the dialog heading. */
  name: string
  busy: boolean
  onConfirm: () => void
  onCancel: () => void
}

/** Irreversible-delete confirmation (alertdialog semantics via the shared Sheet). */
export function ConfirmDialog({ name, busy, onConfirm, onCancel }: ConfirmDialogProps) {
  const { t } = useLanguage()
  const titleId = 'admin-confirm-delete-title'
  return (
    <Sheet open onRequestClose={busy ? () => {} : onCancel} labelledBy={titleId}>
      <h2 id={titleId} className="font-display text-h3 text-ink">
        {t.admin.deleteTitle(name)}
      </h2>
      <p className="mt-2 text-body text-ink-muted">{t.admin.deleteBody}</p>
      <div className="mt-6 flex flex-wrap items-center justify-end gap-3">
        <button type="button" onClick={onCancel} disabled={busy} className={ghostBtn} data-autofocus>
          {t.admin.cancel}
        </button>
        <button type="button" onClick={onConfirm} disabled={busy} className={dangerBtn}>
          {busy ? t.admin.deleting : t.admin.deleteConfirm}
        </button>
      </div>
    </Sheet>
  )
}
