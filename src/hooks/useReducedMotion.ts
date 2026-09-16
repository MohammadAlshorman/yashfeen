import { useEffect, useState } from 'react'

const QUERY = '(prefers-reduced-motion: reduce)'

/**
 * Global reduced-motion hook (design.md §2.6 — hard requirement).
 * When true: ambient loops off, reveals instant, orb static, parallax + Lenis disabled.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.matchMedia(QUERY).matches : false,
  )

  useEffect(() => {
    const mql = window.matchMedia(QUERY)
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches)
    mql.addEventListener('change', onChange)
    setReduced(mql.matches)
    return () => mql.removeEventListener('change', onChange)
  }, [])

  return reduced
}
