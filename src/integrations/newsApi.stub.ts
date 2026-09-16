import type { Article } from '@/data/types'

export interface NewsApiResult {
  ok: true
  fetchedAt: string
  articles: Article[]
}

// STUB: wire to a real news API (e.g. GET /news?locale=en|ar) when the backend exists.
// This stub performs NO network call; it returns mock success after 400ms with the
// local sample articles so UI states can be developed against a realistic shape.
export async function fetchLatestNews(locale: 'en' | 'ar'): Promise<NewsApiResult> {
  const { articles } = await import('@/data/articles')
  await new Promise((resolve) => setTimeout(resolve, 400))
  void locale
  return { ok: true, fetchedAt: new Date().toISOString(), articles }
}
