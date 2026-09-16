import { useRef, useState } from 'react'
import { submitBookingRequest } from '@/integrations/booking.stub'
import { useLanguage } from '@/context/LanguageProvider'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { Sheet } from './Sheet'
import { ServiceGlyph } from './cards'
import { isValidJordanPhone, localizeSlot } from './utils'
import type { ServiceType } from '@/data'
import { cn } from '@/lib/utils'

export interface BookingTarget {
  id: string
  kind: 'doctor' | 'service'
  /** Localized display name */
  name: string
  /** Localized subtitle: specialty · clinic / type · provider */
  subtitle: string
  initials: string
  serviceType?: ServiceType
  slots: string[]
}

export interface ConfirmedRequest {
  reference: string
  provider: string
  slot: string
  phone: string
}

interface BookingModalProps {
  target: BookingTarget | null
  onClose: () => void
  onConfirmed: (req: ConfirmedRequest) => void
}

type Step = 'details' | 'review' | 'done'

interface FieldErrors {
  name?: string
  phone?: string
  slot?: string
}

const NOTE_MAX = 140

const inputClass =
  'min-h-[44px] w-full rounded-sm border border-line bg-surface px-4 py-2.5 text-body text-ink placeholder:text-ink-muted'
const errorClass = 'mt-1.5 text-small text-danger'
const primaryBtn =
  'inline-flex min-h-[44px] items-center justify-center rounded-pill bg-mood-deep px-6 text-small font-semibold text-cream-text transition-transform duration-instant ease-soft hover:opacity-90 active:scale-[.97] disabled:opacity-50'
const ghostBtn =
  'inline-flex min-h-[44px] items-center justify-center rounded-pill border border-line px-6 text-small font-semibold text-ink transition-colors duration-instant hover:bg-surface'

/**
 * Booking-request flow (directory.md §3): Step 1 details → Step 2 review →
 * confirmation. Resolves via the booking stub (client-side AF-… reference,
 * nothing is sent). Esc/backdrop runs an unsaved-changes guard.
 */
export function BookingModal({ target, onClose, onConfirmed }: BookingModalProps) {
  // Keyed remount gives each provider a clean flow — no reset effects needed.
  if (!target) return null
  return <BookingDialog key={target.id} target={target} onClose={onClose} onConfirmed={onConfirmed} />
}

function BookingDialog({ target, onClose, onConfirmed }: { target: BookingTarget; onClose: () => void; onConfirmed: (req: ConfirmedRequest) => void }) {
  const { t, lang, dir } = useLanguage()
  const reduced = useReducedMotion()
  const [step, setStep] = useState<Step>('details')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [slot, setSlot] = useState('')
  const [note, setNote] = useState('')
  const [errors, setErrors] = useState<FieldErrors>({})
  const [sending, setSending] = useState(false)
  const [reference, setReference] = useState('')
  const [discardOpen, setDiscardOpen] = useState(false)
  const [announce, setAnnounce] = useState(
    () => `${t.directory.booking.title} — ${target.name}. ${t.directory.booking.step(1)}`,
  )
  const stepRef = useRef<HTMLDivElement>(null)

  // Step crossfade (x ±24px, 300ms — mirrored in RTL) + aria-live announcement
  const goStep = (next: Step, forward: boolean) => {
    setStep(next)
    const labels: Record<Step, string> = {
      details: t.directory.booking.step(1),
      review: t.directory.booking.step(2),
      done: t.directory.booking.confirmedTitle,
    }
    setAnnounce(labels[next])
    if (!reduced && stepRef.current) {
      const sign = (forward ? 1 : -1) * (dir === 'rtl' ? -1 : 1)
      stepRef.current.animate(
        [
          { opacity: 0, transform: `translateX(${sign * 24}px)` },
          { opacity: 1, transform: 'translateX(0)' },
        ],
        { duration: 300, easing: 'cubic-bezier(.4,0,.2,1)' },
      )
    }
  }

  const dirty = name.trim() !== '' || phone.trim() !== '' || note.trim() !== '' || slot !== ''

  const requestClose = () => {
    if (step === 'done' || !dirty) onClose()
    else setDiscardOpen(true)
  }

  const validate = (): boolean => {
    const next: FieldErrors = {}
    if (name.trim().length < 2) next.name = t.directory.booking.errorName
    if (!isValidJordanPhone(phone)) next.phone = t.directory.booking.errorPhone
    if (!slot) next.slot = t.directory.booking.errorSlot
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const submit = async () => {
    if (!target || sending) return
    setSending(true)
    // STUB: booking.stub.ts — resolves a mock success after 400ms; nothing is sent.
    const result = await submitBookingRequest({
      providerId: target.id,
      slot,
      name: name.trim(),
      phone: phone.trim(),
      note: note.trim() || undefined,
    })
    setSending(false)
    setReference(result.reference)
    onConfirmed({ reference: result.reference, provider: target.name, slot, phone: phone.trim() })
    goStep('done', true)
  }

  return (
    <Sheet open onRequestClose={requestClose} labelledBy="booking-title">
      {(
        <>
          <p className="sr-only" role="status" aria-live="polite">
            {announce}
          </p>

          {/* Header: medallion + provider name + subtitle + close */}
          <div className="flex items-start gap-4">
            <span
              aria-hidden="true"
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--afya-rum-sand-soft)] font-display text-small font-semibold text-sand-deep"
            >
              {target.kind === 'doctor' ? (
                target.initials
              ) : (
                <span className="text-teal-deep">
                  <ServiceGlyph type={target.serviceType ?? 'lab'} />
                </span>
              )}
            </span>
            <div className="min-w-0 flex-1">
              <h2 id="booking-title" className="font-display text-h3 text-ink">
                {step === 'done' ? t.directory.booking.confirmedTitle : target.name}
              </h2>
              <p className="mt-0.5 text-small text-ink-muted">
                {step === 'review' ? t.directory.booking.reviewTitle : target.subtitle}
              </p>
              {step !== 'done' && (
                <p className="mt-1 text-micro text-interactive-accent">
                  {t.directory.booking.step(step === 'details' ? 1 : 2)}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={requestClose}
              aria-label={t.directory.booking.close}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-ink-muted transition-colors duration-instant hover:text-ink"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>

          <div ref={stepRef} className="mt-5">
            {/* ——— Step 1: details ——— */}
            {step === 'details' && (
              <form
                noValidate
                onSubmit={(e) => {
                  e.preventDefault()
                  if (validate()) goStep('review', true)
                }}
              >
                <div className="space-y-4">
                  <div>
                    <label htmlFor="bk-name" className="mb-1.5 block text-small font-semibold text-ink">
                      {t.directory.booking.fullName}
                    </label>
                    <input
                      id="bk-name"
                      data-autofocus
                      type="text"
                      autoComplete="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={t.directory.booking.fullNamePlaceholder}
                      aria-invalid={!!errors.name}
                      aria-describedby={errors.name ? 'bk-name-err' : undefined}
                      className={inputClass}
                    />
                    {errors.name && (
                      <p id="bk-name-err" className={errorClass}>
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="bk-phone" className="mb-1.5 block text-small font-semibold text-ink">
                      {t.directory.booking.phone}
                    </label>
                    <input
                      id="bk-phone"
                      type="tel"
                      dir="ltr"
                      autoComplete="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+962 7X XXX XXXX"
                      aria-invalid={!!errors.phone}
                      aria-describedby={errors.phone ? 'bk-phone-err bk-phone-hint' : 'bk-phone-hint'}
                      className={cn(inputClass, 'text-start')}
                    />
                    <p id="bk-phone-hint" className="mt-1 text-micro text-ink-muted" dir="ltr">
                      {t.directory.booking.phoneHint}
                    </p>
                    {errors.phone && (
                      <p id="bk-phone-err" className={errorClass}>
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  <fieldset>
                    <legend className="mb-1.5 text-small font-semibold text-ink">
                      {t.directory.booking.slot}
                    </legend>
                    <div className="flex flex-wrap gap-2" role="group" aria-describedby="bk-slot-hint">
                      {target.slots.map((s) => (
                        <button
                          key={s}
                          type="button"
                          aria-pressed={slot === s}
                          onClick={() => setSlot(s)}
                          className={cn(
                            'inline-flex min-h-[44px] items-center rounded-pill px-4 text-small transition-colors duration-fast ease-soft',
                            slot === s
                              ? 'bg-mood-deep text-cream-text'
                              : 'bg-[var(--afya-rum-sand-soft)] text-sand-deep hover:opacity-85',
                          )}
                        >
                          {localizeSlot(s, lang, t.directory.daysShort)}
                        </button>
                      ))}
                    </div>
                    <p id="bk-slot-hint" className="mt-1.5 text-micro text-ink-muted">
                      {t.directory.booking.slotSample}
                    </p>
                    {errors.slot && <p className={errorClass}>{errors.slot}</p>}
                  </fieldset>

                  <div>
                    <label htmlFor="bk-note" className="mb-1.5 block text-small font-semibold text-ink">
                      {t.directory.booking.note}
                    </label>
                    <textarea
                      id="bk-note"
                      rows={3}
                      maxLength={NOTE_MAX}
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      className={cn(inputClass, 'min-h-[84px] resize-y')}
                    />
                    <p className="mt-1 text-end text-micro text-ink-muted">
                      {t.directory.booking.noteCount(note.length)}
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap items-center justify-end gap-3">
                  <button type="button" onClick={requestClose} className={ghostBtn}>
                    {t.directory.booking.back}
                  </button>
                  <button type="submit" className={primaryBtn}>
                    {t.directory.booking.review}
                  </button>
                </div>
              </form>
            )}

            {/* ——— Step 2: review ——— */}
            {step === 'review' && (
              <div>
                <dl className="space-y-3 rounded-md border border-line bg-surface p-4">
                  <div className="flex flex-wrap justify-between gap-2">
                    <dt className="text-small text-ink-muted">{t.directory.booking.provider}</dt>
                    <dd className="text-small font-semibold text-ink">{target.name}</dd>
                  </div>
                  <div className="flex flex-wrap justify-between gap-2">
                    <dt className="text-small text-ink-muted">{t.directory.booking.slot}</dt>
                    <dd className="text-small font-semibold text-ink">
                      {localizeSlot(slot, lang, t.directory.daysShort)}
                    </dd>
                  </div>
                  <div className="flex flex-wrap justify-between gap-2">
                    <dt className="text-small text-ink-muted">{t.directory.booking.fullName}</dt>
                    <dd className="text-small font-semibold text-ink">{name.trim()}</dd>
                  </div>
                  <div className="flex flex-wrap justify-between gap-2">
                    <dt className="text-small text-ink-muted">{t.directory.booking.phone}</dt>
                    <dd className="text-small font-semibold text-ink" dir="ltr">
                      {phone.trim()}
                    </dd>
                  </div>
                  {note.trim() && (
                    <div className="flex flex-wrap justify-between gap-2">
                      <dt className="text-small text-ink-muted">{t.directory.booking.note}</dt>
                      <dd className="max-w-[32ch] text-small text-ink">{note.trim()}</dd>
                    </div>
                  )}
                </dl>
                <p className="mt-4 flex items-start gap-2 text-small font-semibold text-ink">
                  <span aria-hidden="true" className="mt-[0.45em] inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-anemone" />
                  {t.directory.booking.reviewHonest}
                </p>
                <div className="mt-6 flex flex-wrap items-center justify-end gap-3">
                  <button type="button" onClick={() => goStep('details', false)} className={ghostBtn}>
                    {t.directory.booking.back}
                  </button>
                  <button type="button" onClick={submit} disabled={sending} className={primaryBtn}>
                    {sending ? t.directory.booking.sending : t.directory.booking.send}
                  </button>
                </div>
              </div>
            )}

            {/* ——— Step 3: confirmation ——— */}
            {step === 'done' && (
              <div className="text-center">
                <svg
                  width="72"
                  height="72"
                  viewBox="0 0 72 72"
                  className="mx-auto"
                  role="img"
                  aria-label={t.directory.booking.confirmedTitle}
                >
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
                  {t.directory.booking.confirmedBody(
                    reference,
                    target.name,
                    localizeSlot(slot, lang, t.directory.daysShort),
                    phone.trim(),
                  )}
                </p>
                <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                  <button type="button" onClick={onClose} data-autofocus className={primaryBtn}>
                    {t.directory.booking.done}
                  </button>
                  <button
                    type="button"
                    disabled
                    title={t.directory.booking.calendarStub}
                    aria-disabled="true"
                    className={cn(ghostBtn, 'cursor-not-allowed opacity-50')}
                  >
                    {t.directory.booking.addToCalendar}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Unsaved-changes guard (directory.md §3) */}
          {discardOpen && (
            <div className="absolute inset-0 flex items-center justify-center rounded-t-lg bg-raised/95 p-6 md:rounded-lg">
              <div className="text-center">
                <h3 className="font-display text-h3 text-ink">{t.directory.booking.discardTitle}</h3>
                <p className="mt-2 text-small text-ink-muted">{t.directory.booking.discardBody}</p>
                <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                  <button type="button" onClick={() => setDiscardOpen(false)} data-autofocus className={ghostBtn}>
                    {t.directory.booking.keepEditing}
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="inline-flex min-h-[44px] items-center justify-center rounded-pill bg-danger px-6 text-small font-semibold text-surface transition-transform duration-instant ease-soft hover:opacity-90 active:scale-[.97]"
                  >
                    {t.directory.booking.discardConfirm}
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </Sheet>
  )
}
