import type { Anime } from '../types/anime'

const ENDPOINT = 'https://graphql.anilist.co'

const TRENDING_QUERY = /* GraphQL */ `
  query Trending($perPage: Int) {
    Page(page: 1, perPage: $perPage) {
      media(type: ANIME, sort: TRENDING_DESC, isAdult: false) {
        id
        title {
          romaji
          english
        }
        description(asHtml: false)
        bannerImage
        coverImage {
          extraLarge
          color
        }
        format
        seasonYear
        genres
        averageScore
      }
    }
  }
`

interface AniListMedia {
  id: number
  title: { romaji: string | null; english: string | null }
  description: string | null
  bannerImage: string | null
  coverImage: { extraLarge: string | null; color: string | null }
  format: string | null
  seasonYear: number | null
  genres: string[]
  averageScore: number | null
}

interface TrendingResponse {
  data?: { Page: { media: AniListMedia[] } }
  errors?: { message: string }[]
}

/** AniList descriptions contain stray HTML and "(Source: …)" credits. */
function cleanDescription(raw: string | null): string {
  if (!raw) return ''
  return raw
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/\((?:source|written by)[^)]*\)/gi, '')
    .replace(/\[(?:source|written by)[^\]]*\]/gi, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function toAnime(media: AniListMedia): Anime {
  return {
    id: media.id,
    title: media.title.english ?? media.title.romaji ?? 'Untitled',
    description: cleanDescription(media.description),
    bannerImage: media.bannerImage,
    cover: media.coverImage.extraLarge,
    color: media.coverImage.color,
    format: media.format,
    year: media.seasonYear,
    genres: media.genres,
    score: media.averageScore,
  }
}

export async function fetchTrending(signal?: AbortSignal): Promise<Anime[]> {
  const response = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ query: TRENDING_QUERY, variables: { perPage: 12 } }),
    signal,
  })

  if (!response.ok) {
    throw new Error(`AniList request failed (${response.status})`)
  }

  const json = (await response.json()) as TrendingResponse
  if (!json.data) {
    throw new Error(json.errors?.[0]?.message ?? 'AniList returned no data')
  }

  return json.data.Page.media.map(toAnime)
}
