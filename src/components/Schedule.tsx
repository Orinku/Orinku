import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import styled, { keyframes } from 'styled-components'
import { useNow } from '../hooks/useNow'
import { animeSlug, dayOffset, formatLocalTime, localZoneLabel, utcTimeToDate } from '../lib/format'
import type { ScheduleItem } from '../types/api'
import { ErrorState } from './ErrorState'

interface ScheduleProps {
  /** `undefined` while loading. */
  items: ScheduleItem[] | undefined
  isError: boolean
  onRetry: () => void
}

const COLLAPSED_COUNT = 8

const dateFormat = new Intl.DateTimeFormat([], { weekday: 'long', month: 'short', day: 'numeric' })

/** Today's episodes. The API sends UTC times; they're shown in the visitor's own time zone. */
export function Schedule({ items, isError, onRetry }: ScheduleProps) {
  const now = useNow()
  const [expanded, setExpanded] = useState(false)

  const rows = useMemo(
    () =>
      (items ?? []).map((item) => {
        const at = utcTimeToDate(item.time)
        return { item, at }
      }),
    [items],
  )

  // The first episode that hasn't aired yet is "next up"; earlier ones are dimmed.
  const nextIndex = rows.findIndex((row) => row.at && row.at > now)
  const visible = expanded ? rows : rows.slice(0, COLLAPSED_COUNT)

  return (
    <Section aria-labelledby="schedule-heading">
      <Eyebrow>Estimated</Eyebrow>
      <Heading id="schedule-heading">Airing Schedule</Heading>
      <Note>
        {dateFormat.format(now)} · times in your local time ({localZoneLabel(now)})
      </Note>

      {isError && !items ? (
        <ErrorState message="Couldn't load the schedule." onRetry={onRetry} />
      ) : (
        <Box>
          {items ? (
            rows.length === 0 ? (
              <Empty>Nothing is scheduled for today.</Empty>
            ) : (
              <>
                <List>
                  {visible.map(({ item, at }, index) => {
                    const offset = at ? dayOffset(at, now) : 0
                    return (
                      <li key={`${item.slug}-${item.time}`}>
                        <Row
                          to={`/anime/${animeSlug(item.slug)}`}
                          $state={index === nextIndex ? 'next' : at && at <= now ? 'past' : 'later'}
                          aria-current={index === nextIndex ? 'true' : undefined}
                          title={item.japaneseTitle !== item.title ? item.japaneseTitle : undefined}
                        >
                          <Time dateTime={item.time}>
                            {at ? formatLocalTime(at) : '--:--'}
                            {offset !== 0 && (
                              <Offset title={offset > 0 ? 'Tomorrow' : 'Yesterday'}>
                                {offset > 0 ? `+${offset}d` : `${offset}d`}
                              </Offset>
                            )}
                          </Time>
                          <Title>{item.title}</Title>
                          <Episode>EP {item.episode_no}</Episode>
                        </Row>
                      </li>
                    )
                  })}
                </List>
                {rows.length > COLLAPSED_COUNT && (
                  <MoreButton type="button" aria-expanded={expanded} onClick={() => setExpanded((v) => !v)}>
                    {expanded ? 'Show Less' : 'View More'}
                  </MoreButton>
                )}
              </>
            )
          ) : (
            <List aria-hidden="true">
              {Array.from({ length: COLLAPSED_COUNT }, (_, index) => (
                <li key={index}>
                  <SkeletonRow />
                </li>
              ))}
            </List>
          )}
        </Box>
      )}
    </Section>
  )
}

const pulse = keyframes`
  0%, 100% { opacity: 0.4; }
  50% { opacity: 0.9; }
`

const Section = styled.section`
  padding-top: clamp(0.5rem, 1.5vw, 1.5rem);
`

const Eyebrow = styled.p`
  color: rgba(255, 255, 255, 0.55);
  font-size: clamp(0.85rem, 0.8rem + 0.2vw, 1rem);
  font-weight: 400;
`

const Heading = styled.h2`
  font-size: clamp(1.25rem, 1.1rem + 0.5vw, 1.7rem);
  font-weight: 700;
  line-height: 1.2;
`

const Note = styled.p`
  margin: 0.25rem 0 1rem;
  color: rgba(255, 255, 255, 0.45);
  font-size: clamp(0.72rem, 0.68rem + 0.15vw, 0.82rem);
`

const Box = styled.div`
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: clamp(14px, 1.3vw, 22px);
  background: #0c0c0d;
  overflow: hidden;
`

const List = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;

  li + li {
    border-top: 1px solid rgba(255, 255, 255, 0.05);
  }
`

const Row = styled(Link)<{ $state: 'past' | 'next' | 'later' }>`
  display: grid;
  grid-template-columns: 4.4rem minmax(0, 1fr) auto;
  align-items: center;
  gap: 0.6rem;
  padding: 0.8rem clamp(0.75rem, 1vw, 1rem);
  border-left: 3px solid ${({ $state, theme }) => ($state === 'next' ? theme.colors.accent : 'transparent')};
  background: ${({ $state }) => ($state === 'next' ? 'rgba(255, 255, 255, 0.05)' : 'transparent')};
  opacity: ${({ $state }) => ($state === 'past' ? 0.5 : 1)};
  outline: none;
  transition:
    background 0.2s ease,
    opacity 0.2s ease;

  &:hover,
  &:focus-visible {
    background: rgba(255, 255, 255, 0.08);
    opacity: 1;
  }

  &:focus-visible {
    box-shadow: inset 0 0 0 2px ${({ theme }) => theme.colors.accent};
  }
`

const Time = styled.time`
  display: inline-flex;
  align-items: baseline;
  gap: 0.25rem;
  color: rgba(255, 255, 255, 0.55);
  font-size: clamp(0.76rem, 0.72rem + 0.15vw, 0.88rem);
  font-variant-numeric: tabular-nums;
`

const Offset = styled.sup`
  color: rgba(255, 255, 255, 0.4);
  font-size: 0.62rem;
`

const Title = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: clamp(0.8rem, 0.76rem + 0.2vw, 0.95rem);
  font-weight: 500;
`

const Episode = styled.span`
  padding: 0.15em 0.6em;
  border-radius: 0.5rem;
  background: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.85);
  font-size: 0.72rem;
  font-weight: 600;
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
`

const MoreButton = styled.button`
  display: block;
  width: 100%;
  padding: 0.9rem;
  border: 0;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  background: transparent;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.85rem;
  cursor: pointer;
  transition:
    background 0.2s ease,
    color 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    color: ${({ theme }) => theme.colors.white};
  }
`

const SkeletonRow = styled.div`
  height: 2.9rem;
  margin: 0.4rem 0.75rem;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.07);
  animation: ${pulse} 1.4s ease-in-out infinite;
`

const Empty = styled.p`
  padding: 1.5rem 1rem;
  text-align: center;
  color: rgba(255, 255, 255, 0.55);
  font-size: 0.9rem;
`
