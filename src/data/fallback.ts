import type { Anime } from '../types/anime'

/**
 * Shown only when AniList can't be reached (offline, blocked, rate-limited),
 * so the page still renders something sensible instead of a blank screen.
 */
const base: Omit<Anime, 'id' | 'title' | 'description' | 'color'> = {
  bannerImage: null,
  cover: null,
  format: null,
  year: null,
  genres: [],
  score: null,
}

export const FALLBACK_ANIME: Anime[] = [
  {
    ...base,
    id: 1,
    title: 'A Silent Voice',
    description:
      'A grade-school student with a hearing impairment is bullied and transfers to another school. Years later, the former bully is tormented by his behaviour and sets out to make amends.',
    color: '#5b6b5a',
    format: 'MOVIE',
  },
  { ...base, id: 2, title: 'Jujutsu Kaisen: Shibuya Incident', description: '', color: '#4b3a7a' },
  { ...base, id: 3, title: 'One Piece: Egghead Arc', description: '', color: '#2f7fc4' },
  { ...base, id: 4, title: 'Wind Breaker', description: '', color: '#1f5a3a' },
  { ...base, id: 5, title: 'Kaiju No. 8', description: '', color: '#44503f' },
  { ...base, id: 6, title: 'Fallback 6', description: '', color: '#5a3a3a' },
  { ...base, id: 7, title: 'Fallback 7', description: '', color: '#3a4a5a' },
  { ...base, id: 8, title: 'Fallback 8', description: '', color: '#5a4a3a' },
  { ...base, id: 9, title: 'Fallback 9', description: '', color: '#3a5a4a' },
  { ...base, id: 10, title: 'Fallback 10', description: '', color: '#4a3a5a' },
]
