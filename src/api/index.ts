import type {
  BrowseKind,
  HomeData,
  ListItem,
  Paginated,
  ScheduleItem,
  TopTenData,
} from '../types/api'
import { apiGet } from './client'

/** GET /api: spotlights, trending, top airing and the genre list. */
export const fetchHome = (signal?: AbortSignal) => apiGet<HomeData>('/api', signal)

/** GET /api/top-ten: ranked lists for today, this week and this month. */
export const fetchTopTen = (signal?: AbortSignal) => apiGet<TopTenData>('/api/top-ten', signal)

/** Name of the query-string parameter the paginated endpoints read the page number from. */
const PAGE_PARAM = 'page'

/** GET /api/{new-release | most-popular | newly-added}?page=N */
export const fetchBrowse = (kind: BrowseKind, page: number, signal?: AbortSignal) =>
  apiGet<Paginated<ListItem>>(`/api/${kind}?${PAGE_PARAM}=${page}`, signal)

/** GET /api/schedule: today's airing episodes, times in UTC. */
export const fetchSchedule = (signal?: AbortSignal) =>
  apiGet<ScheduleItem[]>('/api/schedule', signal)
