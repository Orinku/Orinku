import type { ListItem } from '../types/api'

/** The API may append an episode (".../ep-8"); the details page only wants the title's slug. */
export const animeSlug = (slug: string) => slug.split('/')[0]

/** "7.41" -> "7.41"; "", "?" and anything non-numeric -> null. */
export function ratingLabel(rating: string): string | null {
  const value = Number.parseFloat(rating)
  return Number.isFinite(value) && value > 0 ? rating : null
}

export type AnimeStatus = 'airing' | 'completed' | 'upcoming'

/** Best guess from episode counts; the lists don't carry an explicit status. */
export function statusOf(item: Pick<ListItem, 'sub' | 'total'>): AnimeStatus {
  if (item.sub === 0) return 'upcoming'
  if (item.total > 0 && item.sub >= item.total) return 'completed'
  return 'airing'
}

export const STATUS_LABELS: Record<AnimeStatus, string> = {
  airing: 'Airing',
  completed: 'Completed',
  upcoming: 'Upcoming',
}

/**
 * Turns a "HH:mm" UTC time into a Date on today's UTC calendar day.
 * Returns null when the string isn't a valid time.
 */
export function utcTimeToDate(time: string, now: Date = new Date()): Date | null {
  const match = /^(\d{1,2}):(\d{2})$/.exec(time)
  if (!match) return null
  const [hours, minutes] = [Number(match[1]), Number(match[2])]
  if (hours > 23 || minutes > 59) return null
  return new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), hours, minutes),
  )
}

// `hourCycle: 'h23'` (not `hour12: false`) so midnight reads "00:10", never "24:10".
const timeFormat = new Intl.DateTimeFormat([], {
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
})

/** "09:55" in the visitor's own time zone. */
export const formatLocalTime = (date: Date) => timeFormat.format(date)

/** Whole local calendar days between `date` and `now` (e.g. 1 = tomorrow, -1 = yesterday). */
export function dayOffset(date: Date, now: Date = new Date()): number {
  const startOf = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()
  return Math.round((startOf(date) - startOf(now)) / 86_400_000)
}

/** "GMT+6", for the "times shown in" note. */
export function localZoneLabel(now: Date = new Date()): string {
  return (
    new Intl.DateTimeFormat([], { timeZoneName: 'short' })
      .formatToParts(now)
      .find((part) => part.type === 'timeZoneName')?.value ?? 'local time'
  )
}
