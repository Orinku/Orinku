import { useQuery } from '@tanstack/react-query'
import { fetchTopTen } from '../api'

export function useTopTen() {
  return useQuery({
    queryKey: ['top-ten'],
    queryFn: ({ signal }) => fetchTopTen(signal),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  })
}
