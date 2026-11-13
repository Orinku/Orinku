import useEmblaCarousel from 'embla-carousel-react'
import { WheelGesturesPlugin } from 'embla-carousel-wheel-gestures'
import { Link } from 'react-router-dom'
import styled, { keyframes } from 'styled-components'
import { ALLOWED_GENRES, genreSlug } from '../data/genres'

interface GenreBarProps {
  /** Every genre the API sent; `undefined` while loading. Filtered down to the allowed list here. */
  genres: string[] | undefined
  isError: boolean
}

const SKELETON_WIDTHS = [88, 112, 96, 124, 84, 108, 100, 92]

export function GenreBar({ genres, isError }: GenreBarProps) {
  // Same drag / trackpad-swipe behaviour as the Trending row.
  const [emblaRef] = useEmblaCarousel({ align: 'start', dragFree: true }, [WheelGesturesPlugin()])

  // The hero already shows the error state for the shared request.
  if (isError && !genres) return null

  const visible = genres?.filter((genre) => ALLOWED_GENRES.has(genre))

  return (
    <Section aria-label="Genres">
      <Viewport ref={emblaRef}>
        <Track>
          {visible
            ? visible.map((genre) => (
                <Slide key={genre}>
                  <Chip to={`/genre/${genreSlug(genre)}`} draggable={false}>
                    {genre}
                  </Chip>
                </Slide>
              ))
            : SKELETON_WIDTHS.map((width, index) => (
                <Slide key={index}>
                  <SkeletonChip aria-hidden="true" style={{ width }} />
                </Slide>
              ))}
        </Track>
      </Viewport>
    </Section>
  )
}

const pulse = keyframes`
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
`

const Section = styled.nav`
  position: relative;
  z-index: 1;
  padding: clamp(1.25rem, 2.4vw, 2.5rem) 0 clamp(1.5rem, 3vw, 3rem);
  background: ${({ theme }) => theme.colors.black};
`

const Viewport = styled.div`
  overflow: hidden;
  /* room for the hover lift so it isn't clipped */
  padding: 0.4rem 0;
  cursor: grab;
  overscroll-behavior-x: contain;

  &:active {
    cursor: grabbing;
  }
`

const Track = styled.div`
  display: flex;
  padding: 0 ${({ theme }) => theme.gutter};
  touch-action: pan-y pinch-zoom;
`

const Slide = styled.div`
  flex: 0 0 auto;
  min-width: 0;
  margin-right: clamp(0.5rem, 0.8vw, 0.9rem);
`

const chipBase = `
  display: block;
  padding: 0.55em 1.35em;
  border-radius: 999px;
  font-size: clamp(0.85rem, 1vw, 1.1rem);
  font-weight: 400;
  line-height: 1.2;
  white-space: nowrap;
`

const Chip = styled(Link)`
  ${chipBase}
  background: rgba(255, 255, 255, 0.12);
  color: ${({ theme }) => theme.colors.white};
  user-select: none;
  transition:
    background 0.25s ease,
    color 0.25s ease,
    transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);

  &:hover,
  &:focus-visible {
    background: ${({ theme }) => theme.colors.white};
    color: ${({ theme }) => theme.colors.black};
    transform: translateY(-0.2rem);
  }

  @media (prefers-reduced-motion: reduce) {
    &:hover,
    &:focus-visible {
      transform: none;
    }
  }
`

const SkeletonChip = styled.div`
  ${chipBase}
  height: clamp(2rem, 2.4vw, 2.7rem);
  padding: 0;
  background: rgba(255, 255, 255, 0.12);
  animation: ${pulse} 1.4s ease-in-out infinite;
`
