import { useQuery } from '@tanstack/react-query'
import { fetchHome } from '../api'

export function useHome() {
  return useQuery({
    queryKey: ['home'],
    queryFn: ({ signal }) => fetchHome(signal),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  })
}
