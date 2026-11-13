import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import useEmblaCarousel from 'embla-carousel-react'
import { WheelGesturesPlugin } from 'embla-carousel-wheel-gestures'
import styled, { css, keyframes } from 'styled-components'
import type { TopTenData, TopTenPeriod } from '../types/api'
import { ErrorState } from './ErrorState'

interface TopThisWeekProps {
  /** `undefined` while loading. */
  data: TopTenData | undefined
  isError: boolean
  onRetry: () => void
}

const PERIODS: { id: TopTenPeriod; label: string }[] = [
  { id: 'today', label: 'Today' },
  { id: 'week', label: 'Week' },
  { id: 'month', label: 'Month' },
]

const HEADINGS: Record<TopTenPeriod, string> = {
  today: 'Top today',
  week: 'Top this week',
  month: 'Top this month',
}

const SKELETON_COUNT = 6

export function TopThisWeek({ data, isError, onRetry }: TopThisWeekProps) {
  const [period, setPeriod] = useState<TopTenPeriod>('week')

  // The wheel plugin lets a trackpad two-finger swipe (or a tilt-wheel mouse)
  // scroll the row sideways. Vertical wheel movement still scrolls the page.
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: 'start', dragFree: true }, [
    WheelGesturesPlugin(),
  ])

  // Start from #1 whenever the period changes.
  useEffect(() => {
    emblaApi?.scrollTo(0, true)
  }, [period, emblaApi])

  const items = data?.[period]

  return (
    <Section aria-labelledby="top-ten-heading">
      <HeadingRow>
        <Heading id="top-ten-heading">{HEADINGS[period]}</Heading>

        <Tabs role="tablist" aria-label="Ranking period">
          {PERIODS.map(({ id, label }) => (
            <Tab
              key={id}
              type="button"
              role="tab"
              aria-selected={period === id}
              $active={period === id}
              onClick={() => setPeriod(id)}
            >
              {label}
            </Tab>
          ))}
        </Tabs>
      </HeadingRow>

      {isError && !data ? (
        <ErrorWrap>
          <ErrorState message="Couldn't load the rankings." onRetry={onRetry} />
        </ErrorWrap>
      ) : (
        <Viewport ref={emblaRef}>
          <Track>
            {items
              ? items.map((item) => (
                  <Slide key={`${period}-${item.slug}`}>
                    <Card
                      to={`/anime/${item.slug}`}
                      title={item.name}
                      aria-label={`Number ${item.rank}: ${item.name}`}
                      draggable={false}
                    >
                      <Poster $animate>
                        <img
                          src={item.poster}
                          alt=""
                          loading="lazy"
                          referrerPolicy="no-referrer"
                          draggable={false}
                        />
                      </Poster>
                      <Rank aria-hidden="true">{item.rank}</Rank>
                    </Card>
                  </Slide>
                ))
              : Array.from({ length: SKELETON_COUNT }, (_, index) => (
                  <Slide key={index}>
                    <SkeletonCard aria-hidden="true">
                      <Poster $loading />
                      <Rank aria-hidden="true">{index + 1}</Rank>
                    </SkeletonCard>
                  </Slide>
                ))}
          </Track>
        </Viewport>
      )}
    </Section>
  )
}

const pulse = keyframes`
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
`

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`

const Section = styled.section`
  /* One variable drives the whole row so it scales together. */
  --poster: clamp(150px, 16.5vw, 400px);
  --slide: calc(var(--poster) * 1.42);

  position: relative;
  z-index: 1;
  padding: 0 0 clamp(4rem, 8vw, 9rem);
  background: ${({ theme }) => theme.colors.black};

  ${({ theme }) => theme.media.md} {
    --poster: clamp(140px, 40vw, 260px);
    --slide: calc(var(--poster) * 1.3);
  }
`

const HeadingRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin: 0 ${({ theme }) => theme.gutter} clamp(1.2rem, 2.2vw, 2.4rem);
`

const Heading = styled.h2`
  display: flex;
  align-items: center;
  gap: 0.35em;
  font-size: clamp(1.3rem, 1.75vw, 2.2rem);
  font-weight: 600;
  line-height: 1;

  &::before {
    content: '';
    width: 3px;
    height: 1.05em;
    background: ${({ theme }) => theme.colors.accent};
  }
`

/* The Today | Week | Month capsule. */
const Tabs = styled.div`
  display: inline-flex;
  padding: 4px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(8px);
`

const Tab = styled.button<{ $active: boolean }>`
  padding: 0.5em 1.3em;
  border: 0;
  border-radius: 999px;
  background: ${({ $active, theme }) => ($active ? theme.colors.white : 'transparent')};
  color: ${({ $active, theme }) => ($active ? theme.colors.black : theme.colors.white)};
  font-size: clamp(0.8rem, 0.95vw, 1.05rem);
  font-weight: 500;
  line-height: 1.2;
  cursor: pointer;
  transition: background 0.25s ease, color 0.25s ease;

  &:hover {
    background: ${({ $active, theme }) => ($active ? theme.colors.white : 'rgba(255, 255, 255, 0.14)')};
  }
`

const ErrorWrap = styled.div`
  margin: 0 ${({ theme }) => theme.gutter};
`

const Viewport = styled.div`
  overflow: hidden;
  /* room for the hover lift so it isn't clipped */
  padding-top: 0.75rem;
  cursor: grab;
  /* stops a sideways swipe at the row's end from triggering browser back/forward */
  overscroll-behavior-x: contain;

  &:active {
    cursor: grabbing;
  }
`

const Track = styled.div`
  display: flex;
  /* leaves space for the first rank number, which hangs off the poster's left edge */
  padding-left: calc(${({ theme }) => theme.gutter} + var(--poster) * 0.13);
  padding-right: ${({ theme }) => theme.gutter};
  touch-action: pan-y pinch-zoom;
`

const Slide = styled.div`
  flex: 0 0 var(--slide);
  min-width: 0;
`

const Rank = styled.span`
  position: absolute;
  left: calc(var(--poster) * -0.26);
  bottom: calc(var(--poster) * 0.14);
  z-index: 2;
  font-size: calc(var(--poster) * 1.02);
  font-weight: 800;
  line-height: 0.74;
  letter-spacing: -0.04em;
  color: ${({ theme }) => theme.colors.white};
  pointer-events: none;
  user-select: none;
`

const Poster = styled.div<{ $loading?: boolean; $animate?: boolean }>`
  position: relative;
  width: 100%;
  aspect-ratio: 2 / 3;
  border-radius: clamp(12px, 1.2vw, 26px);
  background: ${({ theme }) => theme.colors.surface};
  overflow: hidden;
  transition: transform 0.3s ease;
  animation: ${({ $loading, $animate }) =>
    $loading
      ? css`
          ${pulse} 1.4s ease-in-out infinite
        `
      : $animate
        ? css`
            ${fadeIn} 0.4s ease both
          `
        : 'none'};

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    user-select: none;
  }
`

const cardStyles = css`
  position: relative;
  display: block;
  width: var(--poster);

  &:hover ${Poster}, &:focus-visible ${Poster} {
    transform: translateY(-0.5rem);
  }
`

const Card = styled(Link)`
  ${cardStyles}
`

const SkeletonCard = styled.div`
  ${cardStyles}
`
