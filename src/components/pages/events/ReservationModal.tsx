import { useState } from 'react'
import type { AfyaEvent } from '@/data'
import { pick, formatDate } from '@/data'
import { submitBookingRequest } from '@/integrations/booking.stub'
import { useLanguage } from '@/context/LanguageProvider'
import { Sheet } from '@/components/pages/directory/Sheet'
import { isValidJordanPhone } from '@/components/pages/directory/utils'
import { cn } from '@/lib/utils'

interface ReservationModalProps {
  event: AfyaEvent | null
  onClose: () => void
}

const inputClass =
  'min-h-[44px] w-full rounded-sm border border-line bg-surface px-4 py-2.5 text-body text-ink placeholder:text-ink-muted'
const primaryBtn =
  'inline-flex min-h-[44px] items-center justify-center rounded-pill bg-mood-deep px-6 text-small font-semibold text-cream-text transition-transform duration-instant ease-soft hover:opacity-90 active:scale-[.97] disabled:opacity-50'
const ghostBtn =
  'inline-flex min-h-[44px] items-center justify-center rounded-pill border border-line px-6 text-small font-semibold text-ink transition-colors duration-instant hover:bg-surface'

/**
 * Event reservation flow (events.md §3): name + phone → confirmation state via
 * the booking stub (client-side AF-… reference — sample flow, nothing is sent).
 * STUB equivalent: POST /event-reservations. The inner dialog is keyed by event
 * id so each reservation starts from a clean state (no reset effects).
 */
export function ReservationModal({ event, onClose }: ReservationModalProps) {
  if (!event) return null
  return <ReservationDialog key={event.id} event={event} onClose={onClose} />
}

function ReservationDialog({ event, onClose }: { event: AfyaEvent; onClose: () => void }) {
  const { t, lang } = useLanguage()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({})
  const [sending, setSending] = useState(false)
  const [reference, setReference] = useState('')
  const [discardOpen, setDiscardOpen] = useState(false)
  const done = reference !== ''

  const dirty = name.trim() !== '' || phone.trim() !== ''
  const requestClose = () => {
    if (done || !dirty) onClose()
    else setDiscardOpen(true)
  }

  const submit = async () => {
    if (sending) return
    const next: { name?: string; phone?: string } = {}
    if (name.trim().length < 2) next.name = t.events.reservation.errorName
    if (!isValidJordanPhone(phone)) next.phone = t.events.reservation.errorPhone
    setErrors(next)
    if (Object.keys(next).length > 0) return
    setSending(true)
    // STUB: POST /event-reservations { eventId, name, phone } — mock success after
    // 400ms via booking.stub.ts; performs NO network call, nothing is sent.
    const result = await submitBookingRequest({
      providerId: event.id,
      slot: event.date,
      name: name.trim(),
      phone: phone.trim(),
    })
    setSending(false)
    setReference(result.reference)
  }

  return (
    <Sheet open onRequestClose={requestClose} labelledBy="reservation-title">
      <div className="flex items-start gap-4">
        <div className="min-w-0 flex-1">
          <h2 id="reservation-title" className="font-display text-h3 text-ink">
            {done ? t.events.reservation.confirmedTitle : t.events.reservation.title}
          </h2>
          <p className="mt-0.5 text-small text-ink-muted">
            {pick(event.title, lang)} · {formatDate(event.date, lang)} ·{' '}
            <span dir="ltr">{pick(event.time, lang)}</span>
          </p>
        </div>
        <button
          type="button"
          onClick={requestClose}
          aria-label={t.events.reservation.close}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-ink-muted transition-colors duration-instant hover:text-ink"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>

      {!done ? (
        <form
          noValidate
          className="mt-5"
          onSubmit={(e) => {
            e.preventDefault()
            void submit()
          }}
        >
          <div className="space-y-4">
            <div>
              <label htmlFor="rs-name" className="mb-1.5 block text-small font-semibold text-ink">
                {t.events.reservation.name}
              </label>
              <input
                id="rs-name"
                data-autofocus
                type="text"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t.events.reservation.namePlaceholder}
                aria-invalid={!!errors.name}
                className={inputClass}
              />
              {errors.name && <p className="mt-1.5 text-small text-danger">{errors.name}</p>}
            </div>
            <div>
              <label htmlFor="rs-phone" className="mb-1.5 block text-small font-semibold text-ink">
                {t.events.reservation.phone}
              </label>
              <input
                id="rs-phone"
                type="tel"
                dir="ltr"
                autoComplete="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+962 7X XXX XXXX"
                aria-invalid={!!errors.phone}
                aria-describedby="rs-phone-hint"
                className={cn(inputClass, 'text-start')}
              />
              <p id="rs-phone-hint" className="mt-1 text-micro text-ink-muted" dir="ltr">
                {t.events.reservation.phoneHint}
              </p>
              {errors.phone && <p className="mt-1.5 text-small text-danger">{errors.phone}</p>}
            </div>
          </div>
          <p className="mt-4 flex items-start gap-2 text-small font-semibold text-ink">
            <span aria-hidden="true" className="mt-[0.45em] inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-anemone" />
            {t.events.reservation.honest}
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-end gap-3">
            <button type="button" onClick={requestClose} className={ghostBtn}>
              {t.events.reservation.close}
            </button>
            <button type="submit" disabled={sending} className={primaryBtn}>
              {sending ? t.events.reservation.sending : t.events.reservation.submit}
            </button>
          </div>
        </form>
      ) : (
        <div className="mt-5 text-center" role="status" aria-live="polite">
          <svg width="72" height="72" viewBox="0 0 72 72" className="mx-auto" role="img" aria-label={t.events.reservation.confirmedTitle}>
            <circle
              cx="36"
              cy="36"
              r="30"
              fill="none"
              stroke="var(--afya-deadsea-teal)"
              strokeWidth="3"
              strokeLinecap="round"
              className="breathe-check-circle"
            />
            <path
              d="M24 38 L32 46 L48 30"
              fill="none"
              stroke="var(--afya-deadsea-teal)"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="breathe-check-path"
            />
          </svg>
          <p className="mt-4 text-body text-ink">
            {t.events.reservation.confirmedBody(pick(event.title, lang), phone.trim())}
          </p>
          <p className="mt-2 text-small text-ink-muted">{t.events.reservation.reference(reference)}</p>
          <button type="button" onClick={onClose} data-autofocus className={cn(primaryBtn, 'mt-6')}>
            {t.events.reservation.done}
          </button>
        </div>
      )}

      {/* Unsaved-changes guard */}
      {discardOpen && (
        <div className="absolute inset-0 flex items-center justify-center rounded-t-lg bg-raised/95 p-6 md:rounded-lg">
          <div className="text-center">
            <h3 className="font-display text-h3 text-ink">{t.events.reservation.discardTitle}</h3>
            <p className="mt-2 text-small text-ink-muted">{t.events.reservation.discardBody}</p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              <button type="button" onClick={() => setDiscardOpen(false)} className={ghostBtn}>
                {t.events.reservation.keepEditing}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex min-h-[44px] items-center justify-center rounded-pill bg-danger px-6 text-small font-semibold text-surface transition-transform duration-instant ease-soft hover:opacity-90 active:scale-[.97]"
              >
                {t.events.reservation.discardConfirm}
              </button>
            </div>
          </div>
        </div>
      )}
    </Sheet>
  )
}
