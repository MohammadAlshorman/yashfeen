import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router'
import { useLanguage } from '@/context/LanguageProvider'
import { useTheme } from '@/context/ThemeProvider'
import { useMood } from '@/context/MoodProvider'
import { useAuth } from '@/hooks/useAuth'
import { LOGIN_PATH } from '@/const'
import { MOODS } from '@/lib/moods'
import { PRIMARY_ROUTES, MORE_ROUTES, SECTION_ROUTES } from '@/lib/routes'
import { cn } from '@/lib/utils'

function SunMoonIcon({ night }: { night: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      aria-hidden="true"
      className="transition-transform duration-med ease-soft"
      style={{ transform: night ? 'rotate(180deg)' : 'rotate(0deg)' }}
    >
      {night ? (
        /* moon (Wadi Night) */
        <path d="M20 13.5A8 8 0 1 1 10.5 4a6.5 6.5 0 0 0 9.5 9.5Z" />
      ) : (
        /* sun */
        <>
          <circle cx="12" cy="12" r="4.5" />
          <path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5 5l1.8 1.8M17.2 17.2 19 19M19 5l-1.8 1.8M6.8 17.2 5 19" />
        </>
      )}
    </svg>
  )
}

/**
 * Sticky top nav (design.md §2.8): 64px mobile / 72px desktop, raised surface at
 * 88% opacity + backdrop-blur. Wordmark, section menu with "More ▾" overflow,
 * mood chip, theme toggle, EN/AR pill; mobile bottom-sheet menu.
 * Contract: sticky in normal document flow — pages need NO top offset (Layout owns chrome).
 */
export function Navbar() {
  const { t, lang, toggleLang } = useLanguage()
  const { user, isLoading: authLoading, logout } = useAuth()
  const { isNight, toggleTheme } = useTheme()
  const { mood, hasChosen, openPrompt } = useMood()
  const location = useLocation()

  const [moreOpen, setMoreOpen] = useState(false)
  const [sheetOpen, setSheetOpen] = useState(false)
  const moreRef = useRef<HTMLLIElement>(null)

  // Close menus on route change
  useEffect(() => {
    setMoreOpen(false)
    setSheetOpen(false)
  }, [location.pathname])

  // Close "More" dropdown on outside click / Esc
  useEffect(() => {
    if (!moreOpen) return
    const onClick = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) setMoreOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMoreOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [moreOpen])

  // Lock body scroll while the mobile sheet is open
  useEffect(() => {
    document.body.style.overflow = sheetOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [sheetOpen])

  const moreActive = MORE_ROUTES.some((r) => r.path === location.pathname)

  return (
    <header className="sticky top-0 z-50">
      <nav
        aria-label="Main"
        className="border-b border-line backdrop-blur-[12px]"
        style={{ background: 'color-mix(in oklab, var(--afya-raised) 88%, transparent)' }}
      >
        <div className="mx-auto flex h-16 max-w-content items-center justify-between gap-3 px-4 md:h-[72px] md:px-6">
          {/* Brand: Yashfeen mark + wordmark (mark swaps strokes on Wadi Night) */}
          <Link to="/" className="flex shrink-0 items-center gap-2.5" aria-label="Yashfeen — home">
            <img
              src={isNight ? '/yashfeen-mark-dark.png' : '/yashfeen-mark.png'}
              alt=""
              width="34"
              height="30"
              className="h-[30px] w-[34px] object-contain"
            />
            <span className="flex items-baseline gap-2">
              <span className="font-display text-2xl font-semibold tracking-tight text-ink">Yashfeen</span>
              <span className="font-ar text-micro font-bold text-ink-muted">يشفين</span>
            </span>
          </Link>

          {/* Desktop menu: 6 primary + More ▾ */}
          <ul className="hidden items-center gap-4 lg:flex xl:gap-5">
            {PRIMARY_ROUTES.map((r) => (
              <li key={r.path}>
                <NavLink to={r.path} end={r.path === '/'} className={({ isActive }) => cn('nav-link', isActive && 'active')}>
                  {t.nav[r.key]}
                </NavLink>
              </li>
            ))}
            <li className="relative" ref={moreRef}>
              <button
                type="button"
                onClick={() => setMoreOpen((v) => !v)}
                aria-expanded={moreOpen}
                aria-haspopup="true"
                className={cn('nav-link', moreActive && 'active')}
              >
                {t.nav.more}
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  aria-hidden="true"
                  className="ms-1 transition-transform duration-fast"
                  style={{ transform: moreOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
              {moreOpen && (
                <ul className="absolute end-0 top-full mt-1 w-52 rounded-md border border-line bg-raised p-2 shadow-overlay">
                  {MORE_ROUTES.map((r) => (
                    <li key={r.path}>
                      <NavLink
                        to={r.path}
                        className={({ isActive }) =>
                          cn(
                            'block rounded-sm px-3 py-2.5 text-small text-ink transition-colors duration-instant hover:bg-[var(--mood-accent-soft)]',
                            isActive && 'font-semibold text-ink',
                          )
                        }
                      >
                        {t.nav[r.key]}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          </ul>

          {/* Right cluster: account, mood chip, theme toggle, language pill, mobile hamburger */}
          <div className="flex items-center gap-2">
            {/* AUTH-SLOT: env-based admin login via useAuth() — Sign in → LOGIN_PATH; admin sees CMS link */}
            {authLoading ? (
              <span aria-hidden="true" className="hidden h-9 w-16 animate-pulse rounded-pill bg-raised md:inline-block" />
            ) : user ? (
              <span className="hidden items-center gap-1 md:inline-flex">
                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="inline-flex min-h-[44px] items-center rounded-pill border border-line bg-raised px-3 text-small font-semibold text-ink transition-colors duration-instant hover:border-mood"
                  >
                    {t.nav.admin}
                  </Link>
                )}
                <button
                  type="button"
                  onClick={() => logout()}
                  aria-label={t.nav.signOut}
                  title={user.name ?? t.nav.signOut}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[var(--mood-accent-soft)] text-small font-bold text-ink transition-colors duration-instant hover:opacity-85"
                >
                  {(user.name ?? 'A').trim().charAt(0).toUpperCase()}
                </button>
              </span>
            ) : (
              <Link
                to={LOGIN_PATH}
                className="hidden min-h-[44px] items-center rounded-pill border border-line bg-raised px-4 text-small font-semibold text-ink transition-colors duration-instant hover:border-mood md:inline-flex"
              >
                {t.nav.signIn}
              </Link>
            )}

            {hasChosen && (
              <button
                type="button"
                onClick={openPrompt}
                aria-label={t.mood.changeMood}
                className="hidden min-h-[44px] items-center gap-2 rounded-pill border border-line bg-raised px-3 text-small text-ink transition-colors duration-instant hover:border-mood md:inline-flex"
              >
                <span
                  aria-hidden="true"
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ background: MOODS[mood].accent, boxShadow: `0 0 8px ${MOODS[mood].glow}` }}
                />
                {t.mood.moods[mood]}
              </button>
            )}

            <button
              type="button"
              onClick={toggleTheme}
              aria-label={isNight ? t.theme.toLight : t.theme.toDark}
              className="flex h-11 w-11 items-center justify-center rounded-full text-ink transition-colors duration-instant hover:bg-raised"
            >
              <SunMoonIcon night={isNight} />
            </button>

            <button
              type="button"
              onClick={toggleLang}
              aria-label={lang === 'en' ? 'التبديل إلى العربية' : 'Switch to English'}
              className="flex min-h-[44px] items-center rounded-pill border border-line bg-raised px-4 text-small font-semibold text-ink transition-colors duration-instant hover:border-mood"
            >
              {lang === 'en' ? (
                <>
                  EN <span className="mx-1.5 text-line">|</span> <span className="font-ar">ع</span>
                </>
              ) : (
                <>
                  <span className="font-ar">ع</span> <span className="mx-1.5 text-line">|</span> EN
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => setSheetOpen(true)}
              aria-label={t.nav.openMenu}
              aria-expanded={sheetOpen}
              className="flex h-11 w-11 items-center justify-center rounded-full text-ink transition-colors duration-instant hover:bg-raised lg:hidden"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile bottom-sheet menu (staggered item entrance, 60ms — §2.8) */}
      {sheetOpen && (
        <div className="fixed inset-0 z-[65] lg:hidden" role="presentation" onClick={() => setSheetOpen(false)}>
          <div aria-hidden="true" className="absolute inset-0" style={{ background: 'rgba(27,22,17,.45)' }} />
          <div
            role="dialog"
            aria-modal="true"
            aria-label={t.nav.openMenu}
            className="sheet-in absolute inset-x-0 bottom-0 max-h-[82dvh] overflow-y-auto rounded-t-lg border-t border-line bg-raised p-5 pb-10 shadow-overlay"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <img
                  src={isNight ? '/yashfeen-mark-dark.png' : '/yashfeen-mark.png'}
                  alt=""
                  width="28"
                  height="25"
                  className="h-[25px] w-7 object-contain"
                />
                <span className="font-display text-xl font-semibold text-ink">Yashfeen</span>
              </span>
              <button
                type="button"
                onClick={() => setSheetOpen(false)}
                aria-label={t.nav.closeMenu}
                className="flex h-11 w-11 items-center justify-center rounded-full text-ink-muted hover:text-ink"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>
            <ul className="space-y-1">
              {SECTION_ROUTES.map((r, i) => (
                <li key={r.path} className="sheet-item-in" style={{ animationDelay: `${i * 60}ms` }}>
                  <NavLink
                    to={r.path}
                    end={r.path === '/'}
                    onClick={() => setSheetOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        'flex min-h-[48px] items-center justify-between rounded-md px-4 text-body font-medium text-ink transition-colors duration-instant hover:bg-[var(--mood-accent-soft)]',
                        isActive && 'bg-[var(--mood-accent-soft)] font-semibold text-ink',
                      )
                    }
                  >
                    {t.nav[r.key]}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true" className="rtl-flip opacity-50">
                      <path d="M9 6l6 6-6 6" />
                    </svg>
                  </NavLink>
                </li>
              ))}
            </ul>
            {hasChosen && (
              <button
                type="button"
                onClick={() => {
                  setSheetOpen(false)
                  openPrompt()
                }}
                className="sheet-item-in mt-4 flex min-h-[48px] w-full items-center gap-2 rounded-md border border-line px-4 text-small text-ink"
                style={{ animationDelay: `${SECTION_ROUTES.length * 60}ms` }}
              >
                <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full" style={{ background: MOODS[mood].accent }} />
                {t.mood.changeMood} — {t.mood.moods[mood]}
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
