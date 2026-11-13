import { useState } from 'react'
import { Link } from 'react-router-dom'
import styled, { css, keyframes } from 'styled-components'
import { animeSlug } from '../lib/format'
import type { TopTenData, TopTenPeriod } from '../types/api'
import { ErrorState } from './ErrorState'
import { MetaChips } from './meta'
import { ExpandBar, Panel } from './Panel'
import { Segmented } from './Segmented'

interface TopAnimeProps {
  /** `undefined` while loading. */
  data: TopTenData | undefined
  isError: boolean
  onRetry: () => void
}

const PERIODS = [
  { id: 'today', label: 'Today' },
  { id: 'week', label: 'Week' },
  { id: 'month', label: 'Month' },
] as const satisfies readonly { id: TopTenPeriod; label: string }[]

const COLLAPSED_COUNT = 5

/** Ranked list with a Today / Week / Month switch and a rank badge on every poster. */
export function TopAnime({ data, isError, onRetry }: TopAnimeProps) {
  const [period, setPeriod] = useState<TopTenPeriod>('week')
  const [expanded, setExpanded] = useState(false)

  const items = data?.[period]
  const visible = expanded ? items : items?.slice(0, COLLAPSED_COUNT)
  const canExpand = (items?.length ?? 0) > COLLAPSED_COUNT

  return (
    <Panel
      title="Top Anime"
      action={
        <Segmented
          compact
          label="Ranking period"
          options={PERIODS}
          value={period}
          onChange={setPeriod}
        />
      }
    >
      {isError && !data ? (
        <ErrorState message="Couldn't load the rankings." onRetry={onRetry} />
      ) : (
        <>
          <List>
            {visible
              ? visible.map((item) => (
                  <li key={`${period}-${item.slug}`}>
                    <Row
                      to={`/anime/${animeSlug(item.slug)}`}
                      $poster={item.poster}
                      aria-label={`Number ${item.rank}: ${item.name}`}
                    >
                      <Thumb>
                        <img src={item.poster} alt="" loading="lazy" referrerPolicy="no-referrer" />
                        <Badge $rank={item.rank} aria-hidden="true">
                          {item.rank}
                        </Badge>
                      </Thumb>
                      <Text>
                        <Name>{item.name}</Name>
                        <MetaChips type={item.type} sub={item.sub} dub={item.dub} />
                      </Text>
                    </Row>
                  </li>
                ))
              : Array.from({ length: COLLAPSED_COUNT }, (_, index) => (
                  <li key={index}>
                    <SkeletonRow aria-hidden="true" />
                  </li>
                ))}
          </List>
          {canExpand && (
            <ExpandBar
              expanded={expanded}
              onToggle={() => setExpanded((value) => !value)}
              controls="more rankings"
            />
          )}
        </>
      )}
    </Panel>
  )
}

const pulse = keyframes`
  0%, 100% { opacity: 0.55; }
  50% { opacity: 1; }
`

const List = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
  margin: 0;
  padding: 0;
  list-style: none;
`

const ROW_HEIGHT = 'clamp(4.6rem, 3.6rem + 2.6vw, 6.2rem)'

const rowBase = css`
  display: flex;
  align-items: center;
  gap: clamp(0.75rem, 1.1vw, 1.1rem);
  height: ${ROW_HEIGHT};
  padding-right: 0.8rem;
  border-radius: 14px;
  background-color: #151517;
  overflow: hidden;
`

const Row = styled(Link)<{ $poster: string }>`
  ${rowBase}
  position: relative;
  isolation: isolate;
  outline: none;
  transition:
    background-color 0.25s ease,
    transform 0.25s ease;

  /* The poster, blurred, bleeding in from the right and fading out towards the text. */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: -1;
    background:
      linear-gradient(90deg, #151517 28%, rgba(21, 21, 23, 0.55) 70%, rgba(21, 21, 23, 0.8)),
      url(${({ $poster }) => JSON.stringify($poster)}) center / cover;
    filter: blur(6px) saturate(0.8);
    opacity: 0.55;
    transform: scale(1.15);
  }

  &:hover,
  &:focus-visible {
    background-color: #1d1d20;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.accent};
    outline-offset: 2px;
  }
`

const SkeletonRow = styled.div`
  ${rowBase}
  animation: ${pulse} 1.4s ease-in-out infinite;
`

const Thumb = styled.div`
  position: relative;
  flex: none;
  height: 100%;
  aspect-ratio: 2 / 3;
  background: ${({ theme }) => theme.colors.surface};

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`

const BADGE_COLORS: Record<number, { bg: string; fg: string }> = {
  1: { bg: '#f5c542', fg: '#2a2000' },
  2: { bg: '#d4d8df', fg: '#1d2026' },
  3: { bg: '#d9915a', fg: '#2a1400' },
}

/** Gold / silver / bronze for the podium, dark glass for the rest. */
const Badge = styled.span<{ $rank: number }>`
  position: absolute;
  top: 0.35rem;
  left: 0.35rem;
  display: grid;
  place-items: center;
  min-width: 1.45rem;
  height: 1.45rem;
  padding: 0 0.3rem;
  border-radius: 999px;
  background: ${({ $rank }) => BADGE_COLORS[$rank]?.bg ?? 'rgba(10, 10, 10, 0.78)'};
  color: ${({ $rank }) => BADGE_COLORS[$rank]?.fg ?? '#fff'};
  font-size: 0.74rem;
  font-weight: 700;
  line-height: 1;
  font-variant-numeric: tabular-nums;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
`

const Text = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.45rem;
  min-width: 0;
`

const Name = styled.span`
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  overflow: hidden;
  font-size: clamp(0.82rem, 0.76rem + 0.25vw, 1rem);
  font-weight: 500;
  line-height: 1.3;
`
