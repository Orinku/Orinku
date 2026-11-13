import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { fetchBrowse } from '../api'
import type { BrowseKind } from '../types/api'

export function useBrowse(kind: BrowseKind, page: number) {
  return useQuery({
    queryKey: ['browse', kind, page],
    queryFn: ({ signal }) => fetchBrowse(kind, page, signal),
    // Keep the current grid on screen while the next page loads, instead of flashing skeletons.
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  })
}
