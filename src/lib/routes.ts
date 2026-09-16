/**
 * Canonical route table — the 10 MVP sections (design.md §1).
 * Shared by Navbar, Footer, and App routing.
 */
export interface SectionRoute {
  path: string
  /** key into t.nav */
  key: 'home' | 'news' | 'tourism' | 'mind' | 'stories' | 'verified' | 'directory' | 'events' | 'live' | 'connect'
}

export const SECTION_ROUTES: SectionRoute[] = [
  { path: '/', key: 'home' },
  { path: '/news', key: 'news' },
  { path: '/medical-tourism', key: 'tourism' },
  { path: '/mind', key: 'mind' },
  { path: '/stories', key: 'stories' },
  { path: '/verified', key: 'verified' },
  { path: '/directory', key: 'directory' },
  { path: '/events', key: 'events' },
  { path: '/live', key: 'live' },
  { path: '/connect', key: 'connect' },
]

/** First 6 are visible on desktop nav; the rest collapse into "More ▾" (§2.8). */
export const PRIMARY_ROUTES = SECTION_ROUTES.slice(0, 6)
export const MORE_ROUTES = SECTION_ROUTES.slice(6)
