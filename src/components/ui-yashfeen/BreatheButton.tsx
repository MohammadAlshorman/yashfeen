import { useBreathe } from '@/context/BreatheProvider'
import { useLanguage } from '@/context/LanguageProvider'

/**
 * Persistent floating Breathe button (design.md §2.8): bottom-end corner
 * (bottom-left in RTL), 56px Petra Rose circle with expanding ring affordance.
 * Opens the global 60s 4-7-8 BreatheOverlay.
 */
export function BreatheButton() {
  const { openBreathe } = useBreathe()
  const { t } = useLanguage()
  return (
    <button
      type="button"
      onClick={openBreathe}
      aria-label={t.breathe.ariaOpen}
      className="group fixed bottom-6 end-6 z-[60] flex h-14 w-14 items-center justify-center rounded-full shadow-lift transition-transform duration-fast ease-soft hover:scale-105 active:scale-[0.97]"
      style={{ background: 'var(--afya-petra-rose)' }}
    >
      {/* expanding ring affordance (2.4s loop) */}
      <span
        aria-hidden="true"
        className="animate-ring-expand absolute inset-0 rounded-full border-2 border-petra"
      />
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--afya-salt-white)" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
        {/* lotus glyph (§2.7 iconography) */}
        <path d="M12 20c-4 0-7-2.5-8-6 2.5.5 4.5 1.5 6 3.5-1-3 0-6.5 2-8.5 2 2 3 5.5 2 8.5 1.5-2 3.5-3 6-3.5-1 3.5-4 6-8 6Z" />
        <path d="M12 20v-4" />
      </svg>
      <span className="sr-only">{t.breathe.button}</span>
    </button>
  )
}
