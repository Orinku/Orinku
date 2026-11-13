import type { HomeData } from '../types/api'
import { apiGet } from './client'

/** GET /api: spotlights, trending, top airing and the genre list. */
export const fetchHome = (signal?: AbortSignal) => apiGet<HomeData>('/api', signal)
