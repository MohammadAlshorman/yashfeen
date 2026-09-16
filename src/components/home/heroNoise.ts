/**
 * Seeded 1D value-noise + dune path generation for the Home hero (home.md §1).
 * Seeded at mount — stable per session, never random per frame.
 */

/** mulberry32 PRNG — deterministic from seed */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Smooth 1D value noise: 2 octaves of interpolated random control points */
export function makeNoise1D(seed: number, controlPoints = 12): (x: number) => number {
  const rand = mulberry32(seed)
  const mk = (n: number) => Array.from({ length: n + 2 }, () => rand())
  const o1 = mk(controlPoints)
  const o2 = mk(Math.ceil(controlPoints / 2))
  const sample = (vals: number[], x: number) => {
    const i = Math.floor(x)
    const f = x - i
    const u = f * f * (3 - 2 * f) // smoothstep
    const a = vals[Math.min(i, vals.length - 1)]
    const b = vals[Math.min(i + 1, vals.length - 1)]
    return a + (b - a) * u
  }
  return (x: number) => sample(o1, x) * 0.65 + sample(o2, x * 2) * 0.35
}

/**
 * Build an SVG path `d` for one dune silhouette layer.
 * viewBox coordinates: width × height, baseline = dune crest average height.
 */
export function buildDunePath(
  seed: number,
  width: number,
  height: number,
  baseline: number,
  amplitude: number,
): string {
  const noise = makeNoise1D(seed)
  const step = 24
  const n = Math.ceil(width / step)
  let d = `M0 ${height} L0 ${(baseline + noise(0) * amplitude).toFixed(1)}`
  for (let i = 1; i <= n; i++) {
    const x = i * step
    const t = (i / n) * 6 // traverse noise space
    const y = baseline + noise(t) * amplitude
    d += ` L${Math.min(x, width)} ${y.toFixed(1)}`
  }
  d += ` L${width} ${height} Z`
  return d
}
