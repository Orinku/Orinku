/** Every endpoint wraps its payload like this. */
export interface ApiEnvelope<T> {
  success: boolean
  results: T
}

/** A featured title for the hero slideshow. */
export interface Spotlight {
  slug: string
  /** Wide backdrop image (not a portrait poster). */
  poster: string
  title: string
  japaneseTitle: string
  /** Already truncated by the API, usually ending in "...". */
  description: string
  /** e.g. "7.49", or an empty string when unrated. */
  rating: string
  quality: string
  sub: number
  dub: number
  /** Free-form, e.g. "Oct 7, 2026 to ?" or "2026". */
  date: string
  /** "TV", "ONA", "MOVIE"… sometimes empty. */
  type: string
}

export interface TrendingItem {
  /** May include an episode suffix, e.g. "soar-high-isami-1e6b7/ep-9". */
  slug: string
  poster: string
  title: string
  japaneseTitle: string
  sub: number
  dub: number
  total: number
  type: string
}

export interface TopAiringItem {
  slug: string
  poster: string
  title: string
  sub: number
  dub: number
  type: string
}

/** GET /api */
export interface HomeData {
  spotlights: Spotlight[]
  trending: TrendingItem[]
  topAiring: TopAiringItem[]
  genres: string[]
}

export type TopTenPeriod = 'today' | 'week' | 'month'

export interface TopTenItem {
  slug: string
  /** 1-based position within its period. */
  rank: number
  name: string
  /** Portrait thumbnail. */
  poster: string
  sub: number
  dub: number
  type: string
}

/** GET /api/top-ten */
export type TopTenData = Record<TopTenPeriod, TopTenItem[]>

/** One card in the Newest / Popular / New Added lists. */
export interface ListItem {
  /** Usually ends in an episode, e.g. "seeing-double-af94a/ep-1"; upcoming titles have none. */
  slug: string
  /** Portrait thumbnail. */
  poster: string
  title: string
  japaneseTitle: string
  /** Subbed episodes released so far. */
  sub: number
  /** Dubbed episodes released so far. */
  dub: number
  /** Planned episode count, or 0 when unknown / still running. */
  total: number
  /** Often empty; upcoming titles carry a duration here, e.g. "24 min". */
  type: string
  /** "7.41", or "", or "?" when unrated. */
  rating: string
}

export interface Pagination {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  hasNext: boolean
  hasPrev: boolean
}

export interface Paginated<T> {
  totalPages: number
  data: T[]
  pagination: Pagination
}

/** The three browse lists, keyed by the API route they come from. */
export type BrowseKind = 'new-release' | 'most-popular' | 'newly-added'

/** GET /api/schedule: today's episodes. `time` is "HH:mm" in UTC. */
export interface ScheduleItem {
  slug: string
  title: string
  japaneseTitle: string
  time: string
  episode_no: number
}
