import { useCallback, useEffect, useRef, useState } from 'react'
import { useBreathe } from '@/context/BreatheProvider'
import { useLanguage } from '@/context/LanguageProvider'
import { useTheme } from '@/context/ThemeProvider'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { Chip } from '@/components/ui-yashfeen'
import { cn } from '@/lib/utils'

type Preset = '478' | 'box'
type Phase = 'idle' | 'inhale' | 'hold' | 'exhale' | 'hold2' | 'settle' | 'done'

interface Segment {
  phase: Phase
  start: number
  end: number
}

const TOTAL_S = 60
const BLEND_MS = 600 // idle-loop → timeline blend, no jump (mind.md §Section 1)

const ORB_SCALE: Record<Phase, number> = {
  idle: 1,
  inhale: 1.35,
  hold: 1.35,
  exhale: 0.9,
  hold2: 0.9,
  settle: 1,
  done: 1,
}

/** 4-7-8: 3 × (4+7+8) = 57s + 3s settle = 60s. Box 4-4-4-4: cycles trimmed at 60s. */
function buildTimeline(preset: Preset): Segment[] {
  const seq: Segment[] = []
  let t = 0
  if (preset === '478') {
    for (let i = 0; i < 3; i++) {
      for (const [p, d] of [['inhale', 4], ['hold', 7], ['exhale', 8]] as [Phase, number][]) {
        seq.push({ phase: p, start: t, end: t + d })
        t += d
      }
    }
    seq.push({ phase: 'settle', start: t, end: TOTAL_S })
  } else {
    const cycle: [Phase, number][] = [
      ['inhale', 4],
      ['hold', 4],
      ['exhale', 4],
      ['hold2', 4],
    ]
    let i = 0
    while (t < TOTAL_S) {
      const [p, d] = cycle[i % cycle.length]
      seq.push({ phase: p, start: t, end: Math.min(t + d, TOTAL_S) })
      t += d
      i++
    }
  }
  return seq
}

const RING_R = 150
const RING_CIRC = 2 * Math.PI * RING_R

/**
 * In-page guided breathing widget (mind.md §Section 1) — larger sibling of the
 * global Breathe overlay: 260px idle orb (300px at xl), 4-7-8 / Box presets,
 * "Begin" runs the full 60s cycle in-page with phase label + progress ring.
 * Reduced motion: orb static, linear progress bar + text countdown only.
 */
export function BreathingWidget() {
  const { t } = useLanguage()
  const { openBreathe } = useBreathe()
  const { isNight } = useTheme()
  const reduced = useReducedMotion()

  const [preset, setPreset] = useState<Preset>('478')
  const [phase, setPhase] = useState<Phase>('idle')
  const [running, setRunning] = useState(false)
  const [blending, setBlending] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [barProgress, setBarProgress] = useState(0)

  const rafRef = useRef(0)
  const blendTimerRef = useRef(0)
  const startRef = useRef(0)
  const phaseRef = useRef<Phase>('idle')
  const timelineRef = useRef<Segment[]>(buildTimeline('478'))
  const arcRef = useRef<SVGCircleElement>(null)

  const stop = useCallback(() => {
    cancelAnimationFrame(rafRef.current)
    window.clearTimeout(blendTimerRef.current)
  }, [])

  const tick = useCallback(() => {
    const elapsed = (performance.now() - startRef.current) / 1000
    const timeline = timelineRef.current
    if (elapsed >= TOTAL_S) {
      phaseRef.current = 'done'
      setPhase('done')
      return
    }
    const seg = timeline.find((s) => elapsed >= s.start && elapsed < s.end) ?? timeline[0]
    if (seg.phase !== phaseRef.current) {
      phaseRef.current = seg.phase
      setPhase(seg.phase)
    }
    const segProgress = (elapsed - seg.start) / (seg.end - seg.start)
    if (arcRef.current) {
      arcRef.current.style.strokeDashoffset = String(RING_CIRC * (1 - segProgress))
    }
    setCountdown(Math.ceil(seg.end - elapsed))
    setBarProgress(segProgress)
    rafRef.current = requestAnimationFrame(tick)
  }, [])

  const begin = useCallback(() => {
    stop()
    timelineRef.current = buildTimeline(preset)
    phaseRef.current = 'idle'
    setPhase('idle')
    setBarProgress(0)
    setRunning(true)
    setBlending(true)
    // 600ms blend out of the idle pulse before the phase timeline starts
    blendTimerRef.current = window.setTimeout(() => {
      setBlending(false)
      startRef.current = performance.now()
      rafRef.current = requestAnimationFrame(tick)
    }, reduced ? 0 : BLEND_MS)
  }, [preset, reduced, stop, tick])

  const reset = useCallback(() => {
    stop()
    phaseRef.current = 'idle'
    setPhase('idle')
    setRunning(false)
    setBlending(false)
    setBarProgress(0)
    if (arcRef.current) arcRef.current.style.strokeDashoffset = String(RING_CIRC)
  }, [stop])

  // Switching presets mid-idle is free; during a session it restarts the clock cleanly
  const selectPreset = useCallback(
    (p: Preset) => {
      setPreset(p)
      timelineRef.current = buildTimeline(p)
    },
    [],
  )

  useEffect(() => stop, [stop])

  const phaseLabel =
    phase === 'inhale'
      ? t.breathe.inhale
      : phase === 'hold' || phase === 'hold2'
        ? t.breathe.hold
        : phase === 'exhale'
          ? t.breathe.exhale
          : phase === 'settle'
            ? t.mind.settle
            : null

  const activeSeg = running
    ? (timelineRef.current.find((s) => s.phase === phase && phase !== 'idle' && phase !== 'done') ??
      (phase === 'settle' ? { start: 0, end: 3 } : null))
    : null
  const phaseDur = activeSeg ? activeSeg.end - activeSeg.start : 0
  const animateOrb = running && !blending && !reduced && phase !== 'done'

  return (
    <div
      role="group"
      aria-label={t.mind.widgetAria}
      className="flex w-full flex-col items-center"
    >
      {/* Screen-reader phase announcements */}
      <p aria-live="polite" className="sr-only">
        {phaseLabel ?? (phase === 'done' ? t.breathe.wellDone : '')}
      </p>

      {/* Orb + progress ring (260px idle orb → 300px at xl, mind.md §Section 1) */}
      <div className="relative flex h-[320px] w-[320px] items-center justify-center xl:h-[380px] xl:w-[380px]">
        <svg
          viewBox="0 0 320 320"
          className="absolute inset-0 h-full w-full -rotate-90"
          aria-hidden="true"
        >
          <circle
            cx="160"
            cy="160"
            r={RING_R}
            fill="none"
            stroke="var(--afya-border)"
            strokeWidth="1.5"
          />
          <circle
            ref={arcRef}
            cx="160"
            cy="160"
            r={RING_R}
            fill="none"
            stroke="var(--mood-accent)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray={RING_CIRC}
            strokeDashoffset={RING_CIRC}
          />
        </svg>
        {/* 1px dune-contour ring ornament */}
        <div
          aria-hidden="true"
          className="texture-dune-contours absolute inset-4 rounded-full opacity-[0.08]"
          style={{
            color: 'var(--mood-accent)',
            maskImage:
              'radial-gradient(circle, transparent 66%, black 67%, black 75%, transparent 76%)',
            WebkitMaskImage:
              'radial-gradient(circle, transparent 66%, black 67%, black 75%, transparent 76%)',
          }}
        />
        <div
          aria-hidden="true"
          className={cn('h-[260px] w-[260px] xl:h-[300px] xl:w-[300px]', !running && !reduced && 'animate-orb-pulse')}
          style={{
            borderRadius: '50%',
            background:
              'radial-gradient(circle at 35% 30%, color-mix(in oklab, var(--mood-accent) 55%, var(--afya-raised)), var(--mood-accent) 70%)',
            // Wadi Night: orb glow +30% (mind.md §Global)
            boxShadow: isNight ? '0 0 62px var(--mood-glow)' : 'var(--shadow-glow)',
            transform: `scale(${blending ? 1 : animateOrb ? ORB_SCALE[phase] : 1})`,
            transition: animateOrb
              ? `transform ${phaseDur || 1}s var(--ease-breathe)`
              : `transform ${BLEND_MS}ms var(--ease-breathe)`,
          }}
        />
        {/* completion check (same draw recipe as the overlay) */}
        {phase === 'done' && (
          <svg width="72" height="72" viewBox="0 0 72 72" className="absolute" aria-hidden="true">
            <circle
              cx="36"
              cy="36"
              r="30"
              fill="none"
              stroke="var(--mood-accent)"
              strokeWidth="2"
              className="breathe-check-circle"
            />
            <path
              d="M24 37l8 8 16-17"
              fill="none"
              stroke="var(--afya-text)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="breathe-check-path"
            />
          </svg>
        )}
      </div>

      {/* Phase label / countdown / reduced-motion progress bar */}
      <div className="mt-6 flex min-h-[72px] flex-col items-center gap-2 text-center">
        {phase === 'done' ? (
          <p className="text-lede text-ink">{t.breathe.wellDone}</p>
        ) : running ? (
          <>
            <p key={phaseLabel ?? 'run'} className="breathe-phase-swap font-display text-h3 text-ink">
              {phaseLabel ?? ''}
            </p>
            {reduced && (
              <>
                <div
                  role="progressbar"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={Math.round(barProgress * 100)}
                  className="h-1 w-[260px] overflow-hidden rounded-pill bg-line"
                >
                  <div
                    className="h-full rounded-pill bg-mood"
                    style={{ width: `${barProgress * 100}%` }}
                  />
                </div>
                <p className="text-small text-ink-muted" dir="ltr">
                  {t.mind.secondsLeft(countdown)}
                </p>
              </>
            )}
          </>
        ) : (
          <p className="text-small text-ink-muted">{t.breathe.tapToBreathe}</p>
        )}
      </div>

      {/* Preset chips + Begin / Again / Reset */}
      <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
        <Chip
          active={preset === '478'}
          onClick={() => selectPreset('478')}
          disabled={running}
          aria-disabled={running}
          className={cn('min-h-[44px]', running && 'cursor-not-allowed opacity-60')}
          /* soft tint is always light (inline mood vars) → constant ink text keeps AA in Wadi Night */
          style={preset === '478' ? undefined : { color: 'var(--afya-ink)' }}
        >
          <span dir="ltr">{t.mind.preset478}</span>
        </Chip>
        <Chip
          active={preset === 'box'}
          onClick={() => selectPreset('box')}
          disabled={running}
          aria-disabled={running}
          className={cn('min-h-[44px]', running && 'cursor-not-allowed opacity-60')}
          style={preset === 'box' ? undefined : { color: 'var(--afya-ink)' }}
        >
          <span dir="ltr">{t.mind.presetBox}</span>
        </Chip>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
        {!running ? (
          <button
            type="button"
            onClick={begin}
            className="min-h-[44px] rounded-pill bg-[var(--mood-accent-deep)] px-8 py-3 text-small font-semibold text-cream-text shadow-lift transition-transform duration-fast ease-soft hover:scale-[1.03] active:scale-[0.97]"
          >
            {t.mind.begin}
          </button>
        ) : phase === 'done' ? (
          <>
            <button
              type="button"
              onClick={begin}
              className="min-h-[44px] rounded-pill bg-[var(--mood-accent-deep)] px-6 py-2.5 text-small font-semibold text-cream-text transition-transform duration-fast active:scale-[0.97]"
            >
              {t.breathe.again}
            </button>
            <button
              type="button"
              onClick={reset}
              className="min-h-[44px] rounded-pill border border-line px-6 py-2.5 text-small font-semibold text-ink transition-colors duration-fast hover:bg-raised"
            >
              {t.mind.reset}
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={reset}
            className="min-h-[44px] rounded-pill border border-line px-6 py-2.5 text-small font-semibold text-ink transition-colors duration-fast hover:bg-raised"
          >
            {t.mind.reset}
          </button>
        )}
      </div>

      {/* The global overlay variant stays one tap away */}
      {!running && (
        <button
          type="button"
          onClick={openBreathe}
          className="mt-4 min-h-[44px] rounded-pill px-3 text-small font-medium text-interactive-accent underline decoration-dotted underline-offset-4 transition-colors duration-instant hover:text-ink"
        >
          {t.mind.openOverlay}
        </button>
      )}
    </div>
  )
}
