import { useQuery } from '@tanstack/react-query'
import { fetchSchedule } from '../api'

export function useSchedule() {
  return useQuery({
    queryKey: ['schedule'],
    queryFn: ({ signal }) => fetchSchedule(signal),
    staleTime: 10 * 60 * 1000,
    retry: 1,
  })
}
