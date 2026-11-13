import { Link } from 'react-router-dom'
import useEmblaCarousel from 'embla-carousel-react'
import { WheelGesturesPlugin } from 'embla-carousel-wheel-gestures'
import styled, { css, keyframes } from 'styled-components'
import type { Anime } from '../types/anime'

interface TopThisWeekProps {
  /** `undefined` while loading. */
  items: Anime[] | undefined
}

const SKELETON_COUNT = 6

export function TopThisWeek({ items }: TopThisWeekProps) {
  // The wheel plugin lets a trackpad two-finger swipe (or a tilt-wheel mouse)
  // scroll the row sideways. Vertical wheel movement still scrolls the page.
  const [emblaRef] = useEmblaCarousel({ align: 'start', dragFree: true }, [
    WheelGesturesPlugin(),
  ])

  return (
    <Section aria-labelledby="top-this-week">
      <Heading id="top-this-week">Top this week</Heading>

      <Viewport ref={emblaRef}>
        <Track>
          {items
            ? items.map((anime, index) => (
                <Slide key={anime.id}>
                  <Card
                    to={`/anime/${anime.id}`}
                    title={anime.title}
                    aria-label={`Number ${index + 1}: ${anime.title}`}
                    draggable={false}
                  >
                    <Poster $color={anime.color}>
                      {anime.cover && (
                        <img src={anime.cover} alt="" loading="lazy" draggable={false} />
                      )}
                    </Poster>
                    <Rank aria-hidden="true">{index + 1}</Rank>
                  </Card>
                </Slide>
              ))
            : Array.from({ length: SKELETON_COUNT }, (_, index) => (
                <Slide key={index}>
                  <SkeletonCard aria-hidden="true">
                    <Poster $color={null} $loading />
                    <Rank aria-hidden="true">{index + 1}</Rank>
                  </SkeletonCard>
                </Slide>
              ))}
        </Track>
      </Viewport>
    </Section>
  )
}

const pulse = keyframes`
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
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

const Heading = styled.h2`
  display: flex;
  align-items: center;
  gap: 0.35em;
  margin: 0 0 clamp(1.2rem, 2.2vw, 2.4rem) ${({ theme }) => theme.gutter};
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

const Poster = styled.div<{ $color: string | null; $loading?: boolean }>`
  position: relative;
  width: 100%;
  aspect-ratio: 2 / 3;
  border-radius: clamp(12px, 1.2vw, 26px);
  background: ${({ $color, theme }) => $color ?? theme.colors.surface};
  overflow: hidden;
  transition: transform 0.3s ease;
  animation: ${({ $loading }) => ($loading ? pulse : 'none')} 1.4s ease-in-out infinite;

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
