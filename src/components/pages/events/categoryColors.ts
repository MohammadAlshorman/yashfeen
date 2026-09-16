import type { EventCategory } from '@/data'

/** Category dot colors (events.md §2 — fixed, never mood-shifted). */
export const CATEGORY_DOT: Record<EventCategory, string> = {
  screening: 'var(--afya-deadsea-teal)',
  workshop: 'var(--afya-petra-rose)',
  walk: 'var(--afya-rum-sand)',
  talk: 'var(--afya-text)',
}
