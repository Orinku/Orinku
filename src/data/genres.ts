/**
 * The only genres the site shows. The API sends more; anything not listed here
 * is ignored. Edit this list to add or remove a genre from the bar.
 */
export const ALLOWED_GENRES: ReadonlySet<string> = new Set([
  'Action',
  'Adventure',
  'Animation',
  'Cars',
  'Comedy',
  'Demons',
  'Drama',
  'Ecchi',
  'Fantasy',
  'Game',
  'Gourmet',
  'Historical',
  'Horror',
  'Isekai',
  'Kids',
  'Magic',
  'Martial Arts',
  'Mecha',
  'Military',
  'Music',
  'Mystery',
  'Parody',
  'Psychological',
  'Romance',
  'Samurai',
  'School',
  'Sci-Fi',
  'Shoujo',
  'Shounen',
  'Slice of Life',
  'Space',
  'Sports',
  'Supernatural',
  'Suspense',
  'Thriller',
])

/** "Slice of Life" -> "slice-of-life", used in the genre page URL. */
export const genreSlug = (name: string) => name.toLowerCase().replace(/\s+/g, '-')
