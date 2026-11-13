import useEmblaCarousel from 'embla-carousel-react'
import { WheelGesturesPlugin } from 'embla-carousel-wheel-gestures'
import { Link } from 'react-router-dom'
import styled, { css, keyframes } from 'styled-components'
import type { TrendingItem } from '../types/api'
import { animeSlug } from '../lib/format'
import { ErrorState } from './ErrorState'

interface TrendingProps {
  /** `undefined` while loading. */
  items: TrendingItem[] | undefined
  isError: boolean
  onRetry: () => void
}

const SKELETON_COUNT = 6

export function Trending({ items, isError, onRetry }: TrendingProps) {
  // The wheel plugin lets a trackpad two-finger swipe (or a tilt-wheel mouse)
  // scroll the row sideways. Vertical wheel movement still scrolls the page.
  const [emblaRef] = useEmblaCarousel({ align: 'start', dragFree: true }, [WheelGesturesPlugin()])

  return (
    <Section aria-labelledby="trending-heading">
      <HeadingRow>
        <Heading id="trending-heading">Trending</Heading>
      </HeadingRow>

      {isError && !items ? (
        <ErrorWrap>
          <ErrorState message="Couldn't load what's trending." onRetry={onRetry} />
        </ErrorWrap>
      ) : (
        <Viewport ref={emblaRef}>
          <Track>
            {items
              ? items.map((item, index) => (
                  <Slide key={item.slug}>
                    <Card
                      to={`/anime/${animeSlug(item.slug)}`}
                      title={item.title}
                      aria-label={`Number ${index + 1}: ${item.title}`}
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
                      <Rank aria-hidden="true">{index + 1}</Rank>
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

/* Opacity only: a transform in here (with fill-mode "both") would stay applied
   and override any hover transform on the same element. */
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
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

const ErrorWrap = styled.div`
  margin: 0 ${({ theme }) => theme.gutter};
`

const Viewport = styled.div`
  overflow: hidden;
  /* room for the hover lift so it isn't clipped */
  padding-top: 1.25rem;
  margin-top: -0.5rem;
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
  transition: box-shadow 0.35s ease;
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
`

/* The whole card (poster + rank number) nudges up on hover / keyboard focus. */
const Card = styled(Link)`
  ${cardStyles}
  transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
  outline: none;

  &:hover,
  &:focus-visible {
    transform: translateY(-0.75rem);
  }

  &:hover ${Poster}, &:focus-visible ${Poster} {
    box-shadow: 0 14px 28px rgba(0, 0, 0, 0.55);
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;

    &:hover,
    &:focus-visible {
      transform: none;
    }
  }
`

const SkeletonCard = styled.div`
  ${cardStyles}
`
