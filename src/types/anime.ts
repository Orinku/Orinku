export interface Anime {
  id: number
  title: string
  description: string
  /** Wide image used in the hero. */
  bannerImage: string | null
  /** Poster used in the "Top this week" row. */
  cover: string | null
  /** Dominant cover colour, used as a placeholder while images load. */
  color: string | null
  format: string | null
  year: number | null
  genres: string[]
  /** 0–100 */
  score: number | null
}
