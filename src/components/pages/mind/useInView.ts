import { useEffect, useRef, useState } from 'react'

/**
 * Page-local one-shot IntersectionObserver hook (mind/live pages).
 * Returns [ref, inView] — flips true once the element enters the viewport
 * (used for glyph stroke-draws, sparkline draws, medallion scale-ins).
 */
export function useInView<T extends HTMLElement = HTMLElement>(threshold = 0.35) {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true)
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true)
            io.disconnect()
          }
        }
      },
      { threshold },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [threshold])

  return [ref, inView] as const
}
