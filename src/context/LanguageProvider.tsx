import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { en } from '@/i18n/en'
import type { Dictionary } from '@/i18n/en'
import { ar } from '@/i18n/ar'

export type Lang = 'en' | 'ar'
export type Dir = 'ltr' | 'rtl'

const LANG_STORAGE_KEY = 'afya-lang'

interface LanguageContextValue {
  lang: Lang
  dir: Dir
  setLang: (lang: Lang) => void
  toggleLang: () => void
  /** The full dictionary for the active language. Pattern: t.nav.home */
  t: Dictionary
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

function readInitialLang(): Lang {
  try {
    const stored = localStorage.getItem(LANG_STORAGE_KEY)
    if (stored === 'en' || stored === 'ar') return stored
  } catch {
    /* private mode — fall through */
  }
  return 'en'
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(readInitialLang)

  const setLang = (next: Lang) => {
    setLangState(next)
    try {
      localStorage.setItem(LANG_STORAGE_KEY, next)
    } catch {
      /* ignore */
    }
  }

  // Flip <html lang dir> instantly without reload (§2.9)
  useEffect(() => {
    const root = document.documentElement
    root.lang = lang
    root.dir = lang === 'ar' ? 'rtl' : 'ltr'
  }, [lang])

  const value = useMemo<LanguageContextValue>(
    () => ({
      lang,
      dir: lang === 'ar' ? 'rtl' : 'ltr',
      setLang,
      toggleLang: () => setLang(lang === 'en' ? 'ar' : 'en'),
      t: lang === 'ar' ? ar : en,
    }),
    [lang],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used inside <LanguageProvider>')
  return ctx
}
