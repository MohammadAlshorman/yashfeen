import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { BreatheButton } from '@/components/ui-yashfeen/BreatheButton'
import { useLanguage } from '@/context/LanguageProvider'
import { useLenis } from '@/hooks/useLenis'

/**
 * App shell — NESTED-ROUTE pattern (renders <Outlet/>; App.tsx must nest all
 * routes inside `<Route element={<Layout/>}>`. Never wrap <Routes> as children).
 *
 * Nav contract (react-dev.md): the Navbar is `sticky top-0` in normal document
 * flow, so pages need NO top-offset bookkeeping. Page agents: do not add
 * nav-height padding and do not edit the Navbar.
 */
export function Layout() {
  const { t } = useLanguage()
  const location = useLocation()
  useLenis()

  // Restore scroll to top on route change (hash links keep their target)
  useEffect(() => {
    if (!location.hash) window.scrollTo(0, 0)
  }, [location.pathname, location.hash])

  return (
    <div className="flex min-h-[100dvh] flex-col bg-surface text-ink">
      <a href="#main-content" className="skip-link">
        {t.skipLink}
      </a>
      <Navbar />
      <main id="main-content" className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <BreatheButton />
    </div>
  )
}
