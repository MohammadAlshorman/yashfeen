import { useCallback, useEffect, useRef, useState } from 'react'
import { useBreathe } from '@/context/BreatheProvider'
import { useLanguage } from '@/context/LanguageProvider'
import { useReducedMotion } from '@/hooks/useReducedMotion'

type Phase = 'idle' | 'inhale' | 'hold' | 'exhale' | 'settle' | 'done'

/** 4-7-8 cycle ×3 (57s) + 3s settle = 60s (mind.md §Breathe Overlay) */
const PHASE_DURATIONS: Record<'inhale' | 'hold' | 'exhale' | 'settle', number> = {
  inhale: 4,
  hold: 7,
  exhale: 8,
  settle: 3,
}
const ORB_SCALE: Record<Phase, number> = {
  idle: 1,
  inhale: 1.35,
  hold: 1.35,
  exhale: 0.9,
  settle: 1,
  done: 1,
}
const RING_R = 130
const RING_CIRC = 2 * Math.PI * RING_R

function buildTimeline(): { phase: Phase; start: number; end: number }[] {
  const seq: { phase: Phase; start: number; end: number }[] = []
  let t = 0
  for (let i = 0; i < 3; i++) {
    for (const p of ['inhale', 'hold', 'exhale'] as const) {
      seq.push({ phase: p, start: t, end: t + PHASE_DURATIONS[p] })
      t += PHASE_DURATIONS[p]
    }
  }
  seq.push({ phase: 'settle', start: t, end: t + PHASE_DURATIONS.settle })
  return seq
}
const TIMELINE = buildTimeline()
const TOTAL_S = TIMELINE[TIMELINE.length - 1].end

/**
 * Global 60s guided 4-7-8 breathing overlay (mind.md §Breathe Overlay — global chrome).
 * A11y: role=dialog aria-modal, focus trapped, phases announced via aria-live;
 * reduced-motion → static orb + linear progress bar + text countdown only.
 */
export function BreatheOverlay() {
  const { isOpen, closeBreathe } = useBreathe()
  const { t } = useLanguage()
  const reduced = useReducedMotion()

  const [phase, setPhase] = useState<Phase>('idle')
  const [started, setStarted] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [barProgress, setBarProgress] = useState(0)

  const rafRef = useRef(0)
  const startRef = useRef(0)
  const phaseRef = useRef<Phase>('idle')
  const arcRef = useRef<SVGCircleElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  const orbRef = useRef<HTMLDivElement>(null)
  const completedRef = useRef(false)

  const stop = useCallback(() => cancelAnimationFrame(rafRef.current), [])

  const reset = useCallback(() => {
    stop()
    setPhase('idle')
    phaseRef.current = 'idle'
    setStarted(false)
    setBarProgress(0)
    completedRef.current = false
  }, [stop])

  const tick = useCallback(() => {
    const elapsed = (performance.now() - startRef.current) / 1000
    if (elapsed >= TOTAL_S) {
      completedRef.current = true
      phaseRef.current = 'done'
      setPhase('done')
      return
    }
    const seg = TIMELINE.find((s) => elapsed >= s.start && elapsed < s.end) ?? TIMELINE[0]
    if (seg.phase !== phaseRef.current) {
      phaseRef.current = seg.phase
      setPhase(seg.phase)
    }
    const segProgress = (elapsed - seg.start) / (seg.end - seg.start)
    // Progress arc completes over each phase (updated via ref — no re-render per frame)
    if (arcRef.current) {
      arcRef.current.style.strokeDashoffset = String(RING_CIRC * (1 - segProgress))
    }
    // Reduced-motion fallback data
    setCountdown(Math.ceil(seg.end - elapsed))
    setBarProgress(segProgress)
    rafRef.current = requestAnimationFrame(tick)
  }, [])

  const startSession = useCallback(() => {
    stop()
    completedRef.current = false
    phaseRef.current = 'idle'
    startRef.current = performance.now()
    setStarted(true)
    rafRef.current = requestAnimationFrame(tick)
  }, [stop, tick])

  // Open lifecycle: reset state, lock scroll, focus dialog
  useEffect(() => {
    if (!isOpen) return
    reset()
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const focusTimer = window.setTimeout(() => dialogRef.current?.focus(), 50)
    return () => {
      document.body.style.overflow = prevOverflow
      window.clearTimeout(focusTimer)
      stop()
    }
  }, [isOpen, reset, stop])

  // Esc closes; Tab focus trap
  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeBreathe(completedRef.current)
        return
      }
      if (e.key === 'Tab' && dialogRef.current) {
        const focusables = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], [tabindex]:not([tabindex="-1"])',
        )
        if (focusables.length === 0) return
        const first = focusables[0]
        const last = focusables[focusables.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [isOpen, closeBreathe])

  if (!isOpen) return null

  const phaseLabel =
    phase === 'inhale'
      ? t.breathe.inhale
      : phase === 'hold'
        ? t.breathe.hold
        : phase === 'exhale'
          ? t.breathe.exhale
          : null

  const showOrbTimeline = started && !reduced && phase !== 'done'

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center"
      role="presentation"
      onClick={() => closeBreathe(completedRef.current)}
    >
      {/* Wadi Night scrim */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ background: 'rgba(27,22,17,.88)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)' }}
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={t.breathe.ariaOpen}
        tabIndex={-1}
        className="relative z-10 flex w-full max-w-md flex-col items-center px-6 outline-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          type="button"
          onClick={() => closeBreathe(completedRef.current)}
          aria-label={t.breathe.close}
          className="absolute -top-2 end-0 flex h-11 w-11 items-center justify-center rounded-full text-cream-muted transition-colors duration-instant hover:text-cream-text"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        {/* Phase announcements for screen readers */}
        <p aria-live="polite" className="sr-only">
          {phaseLabel ?? (phase === 'done' ? t.breathe.wellDone : '')}
        </p>

        {/* Orb + progress ring */}
        <div className="relative flex h-[300px] w-[300px] items-center justify-center">
          {/* thin progress arc */}
          <svg width="300" height="300" viewBox="0 0 300 300" className="absolute inset-0 -rotate-90" aria-hidden="true">
            <circle cx="150" cy="150" r={RING_R} fill="none" stroke="rgba(239,231,218,.15)" strokeWidth="1.5" />
            <circle
              ref={arcRef}
              cx="150"
              cy="150"
              r={RING_R}
              fill="none"
              stroke="var(--mood-accent)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray={RING_CIRC}
              strokeDashoffset={RING_CIRC}
            />
          </svg>
          {/* dune-contour ring */}
          <div
            aria-hidden="true"
            className="texture-dune-contours absolute inset-4 rounded-full opacity-[0.06]"
            style={{ color: '#EFE7DA', maskImage: 'radial-gradient(circle, transparent 62%, black 63%, black 72%, transparent 73%)', WebkitMaskImage: 'radial-gradient(circle, transparent 62%, black 63%, black 72%, transparent 73%)' }}
          />
          {/* the orb — 200px radial-gradient in --mood-accent with glow halo */}
          <div
            ref={orbRef}
            aria-hidden="true"
            className={!started && !reduced ? 'animate-orb-pulse' : undefined}
            style={{
              width: 200,
              height: 200,
              borderRadius: '50%',
              background:
                'radial-gradient(circle at 35% 30%, color-mix(in oklab, var(--mood-accent) 55%, #F4EFE6), var(--mood-accent) 70%)',
              boxShadow: 'var(--shadow-glow)',
              transform: `scale(${showOrbTimeline ? ORB_SCALE[phase] : 1})`,
              transition: showOrbTimeline
                ? `transform ${phase === 'settle' ? 3 : PHASE_DURATIONS[phase as 'inhale' | 'hold' | 'exhale'] ?? 1}s var(--ease-breathe)`
                : 'transform 420ms var(--ease-breathe)',
            }}
          />
          {/* completion check */}
          {phase === 'done' && (
            <svg width="72" height="72" viewBox="0 0 72 72" className="absolute" aria-hidden="true">
              <circle cx="36" cy="36" r="30" fill="none" stroke="var(--mood-accent)" strokeWidth="2" className="breathe-check-circle" />
              <path d="M24 37l8 8 16-17" fill="none" stroke="#EFE7DA" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="breathe-check-path" />
            </svg>
          )}
        </div>

        {/* Phase label / states */}
        <div className="mt-8 flex min-h-[96px] flex-col items-center text-center">
          {!started ? (
            <button
              type="button"
              onClick={startSession}
              className="rounded-pill bg-[var(--mood-accent-deep)] px-8 py-3 text-small font-semibold text-cream-text shadow-lift transition-transform duration-fast ease-soft hover:scale-[1.03] active:scale-[0.97]"
            >
              {t.breathe.startSession}
            </button>
          ) : phase === 'done' ? (
            <>
              <p className="text-lede text-cream-text">{t.breathe.wellDone}</p>
              <div className="mt-5 flex gap-3">
                <button
                  type="button"
                  onClick={startSession}
                  className="rounded-pill bg-[var(--mood-accent-deep)] px-6 py-2.5 text-small font-semibold text-cream-text transition-transform duration-fast active:scale-[0.97]"
                >
                  {t.breathe.again}
                </button>
                <button
                  type="button"
                  onClick={() => closeBreathe(true)}
                  className="rounded-pill border border-night-border px-6 py-2.5 text-small font-semibold text-cream-text transition-colors duration-fast hover:bg-night-raised"
                >
                  {t.breathe.done}
                </button>
              </div>
            </>
          ) : reduced ? (
            /* Reduced-motion fallback: static orb + linear bar + text countdown */
            <>
              <p className="text-h3 font-display text-cream-text">{phaseLabel}</p>
              <p className="mt-1 text-small text-cream-muted" dir="ltr">
                {countdown}s
              </p>
              <div className="mt-4 h-1.5 w-56 overflow-hidden rounded-pill bg-night-border" role="progressbar" aria-valuenow={Math.round(barProgress * 100)} aria-valuemin={0} aria-valuemax={100}>
                <div className="h-full bg-[var(--mood-accent)]" style={{ width: `${barProgress * 100}%` }} />
              </div>
            </>
          ) : (
            <p key={phase} className="breathe-phase-swap text-h3 font-display text-cream-text">
              {phase === 'settle' ? t.breathe.wellDone : phaseLabel}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
