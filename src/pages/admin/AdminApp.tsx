import { Link } from 'react-router'
import { useAuth } from '@/hooks/useAuth'
import { useLanguage } from '@/context/LanguageProvider'
import { AdminShell } from './AdminShell'

/**
 * /admin — Yashfeen CMS entry point (wired into App.tsx by the main agent).
 *
 * Auth gate (react-dev.md full-stack contract):
 * - isLoading            → Yashfeen skeleton
 * - unauthenticated      → useAuth redirects to LOGIN_PATH
 * - signed in, not admin → polite bilingual "no access" screen
 * - admin                → AdminShell (tabs + CRUD lists)
 */
export default function AdminApp() {
  const { t } = useLanguage()
  const { user, isLoading, isAuthenticated, logout } = useAuth({ redirectOnUnauthenticated: true })

  if (isLoading || !isAuthenticated || !user) {
    // While redirecting to /login, keep the skeleton up.
    return (
      <div className="mx-auto max-w-content px-4 py-10 md:px-6" role="status" aria-label={t.admin.loading}>
        <span className="sr-only">{t.admin.loading}</span>
        <div className="h-9 w-48 animate-pulse rounded-sm bg-line" aria-hidden="true" />
        <div className="mt-6 h-12 animate-pulse rounded-pill bg-line" aria-hidden="true" />
        <div className="mt-6 space-y-3" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <div key={i} className="afya-card h-24 animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (user.role !== 'admin') {
    return (
      <section className="mx-auto max-w-content px-4 py-16 md:px-6 md:py-24">
        <div className="afya-card mx-auto max-w-[560px] p-8 text-center md:p-10">
          <p className="text-micro uppercase text-interactive-accent [html[lang=ar]_&]:normal-case">
            {t.admin.wordmark}
          </p>
          <h1 className="mt-2 font-display text-h2 text-ink">{t.admin.noAccessTitle}</h1>
          <p className="mt-3 text-body text-ink-muted">{t.admin.noAccessBody}</p>
          <Link
            to="/"
            className="mt-6 inline-flex min-h-[44px] items-center justify-center rounded-pill bg-mood-deep px-6 text-small font-semibold text-cream-text transition-opacity duration-instant hover:opacity-90"
          >
            {t.admin.noAccessBack}
          </Link>
        </div>
      </section>
    )
  }

  return <AdminShell userName={user.name ?? user.email ?? 'admin'} onSignOut={logout} />
}
