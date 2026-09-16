import { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from '@/hooks/useReducedMotion'

gsap.registerPlugin(ScrollTrigger)

/**
 * Page-wide smooth scrolling via Lenis, synced with GSAP ScrollTrigger.
 * Disabled entirely under prefers-reduced-motion (design.md §2.6).
 */
export function useLenis(): void {
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) return
    const lenis = new Lenis({ lerp: 0.1 })
    lenis.on('scroll', ScrollTrigger.update)

    const tick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(tick)
      lenis.destroy()
    }
  }, [reduced])
}
