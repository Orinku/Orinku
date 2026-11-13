import { useQuery } from '@tanstack/react-query'
import { fetchTrending } from '../api/anilist'

export function useTrendingAnime() {
  return useQuery({
    queryKey: ['anime', 'trending'],
    queryFn: ({ signal }) => fetchTrending(signal),
    staleTime: 10 * 60 * 1000,
    retry: 1,
  })
}
