import { trpc } from '@/providers/trpc'

/**
 * Shared CMS content hooks — the public pages' single access point to the
 * live tRPC content API (`content.*`, published rows only). Each hook returns
 * the standard React Query result (`data`, `isLoading`, `isError`, `refetch`…)
 * with shapes identical to the old local data layer.
 *
 * Content changes rarely: 60s staleTime avoids refetch storms on navigation.
 */
const CMS_QUERY_OPTIONS = { staleTime: 60_000 } as const

export function useCmsArticles() {
  return trpc.content.articles.useQuery(undefined, CMS_QUERY_OPTIONS)
}

export function useCmsDoctors() {
  return trpc.content.doctors.useQuery(undefined, CMS_QUERY_OPTIONS)
}

export function useCmsPharmacies() {
  return trpc.content.pharmacies.useQuery(undefined, CMS_QUERY_OPTIONS)
}

export function useCmsServices() {
  return trpc.content.services.useQuery(undefined, CMS_QUERY_OPTIONS)
}

export function useCmsEvents() {
  return trpc.content.events.useQuery(undefined, CMS_QUERY_OPTIONS)
}

export function useCmsEpisodes() {
  return trpc.content.episodes.useQuery(undefined, CMS_QUERY_OPTIONS)
}

export function useCmsStories() {
  return trpc.content.stories.useQuery(undefined, CMS_QUERY_OPTIONS)
}
