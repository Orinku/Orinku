import type { HomeData, TopTenData } from '../types/api'
import { apiGet } from './client'

/** GET /api: spotlights, trending, top airing and the genre list. */
export const fetchHome = (signal?: AbortSignal) => apiGet<HomeData>('/api', signal)

/** GET /api/top-ten: ranked lists for today, this week and this month. */
export const fetchTopTen = (signal?: AbortSignal) => apiGet<TopTenData>('/api/top-ten', signal)
