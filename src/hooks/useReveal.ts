import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from '@/hooks/useReducedMotion'

gsap.registerPlugin(ScrollTrigger)

export interface RevealOptions {
  /** Stagger between children (s) — §2.6 standard = 0.08 */
  stagger?: number
  /** Y offset start (px) — §2.6 standard = 40 */
  y?: number
  /** ScrollTrigger start position — §2.6 standard = 'top 80%' */
  start?: string
  /** Per-item duration (s) — §2.6 standard = 0.8 */
  duration?: number
}

/**
 * Standard reveal recipe (design.md §2.6): attach the returned ref to a section;
 * all descendants marked `[data-reveal]` stagger in (y 40→0, opacity 0→1, 0.8s,
 * power3.out, trigger at 80% viewport). With reduced motion everything is shown
 * instantly and no ScrollTrigger is created.
 */
export function useReveal<T extends HTMLElement = HTMLElement>(options: RevealOptions = {}) {
  const ref = useRef<T>(null)
  const reduced = useReducedMotion()
  const { stagger = 0.08, y = 40, start = 'top 80%', duration = 0.8 } = options

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const items = el.querySelectorAll<HTMLElement>('[data-reveal]')
    if (items.length === 0) return

    if (reduced) {
      gsap.set(items, { clearProps: 'all', opacity: 1, y: 0 })
      return
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        items,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration,
          stagger,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start, once: true },
        },
      )
    }, el)

    return () => ctx.revert()
  }, [reduced, stagger, y, start, duration])

  return ref
}
