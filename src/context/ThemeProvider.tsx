import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'

export type Theme = 'salt' | 'wadi-night'

const THEME_STORAGE_KEY = 'afya-theme'

interface ThemeContextValue {
  theme: Theme
  isNight: boolean
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

function readInitialTheme(): Theme {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY)
    if (stored === 'salt' || stored === 'wadi-night') return stored
  } catch {
    /* ignore */
  }
  return 'salt'
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(readInitialTheme)

  const setTheme = (next: Theme) => {
    setThemeState(next)
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next)
    } catch {
      /* ignore */
    }
  }

  // data-theme="wadi-night" on <html> remaps the semantic tokens (§2.10)
  useEffect(() => {
    const root = document.documentElement
    if (theme === 'wadi-night') root.setAttribute('data-theme', 'wadi-night')
    else root.removeAttribute('data-theme')
  }, [theme])

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      isNight: theme === 'wadi-night',
      setTheme,
      toggleTheme: () => setTheme(theme === 'wadi-night' ? 'salt' : 'wadi-night'),
    }),
    [theme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>')
  return ctx
}
