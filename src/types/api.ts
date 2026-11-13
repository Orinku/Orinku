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
