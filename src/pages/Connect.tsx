import { useRef, useState } from 'react'
import { Card } from '@/components/ui-yashfeen'
import { useLanguage } from '@/context/LanguageProvider'
import { useReveal } from '@/hooks/useReveal'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { subscribeToPush } from '@/integrations/push.stub'
import { optInToSms } from '@/integrations/sms.stub'
import { isValidJordanPhone } from '@/components/pages/directory/utils'
import { cn } from '@/lib/utils'

const TELEGRAM_URL = 'https://t.me/afyajo'
const WHATSAPP_URL = 'https://wa.me/962771777711?text=Salam%20Yashfeen'
const PHONE_DISPLAY = '+962 77 1777 711'
const PHONE_TEL = 'tel:+962771777711'
const EMAIL = 'm.maharmeh@obscurejo.com'

const glyphProps = {
  width: 48,
  height: 48,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
} as const

function TelegramGlyph() {
  return (
    <svg {...glyphProps}>
      <path d="M21 4 3 11.2l5.5 2L10 19l2.8-3.4L17 18l4-14Z" />
    </svg>
  )
}

function WhatsAppGlyph() {
  return (
    <svg {...glyphProps}>
      <path d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.6-1.2A9 9 0 1 0 12 3Z" />
      <path d="M9.5 8.5c.3 2.5 3.5 5.5 6 6l1.5-1.5-2-1.5-1 .8c-1-.5-2-1.5-2.5-2.5l.8-1-1.5-2-1.3 1.7Z" />
    </svg>
  )
}

const primaryBtn =
  'inline-flex min-h-[44px] items-center justify-center rounded-pill px-6 text-small font-semibold transition-transform duration-instant ease-soft hover:opacity-90 active:scale-[.97] disabled:opacity-50'

type SmsState = 'idle' | 'pending' | 'on'
type PushState = 'idle' | 'pending' | 'explained'

/**
 * Connect (connect.md): channel hub with Telegram/WhatsApp deep links plus
 * UI-state-only SMS and push opt-ins wired to the integration stubs. Every flow
 * is explicit that nothing real is sent or enabled yet.
 */
export default function Connect() {
  const ref = useReveal<HTMLElement>({ stagger: 0.08, y: 32 })
  const { t } = useLanguage()
  const reduced = useReducedMotion()

  /* SMS opt-in state machine (idle → pending → on) */
  const [smsState, setSmsState] = useState<SmsState>('idle')
  const [smsPhone, setSmsPhone] = useState('')
  const [smsConsent, setSmsConsent] = useState(false)
  const [smsError, setSmsError] = useState('')
  const [smsMasked, setSmsMasked] = useState('')
  const smsCardRef = useRef<HTMLDivElement>(null)

  /* Push opt-in state machine (idle → pending → explained) */
  const [pushState, setPushState] = useState<PushState>('idle')
  const bellRef = useRef<HTMLSpanElement>(null)

  const shake = (el: HTMLElement | null) => {
    if (reduced || !el) return
    el.animate(
      [
        { transform: 'translateX(0)' },
        { transform: 'translateX(-6px)' },
        { transform: 'translateX(6px)' },
        { transform: 'translateX(-6px)' },
        { transform: 'translateX(6px)' },
        { transform: 'translateX(0)' },
      ],
      { duration: 240, easing: 'cubic-bezier(.4,0,.2,1)' },
    )
  }

  const submitSms = async () => {
    if (smsState === 'pending') return
    if (!isValidJordanPhone(smsPhone)) {
      setSmsError(t.connect.sms.errorPhone)
      shake(smsCardRef.current)
      return
    }
    if (!smsConsent) {
      setSmsError(t.connect.sms.errorConsent)
      shake(smsCardRef.current)
      return
    }
    setSmsError('')
    setSmsState('pending')
    // STUB: sms.stub.ts → subscribeSms(phone). Mock success after 400ms; no SMS is sent.
    const result = await optInToSms(smsPhone.trim())
    setSmsMasked(result.maskedPhone)
    setSmsState('on')
  }

  const submitPush = async () => {
    if (pushState === 'pending') return
    // Bell rings (rotate ±12°, 2 cycles, 400ms) on click — off under reduced motion
    if (!reduced && bellRef.current) {
      bellRef.current.animate(
        [
          { transform: 'rotate(0deg)' },
          { transform: 'rotate(12deg)' },
          { transform: 'rotate(-12deg)' },
          { transform: 'rotate(12deg)' },
          { transform: 'rotate(-12deg)' },
          { transform: 'rotate(0deg)' },
        ],
        { duration: 400, easing: 'cubic-bezier(.4,0,.2,1)' },
      )
    }
    setPushState('pending')
    // STUB: push.stub.ts → subscribePush(). Real flow would use the Push API +
    // service worker; this mock resolves after 400ms and enables nothing.
    await subscribeToPush('live')
    setPushState('explained')
  }

  return (
    <section ref={ref} className="mx-auto max-w-content px-4 py-16 md:px-6 md:py-24">
      {/* ——— Section 1: header ——— */}
      <header className="mx-auto max-w-[720px] text-center">
        <p data-reveal className="text-micro uppercase text-interactive-accent [html[lang=ar]_&]:normal-case">
          {t.connect.overline}
        </p>
        <h1 data-reveal className="mt-3 font-display text-h1 text-ink">
          {t.connect.h1}
        </h1>
        <p data-reveal className="mt-4 text-lede text-ink-muted">
          {t.connect.lede}
        </p>
      </header>

      {/* ——— Section 2: channel cards (deep links) ——— */}
      <div className="mx-auto mt-12 grid max-w-[1000px] gap-5 md:grid-cols-2">
        <Card data-reveal hover className="group flex h-full flex-col p-6 md:p-8">
          <span
            aria-hidden="true"
            className="flex h-20 w-20 items-center justify-center rounded-full bg-dest-gulf-teal text-salt transition-transform duration-fast ease-soft group-hover:rotate-[8deg]"
          >
            <TelegramGlyph />
          </span>
          <h2 className="mt-5 font-display text-h3 text-ink">{t.connect.telegram.title}</h2>
          <p className="mt-2 flex-1 text-body text-ink-muted">{t.connect.telegram.line}</p>
          <a
            href={TELEGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(primaryBtn, 'mt-6 bg-interactive-accent text-surface')}
          >
            {t.connect.telegram.cta}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="ms-2 rtl-flip">
              <path d="M7 17 17 7M9 7h8v8" />
            </svg>
          </a>
          <p className="mt-3 text-micro text-ink-muted">{t.connect.telegram.micro}</p>
        </Card>

        <Card data-reveal hover className="group flex h-full flex-col p-6 md:p-8">
          <span
            aria-hidden="true"
            className="flex h-20 w-20 items-center justify-center rounded-full bg-teal-deep text-salt transition-transform duration-fast ease-soft group-hover:rotate-[8deg]"
          >
            <WhatsAppGlyph />
          </span>
          <h2 className="mt-5 font-display text-h3 text-ink">{t.connect.whatsapp.title}</h2>
          <p className="mt-2 flex-1 text-body text-ink-muted">{t.connect.whatsapp.line}</p>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(primaryBtn, 'mt-6 bg-mood-deep text-cream-text')}
          >
            {t.connect.whatsapp.cta}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="ms-2 rtl-flip">
              <path d="M7 17 17 7M9 7h8v8" />
            </svg>
          </a>
          <p className="mt-3 text-micro text-ink-muted">{t.connect.whatsapp.micro}</p>
        </Card>
      </div>

      {/* ——— Section 2b: direct contact (real phone + email) ——— */}
      <div className="mx-auto mt-5 max-w-[1000px]">
        <Card data-reveal hover className="flex h-full flex-col items-start gap-5 p-6 md:flex-row md:items-center md:justify-between md:p-8">
          <div className="max-w-[52ch]">
            <h2 className="font-display text-h3 text-ink">{t.connect.direct.title}</h2>
            <p className="mt-2 text-body text-ink-muted">{t.connect.direct.line}</p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:flex-row md:w-auto">
            <a href={PHONE_TEL} className={cn(primaryBtn, 'whitespace-nowrap bg-interactive text-cream-text')}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="me-2 shrink-0">
                <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />
              </svg>
              <span dir="ltr">{PHONE_DISPLAY}</span>
            </a>
            <a href={`mailto:${EMAIL}`} className={cn(primaryBtn, 'whitespace-nowrap border border-line bg-surface text-ink hover:bg-raised')}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="me-2">
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="m3 7 9 6 9-6" />
              </svg>
              {EMAIL}
            </a>
          </div>
          <span className="sr-only">{t.connect.direct.phoneLabel} — {t.connect.direct.emailLabel}</span>
        </Card>
      </div>

      {/* ——— Section 3: SMS opt-in (UI state only) ——— */}
      <div className="mx-auto mt-10 max-w-[560px]" ref={smsCardRef}>
        <Card
          data-reveal
          className={cn('p-6 transition-colors duration-fast md:p-8', smsState === 'on' && 'border-teal')}
        >
          <h2 className="font-display text-h3 text-ink">{t.connect.sms.band}</h2>

          {smsState !== 'on' ? (
            <form
              noValidate
              className="mt-5"
              onSubmit={(e) => {
                e.preventDefault()
                void submitSms()
              }}
            >
              <label htmlFor="sms-phone" className="mb-1.5 block text-small font-semibold text-ink">
                {t.connect.sms.phoneLabel}
              </label>
              <div className="flex flex-col gap-3 md:flex-row">
                <input
                  id="sms-phone"
                  type="tel"
                  dir="ltr"
                  autoComplete="tel"
                  value={smsPhone}
                  onChange={(e) => setSmsPhone(e.target.value)}
                  placeholder={t.connect.sms.phonePlaceholder}
                  aria-invalid={!!smsError}
                  aria-describedby={smsError ? 'sms-err' : undefined}
                  className="min-h-[44px] w-full flex-1 rounded-sm border border-line bg-surface px-4 py-2.5 text-start text-body text-ink placeholder:text-ink-muted"
                />
                <button
                  type="submit"
                  disabled={smsState === 'pending'}
                  className={cn(primaryBtn, 'shrink-0 bg-mood-deep text-cream-text')}
                >
                  {smsState === 'pending' ? t.connect.sms.sending : t.connect.sms.submit}
                </button>
              </div>
              <label className="mt-4 flex min-h-[44px] cursor-pointer items-start gap-3 text-small text-ink">
                <input
                  type="checkbox"
                  checked={smsConsent}
                  onChange={(e) => setSmsConsent(e.target.checked)}
                  className="mt-0.5 h-5 w-5 shrink-0 accent-[var(--mood-accent)]"
                />
                {t.connect.sms.consent}
              </label>
              {smsError && (
                <p id="sms-err" role="alert" className="mt-2 text-small text-danger">
                  {smsError}
                </p>
              )}
            </form>
          ) : (
            <div className="mt-5" role="status" aria-live="polite">
              <div className="flex items-center gap-3">
                <svg width="28" height="28" viewBox="0 0 72 72" role="img" aria-label={t.connect.sms.onTitle}>
                  <circle cx="36" cy="36" r="30" fill="none" stroke="var(--afya-deadsea-teal)" strokeWidth="5" strokeLinecap="round" className="breathe-check-circle" />
                  <path d="M24 38 L32 46 L48 30" fill="none" stroke="var(--afya-deadsea-teal)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" className="breathe-check-path" />
                </svg>
                <p className="text-body font-semibold text-interactive-accent">{t.connect.sms.onTitle}</p>
              </div>
              <p className="mt-3 text-small text-ink-muted" dir="auto">
                {t.connect.sms.onBody(smsMasked)}
              </p>
              <button
                type="button"
                onClick={() => {
                  setSmsState('idle')
                  setSmsConsent(false)
                }}
                className="mt-4 inline-flex min-h-[44px] items-center px-1 text-small font-semibold text-interactive underline underline-offset-4 transition-colors duration-instant hover:text-mood-deep"
              >
                {t.connect.sms.off}
              </button>
            </div>
          )}
        </Card>

        {/* ——— Section 4: push opt-in (UI state only) ——— */}
        <Card data-reveal className="mt-5 p-6 md:p-8">
          <h2 className="font-display text-h3 text-ink">{t.connect.push.band}</h2>
          <p className="mt-2 text-body text-ink-muted">{t.connect.push.body}</p>

          {pushState === 'idle' || pushState === 'pending' ? (
            <button
              type="button"
              onClick={() => void submitPush()}
              disabled={pushState === 'pending'}
              className={cn(primaryBtn, 'mt-5 bg-mood-deep text-cream-text')}
            >
              <span ref={bellRef} className="me-2 inline-flex" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6Z" />
                  <path d="M10 19a2 2 0 0 0 4 0" />
                </svg>
              </span>
              {t.connect.push.submit}
            </button>
          ) : (
            /* Explainer state — never a fake browser permission prompt (connect.md §4) */
            <div className="mt-5" role="status" aria-live="polite">
              <div className="flex items-start gap-3 rounded-md border border-line bg-surface p-4">
                <span ref={bellRef} aria-hidden="true" className="mt-0.5 inline-flex shrink-0 text-interactive-accent">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6Z" />
                    <path d="M10 19a2 2 0 0 0 4 0" />
                  </svg>
                </span>
                <p className="text-small text-ink">{t.connect.push.explainer}</p>
              </div>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <span className="text-small font-semibold text-ink">{t.connect.push.toggleLabel}</span>
                {/* Intended ON state — disabled-looking, preview only */}
                <span
                  aria-hidden="true"
                  className="inline-flex h-7 w-12 cursor-not-allowed items-center justify-end rounded-full bg-[var(--afya-deadsea-teal-soft)] px-1 opacity-70"
                >
                  <span className="h-5 w-5 rounded-full bg-teal" />
                </span>
              </div>
              <p className="mt-1.5 text-micro text-ink-muted">{t.connect.push.toggleOn}</p>
              <button
                type="button"
                onClick={() => setPushState('idle')}
                className="mt-4 inline-flex min-h-[44px] items-center px-1 text-small font-semibold text-interactive underline underline-offset-4 transition-colors duration-instant hover:text-mood-deep"
              >
                {t.connect.push.off}
              </button>
            </div>
          )}
        </Card>
      </div>

      {/* ——— Section 5: quiet promise band ——— */}
      <div className="mx-auto mt-14 max-w-[1000px]">
        <ul className="grid gap-5 md:grid-cols-3">
          {(
            [
              {
                text: t.connect.promise.volume,
                icon: (
                  <path d="M4 10v4h3l4 4V6l-4 4H4Zm13.5 2 3-3m0 3-3-3" />
                ),
              },
              {
                text: t.connect.promise.exit,
                icon: <path d="M14 4h6v16h-6M10 8l-4 4 4 4M6 12h11" />,
              },
              {
                text: t.connect.promise.lock,
                icon: (
                  <>
                    <rect x="5" y="11" width="14" height="9" rx="2" />
                    <path d="M8 11V8a4 4 0 0 1 8 0v3" />
                  </>
                ),
              },
            ] as const
          ).map((item) => (
            <li key={item.text} data-reveal>
              <Card className="flex h-full items-center gap-4 p-5">
                <span aria-hidden="true" className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--afya-deadsea-teal-soft)] text-teal-deep">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    {item.icon}
                  </svg>
                </span>
                <p className="text-small font-semibold text-ink">{item.text}</p>
              </Card>
            </li>
          ))}
        </ul>
        <p data-reveal className="mt-6 text-center text-micro text-ink-muted">
          {t.connect.promise.micro}
        </p>
      </div>
    </section>
  )
}
