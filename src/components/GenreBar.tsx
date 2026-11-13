import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import styled, { keyframes } from 'styled-components'
import { ALLOWED_GENRES, genreSlug } from '../data/genres'

interface GenreBarProps {
  /** Every genre the API sent; `undefined` while loading. Filtered down to the allowed list here. */
  genres: string[] | undefined
  isError: boolean
}

const SKELETON_WIDTHS = [88, 112, 96, 124, 84, 108, 100, 92]

function Chevron({ direction }: { direction: 'left' | 'right' }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={direction === 'left' ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7'} />
    </svg>
  )
}

export function GenreBar({ genres, isError }: GenreBarProps) {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(false)
  // Where the row was last centred automatically (null until the chips have loaded).
  const centeredAt = useRef<number | null>(null)

  const visible = genres?.filter((genre) => ALLOWED_GENRES.has(genre))
  const count = visible?.length ?? 0

  // Show a fade + button on a side only while there is more to scroll that way.
  const update = useCallback(() => {
    const el = scrollerRef.current
    if (!el) return
    setCanPrev(el.scrollLeft > 1)
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 1)
  }, [])

  // Start in the middle of the row, so there's something to scroll to on both sides.
  useLayoutEffect(() => {
    const el = scrollerRef.current
    if (!el || count === 0 || centeredAt.current !== null) return

    const center = () => {
      el.scrollLeft = (el.scrollWidth - el.clientWidth) / 2
      centeredAt.current = el.scrollLeft
      update()
    }
    center()

    // The web font can change the chips' widths after first paint; re-centre once it's in,
    // unless the visitor has already started scrolling.
    void document.fonts?.ready.then(() => {
      if (centeredAt.current !== null && Math.abs(el.scrollLeft - centeredAt.current) < 2) center()
    })
  }, [count, update])

  useEffect(() => {
    const el = scrollerRef.current
    if (!el) return
    update()
    el.addEventListener('scroll', update, { passive: true })
    // Re-check when the window resizes or the chips change width (e.g. the web font loads).
    const observer = new ResizeObserver(update)
    observer.observe(el)
    if (el.firstElementChild) observer.observe(el.firstElementChild)
    return () => {
      el.removeEventListener('scroll', update)
      observer.disconnect()
    }
  }, [update, count])

  const scrollByPage = (direction: -1 | 1) => {
    const el = scrollerRef.current
    if (!el) return
    el.scrollBy({ left: direction * el.clientWidth * 0.8, behavior: 'smooth' })
  }

  // The hero already shows the error state for the shared request.
  if (isError && !genres) return null

  return (
    <Section aria-label="Genres">
      <Frame>
        <Scroller ref={scrollerRef}>
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
        </Scroller>

        <Fade $side="left" $visible={canPrev} aria-hidden="true" />
        <Fade $side="right" $visible={canNext} aria-hidden="true" />

        <NavButton
          type="button"
          $side="left"
          $visible={canPrev}
          aria-label="Scroll genres left"
          tabIndex={canPrev ? 0 : -1}
          onClick={() => scrollByPage(-1)}
        >
          <Chevron direction="left" />
        </NavButton>
        <NavButton
          type="button"
          $side="right"
          $visible={canNext}
          aria-label="Scroll genres right"
          tabIndex={canNext ? 0 : -1}
          onClick={() => scrollByPage(1)}
        >
          <Chevron direction="right" />
        </NavButton>
      </Frame>
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

const Frame = styled.div`
  position: relative;
`

/* Plain native scrolling (wheel, trackpad, touch, keyboard, the buttons), no mouse dragging. */
const Scroller = styled.div`
  overflow-x: auto;
  /* room for the chips' hover lift so it isn't clipped */
  padding: 0.4rem 0;
  overscroll-behavior-x: contain;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`

const Track = styled.div`
  display: flex;
  width: max-content;
  min-width: 100%;
  padding: 0 ${({ theme }) => theme.gutter};
`

const FADE_WIDTH = 'clamp(3rem, 8vw, 8rem)'

/* Soft edge that melts the chips into the page's black. */
const Fade = styled.div<{ $side: 'left' | 'right'; $visible: boolean }>`
  position: absolute;
  top: 0;
  bottom: 0;
  ${({ $side }) => $side}: 0;
  z-index: 1;
  width: ${FADE_WIDTH};
  background: linear-gradient(
    ${({ $side }) => ($side === 'left' ? 'to right' : 'to left')},
    ${({ theme }) => theme.colors.black} 15%,
    rgba(0, 0, 0, 0)
  );
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transition: opacity 0.25s ease;
  pointer-events: none;
`

const NavButton = styled.button<{ $side: 'left' | 'right'; $visible: boolean }>`
  position: absolute;
  top: 50%;
  ${({ $side }) => $side}: clamp(0.5rem, 1.6vw, 1.75rem);
  z-index: 2;
  display: grid;
  place-items: center;
  width: clamp(2.1rem, 2.4vw, 2.8rem);
  aspect-ratio: 1;
  padding: 0;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 50%;
  background: rgba(18, 18, 18, 0.72);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  color: ${({ theme }) => theme.colors.white};
  cursor: pointer;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  pointer-events: ${({ $visible }) => ($visible ? 'auto' : 'none')};
  transform: translateY(-50%);
  transition:
    opacity 0.25s ease,
    background 0.2s ease,
    color 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.white};
    color: ${({ theme }) => theme.colors.black};
  }

  /* touch screens just swipe */
  ${({ theme }) => theme.media.md} {
    display: none;
  }
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
