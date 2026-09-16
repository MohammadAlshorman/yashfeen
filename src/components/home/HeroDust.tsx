import { useEffect, useRef } from 'react'
import { mulberry32 } from '@/components/home/heroNoise'

type Particle = {
  x: number // 0..1 across hero width
  y: number // 0..1 across hero height
  r: number // radius px
  vy: number // upward drift speed (fraction of height / s)
  sway: number // horizontal sway amplitude px
  phase: number // sway phase
  alpha: number
}

/**
 * Floating golden-hour sand-dust particle field (canvas, rAF).
 * ~34 seeded motes drifting slowly upward with a sine sway — transform-free,
 * DPR-capped at 2, tinted from the mood accent, paused off-screen (reads the
 * hero's `loops-paused` class) and fully disabled under prefers-reduced-motion.
 */
export function HeroDust({
  rootRef,
  isNight,
  reduced,
}: {
  rootRef: React.RefObject<HTMLElement | null>
  isNight: boolean
  reduced: boolean
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const root = rootRef.current
    if (!canvas || !root || reduced) return

    const rand = mulberry32(421)
    const particles: Particle[] = Array.from({ length: 34 }, () => ({
      x: rand(),
      y: rand(),
      r: 0.6 + rand() * 1.6,
      vy: 0.008 + rand() * 0.02,
      sway: 8 + rand() * 22,
      phase: rand() * Math.PI * 2,
      alpha: 0.25 + rand() * 0.5,
    }))

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(root.clientWidth * dpr)
      canvas.height = Math.round(root.clientHeight * dpr)
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(root)

    // Mote tint: mood accent on Salt White day, Rum Sand pearl on Wadi Night
    const css = getComputedStyle(document.documentElement)
    const accent = css.getPropertyValue('--mood-accent').trim() || (isNight ? '#D9A05B' : '#B76E58')
    const moteColor = isNight ? 'rgba(239,231,218,' : hexToRgbaPrefix(accent)

    let raf = 0
    let last = performance.now()
    const step = (now: number) => {
      raf = requestAnimationFrame(step)
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now
      // Pause off-screen (hero root toggles this class via IntersectionObserver)
      if (root.classList.contains('loops-paused') || document.hidden) return

      const w = canvas.width
      const h = canvas.height
      if (w === 0 || h === 0) return
      ctx.clearRect(0, 0, w, h)
      const dprScale = w / root.clientWidth
      const t = now / 1000
      for (const p of particles) {
        p.y -= p.vy * dt
        if (p.y < -0.05) {
          p.y = 1.05
          p.x = rand()
        }
        const px = p.x * w + Math.sin(t * 0.35 + p.phase) * p.sway * dprScale
        const py = p.y * h
        const r = p.r * dprScale
        ctx.beginPath()
        ctx.arc(px, py, r, 0, Math.PI * 2)
        ctx.fillStyle = `${moteColor}${(p.alpha * 0.4).toFixed(3)})`
        ctx.fill()
      }
    }
    raf = requestAnimationFrame(step)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [rootRef, isNight, reduced])

  if (reduced) return null
  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-[5]"
      style={{ width: '100%', height: '100%' }}
    />
  )
}

function hexToRgbaPrefix(hex: string): string {
  const h = hex.replace('#', '')
  if (h.length !== 6) return 'rgba(183,110,88,'
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  return `rgba(${r},${g},${b},`
}
