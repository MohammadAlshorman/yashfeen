import { Link } from 'react-router'
import { useLanguage } from '@/context/LanguageProvider'
import { useTheme } from '@/context/ThemeProvider'
import { SECTION_ROUTES } from '@/lib/routes'

/**
 * Footer (design.md §2.8): Wadi Night surface in BOTH themes, dune-contour SVG
 * divider on top, 4 columns, universal disclaimer bar with Anemone-red dot.
 */
export function Footer() {
  const { t, lang, toggleLang } = useLanguage()
  const { isNight, toggleTheme } = useTheme()

  return (
    <footer className="relative mt-24 text-cream-text" style={{ background: 'var(--afya-wadi-night)' }}>
      {/* Dune-contour SVG divider */}
      <svg
        aria-hidden="true"
        className="absolute -top-6 left-0 h-6 w-full"
        viewBox="0 0 1200 24"
        preserveAspectRatio="none"
      >
        <path
          d="M0 24 C 150 6, 300 18, 450 10 S 700 20, 850 8 S 1100 16, 1200 6 L 1200 24 Z"
          fill="var(--afya-wadi-night)"
        />
        <path
          d="M0 24 C 150 6, 300 18, 450 10 S 700 20, 850 8 S 1100 16, 1200 6"
          fill="none"
          stroke="var(--afya-rum-sand)"
          strokeOpacity="0.25"
          strokeWidth="1"
        />
      </svg>

      <div className="mx-auto max-w-content px-4 pb-8 pt-16 md:px-6">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand + mission */}
          <div>
            <p className="flex items-center gap-2.5">
              {/* Footer is always Wadi Night → white-stroke mark */}
              <img src="/yashfeen-mark-dark.png" alt="" width="38" height="34" className="h-[34px] w-[38px] object-contain" />
              <span className="flex items-baseline gap-2">
                <span className="font-display text-2xl font-semibold">Yashfeen</span>
                <span className="font-ar text-micro font-bold text-cream-muted">يشفين</span>
              </span>
            </p>
            <p className="mt-3 max-w-[32ch] text-small text-cream-muted">{t.footer.mission}</p>
            {/* Language + theme toggles repeated (§2.8) */}
            <div className="mt-5 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={toggleLang}
                className="min-h-[44px] rounded-pill border border-night-border px-4 text-small font-semibold text-cream-text transition-colors duration-instant hover:border-cream-muted"
                aria-label={t.footer.languageLabel}
              >
                {lang === 'en' ? (
                  <>
                    EN <span className="mx-1 text-night-border">|</span> <span className="font-ar">ع</span>
                  </>
                ) : (
                  <>
                    <span className="font-ar">ع</span> <span className="mx-1 text-night-border">|</span> EN
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={toggleTheme}
                className="min-h-[44px] rounded-pill border border-night-border px-4 text-small font-semibold text-cream-text transition-colors duration-instant hover:border-cream-muted"
                aria-label={t.footer.themeLabel}
              >
                {isNight ? t.footer.themeLight : t.footer.themeDark}
              </button>
            </div>
          </div>

          {/* Sections (10 links) */}
          <nav aria-label={t.footer.sectionsTitle}>
            <p className="text-micro uppercase text-cream-muted [html[lang=ar]_&]:normal-case">{t.footer.sectionsTitle}</p>
            <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2">
              {SECTION_ROUTES.map((r) => (
                <li key={r.path}>
                  <Link
                    to={r.path}
                    className="inline-flex min-h-[36px] items-center text-small text-cream-muted transition-colors duration-instant hover:text-cream-text"
                  >
                    {t.nav[r.key]}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Connect deep links + direct contact */}
          <div>
            <p className="text-micro uppercase text-cream-muted [html[lang=ar]_&]:normal-case">{t.footer.connectTitle}</p>
            <ul className="mt-4 space-y-2">
              <li>
                <a
                  href="tel:+962771777711"
                  className="inline-flex min-h-[36px] items-center gap-2 text-small text-cream-muted transition-colors duration-instant hover:text-cream-text"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />
                  </svg>
                  <span dir="ltr">+962 77 1777 711</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:m.maharmeh@obscurejo.com"
                  className="inline-flex min-h-[36px] items-center gap-2 text-small text-cream-muted transition-colors duration-instant hover:text-cream-text"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <path d="m3 7 9 6 9-6" />
                  </svg>
                  m.maharmeh@obscurejo.com
                </a>
              </li>
              <li>
                <a
                  href="https://t.me/afyajo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[36px] items-center gap-2 text-small text-cream-muted transition-colors duration-instant hover:text-cream-text"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M21 4 3 11.2l5.5 2L10 19l2.8-3.4L17 18l4-14Z" />
                  </svg>
                  {t.footer.telegram}
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/962771777711"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[36px] items-center gap-2 text-small text-cream-muted transition-colors duration-instant hover:text-cream-text"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.6-1.2A9 9 0 1 0 12 3Z" />
                    <path d="M9.5 8.5c.3 2.5 3.5 5.5 6 6l1.5-1.5-2-1.5-1 .8c-1-.5-2-1.5-2.5-2.5l.8-1-1.5-2-1.3 1.7Z" />
                  </svg>
                  {t.footer.whatsapp}
                </a>
              </li>
              <li>
                <Link
                  to="/connect"
                  className="inline-flex min-h-[36px] items-center gap-2 text-small text-cream-muted transition-colors duration-instant hover:text-cream-text"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
                    <rect x="7" y="3" width="10" height="18" rx="2" />
                    <path d="M11 18h2" />
                  </svg>
                  {t.home.connect.sms}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <p className="text-micro uppercase text-cream-muted [html[lang=ar]_&]:normal-case">Yashfeen</p>
            <p className="mt-4 max-w-[36ch] text-small text-cream-muted">{t.footer.legal}</p>
          </div>
        </div>

        {/* Universal disclaimer bar (§2.8/§2.11) */}
        <div className="mt-12 border-t border-night-border pt-6">
          <p className="flex items-center gap-2 text-small text-cream-muted">
            <span aria-hidden="true" className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-anemone" />
            {t.disclaimer}
          </p>
        </div>
      </div>
    </footer>
  )
}
