import { useCallback, useEffect, useRef, useState } from 'react'
import type { TouchEvent } from 'react'
import { Link } from 'react-router-dom'
import styled, { css, keyframes } from 'styled-components'
import type { Spotlight } from '../types/api'
import { ErrorState } from './ErrorState'

const AUTOPLAY_MS = 5000
const SWIPE_PX = 50

interface HeroProps {
  /** `undefined` while the first request is still loading. */
  slides: Spotlight[] | undefined
  isError: boolean
  onRetry: () => void
}

function subtitleFor(slide: Spotlight): string {
  return [slide.type, slide.rating ? `★ ${slide.rating}` : ''].filter(Boolean).join('  ·  ')
}

export function Hero({ slides, isError, onRetry }: HeroProps) {
  const count = slides?.length ?? 0
  // `prev` stays mounted briefly so the outgoing image can fade out.
  const [{ index, prev }, setPosition] = useState({ index: 0, prev: -1 })
  const [paused, setPaused] = useState(false)
  const touchStartX = useRef<number | null>(null)

  const goTo = useCallback(
    (target: number) => {
      if (count === 0) return
      const next = (target + count) % count
      setPosition((current) =>
        next === current.index ? current : { index: next, prev: current.index },
      )
    },
    [count],
  )

  // Autoplay. Re-created whenever the slide changes, so a manual click restarts the timer.
  useEffect(() => {
    if (count < 2 || paused) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = window.setInterval(() => {
      if (!document.hidden) goTo(index + 1)
    }, AUTOPLAY_MS)
    return () => window.clearInterval(id)
  }, [count, paused, index, goTo])

  const onTouchStart = (event: TouchEvent) => {
    touchStartX.current = event.touches[0]?.clientX ?? null
  }

  const onTouchEnd = (event: TouchEvent) => {
    const start = touchStartX.current
    const end = event.changedTouches[0]?.clientX
    touchStartX.current = null
    if (start === null || end === undefined) return
    const delta = end - start
    if (Math.abs(delta) >= SWIPE_PX) goTo(index + (delta < 0 ? 1 : -1))
  }

  const slide = slides?.[index]
  const nextIndex = count > 0 ? (index + 1) % count : -1
  const mounted = new Set([prev, index, nextIndex])

  return (
    <Section
      aria-roledescription="carousel"
      aria-label="Featured anime"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {slides?.map((item, i) =>
        mounted.has(i) ? <Banner key={item.slug} src={item.poster} active={i === index} /> : null,
      )}
      <LightFade />
      <BottomFade />

      {isError && !slide ? (
        <Content>
          <ErrorState message="Couldn't load featured anime." onRetry={onRetry} />
        </Content>
      ) : slide ? (
        <Content key={slide.slug} aria-live={paused ? 'polite' : 'off'}>
          <Title $long={slide.title.length > 28}>{slide.title}</Title>
          {subtitleFor(slide) && <Subtitle>{subtitleFor(slide)}</Subtitle>}
          {slide.description && <Description>{slide.description}</Description>}
          <WatchButton to={`/anime/${slide.slug}`}>Watch now</WatchButton>
        </Content>
      ) : (
        <Content>
          <HeroSkeleton aria-busy="true" aria-label="Loading featured anime" />
        </Content>
      )}

      {count > 1 && (
        <Controls>
          <ArrowButton type="button" aria-label="Previous slide" onClick={() => goTo(index - 1)}>
            <Chevron direction="left" />
          </ArrowButton>

          <Dots>
            {(slides ?? []).map((item, i) => (
              <Dot
                key={item.slug}
                type="button"
                aria-label={`Show slide ${i + 1}: ${item.title}`}
                aria-current={i === index}
                $active={i === index}
                onClick={() => goTo(i)}
              />
            ))}
          </Dots>

          <ArrowButton type="button" aria-label="Next slide" onClick={() => goTo(index + 1)}>
            <Chevron direction="right" />
          </ArrowButton>
        </Controls>
      )}
    </Section>
  )
}

/** Fades in once its image has loaded, and crossfades when `active` changes. */
function Banner({ src, active }: { src: string; active: boolean }) {
  const [loaded, setLoaded] = useState(false)
  return (
    <BannerImage
      src={src}
      alt=""
      referrerPolicy="no-referrer"
      $visible={active && loaded}
      onLoad={() => setLoaded(true)}
      // The first banner is the page's largest image; don't lazy-load or deprioritise it.
      fetchPriority={active ? 'high' : 'low'}
    />
  )
}

function Chevron({ direction }: { direction: 'left' | 'right' }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{ transform: direction === 'left' ? 'none' : 'scaleX(-1)' }}
    >
      <path d="M15 5l-7 7 7 7" />
    </svg>
  )
}

const pulse = keyframes`
  0%, 100% { opacity: 0.35; }
  50% { opacity: 0.7; }
`

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(14px); }
  to { opacity: 1; transform: translateY(0); }
`

const Section = styled.section`
  position: relative;
  isolation: isolate;
  display: flex;
  align-items: center;
  min-height: clamp(520px, 66vh, 780px);
  padding: clamp(6rem, 9vw, 9rem) ${({ theme }) => theme.gutter} clamp(3rem, 5vw, 6rem);
  background: ${({ theme }) => theme.colors.paper};
  overflow: hidden;

  ${({ theme }) => theme.media.md} {
    align-items: flex-end;
    justify-content: center;
    min-height: clamp(520px, 78vh, 700px);
    padding-bottom: 4.5rem;
  }
`

const BannerImage = styled.img<{ $visible: boolean }>`
  position: absolute;
  inset: 0;
  z-index: -3;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: 75% 25%;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transition: opacity 0.9s ease;
`

/* Light wash on the left so the dark title and nav stay readable. */
const LightFade = styled.div`
  position: absolute;
  inset: 0;
  z-index: -2;
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.colors.paper} 0%,
    ${({ theme }) => theme.colors.paper} 32%,
    rgba(236, 236, 236, 0.55) 46%,
    rgba(236, 236, 236, 0) 64%
  );

  ${({ theme }) => theme.media.md} {
    display: none;
  }
`

/* Fades the hero into the black "Top this week" section. */
const BottomFade = styled.div`
  position: absolute;
  inset: 0;
  z-index: -1;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0) 42%, #000 98%);

  ${({ theme }) => theme.media.md} {
    background: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0.35) 0%,
      rgba(0, 0, 0, 0.35) 30%,
      #000 96%
    );
  }
`

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: min(40vw, 800px);
  text-align: center;
  color: #3b3b3b;
  animation: ${fadeUp} 0.7s ease both;

  ${({ theme }) => theme.media.md} {
    width: min(100%, 560px);
    color: ${({ theme }) => theme.colors.white};
  }
`

const Title = styled.h1<{ $long: boolean }>`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: ${({ $long }) =>
    $long ? 'clamp(1.7rem, 3.2vw, 3.7rem)' : 'clamp(2.2rem, 4.7vw, 5.4rem)'};
  font-weight: 600;
  line-height: 1.1;
  letter-spacing: ${({ $long }) => ($long ? '0.05em' : '0.08em')};
  text-wrap: balance;
  text-shadow: 0 2px 14px rgba(0, 0, 0, 0.18);
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 4;
  line-clamp: 4;
  overflow: hidden;
  padding-bottom: 0.08em;

  ${({ theme }) => theme.media.md} {
    font-size: ${({ $long }) => ($long ? 'clamp(1.5rem, 6vw, 2.4rem)' : 'clamp(2rem, 8vw, 3.2rem)')};
    text-shadow: 0 2px 18px rgba(0, 0, 0, 0.55);
  }
`

const Subtitle = styled.p`
  margin-top: 0.6em;
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: clamp(0.95rem, 1.7vw, 1.9rem);
  font-weight: 700;
  letter-spacing: 0.32em;
  text-transform: uppercase;
`

const Description = styled.p`
  margin-top: clamp(1.1rem, 2vw, 2.2rem);
  max-width: 34rem;
  font-size: clamp(0.85rem, 0.7vw + 0.45rem, 1.1rem);
  font-weight: 300;
  line-height: 1.55;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  overflow: hidden;
`

const WatchButton = styled(Link)`
  margin-top: clamp(1.1rem, 1.8vw, 2rem);
  padding: 0.95em 2.7em;
  border-radius: 999px;
  background: #0a0a0a;
  color: ${({ theme }) => theme.colors.white};
  font-size: clamp(0.9rem, 1vw, 1.15rem);
  font-weight: 500;
  transition: transform 0.2s ease, background 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    background: #1c1c1c;
  }

  ${({ theme }) => theme.media.md} {
    background: ${({ theme }) => theme.colors.white};
    color: ${({ theme }) => theme.colors.black};

    &:hover {
      background: #e6e6e6;
    }
  }
`

const Controls = styled.div`
  position: absolute;
  z-index: 2;
  right: ${({ theme }) => theme.gutter};
  bottom: clamp(1.5rem, 3vw, 4rem);
  display: flex;
  align-items: center;
  gap: clamp(0.6rem, 1vw, 1.1rem);

  ${({ theme }) => theme.media.md} {
    right: 0;
    left: 0;
    bottom: 1.5rem;
    justify-content: center;
  }
`

const ArrowButton = styled.button`
  display: grid;
  place-items: center;
  width: clamp(2.3rem, 2.7vw, 3.1rem);
  aspect-ratio: 1;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.glass};
  backdrop-filter: blur(10px);
  color: ${({ theme }) => theme.colors.white};
  cursor: pointer;
  transition: background 0.2s ease, transform 0.2s ease;

  &:hover {
    background: rgba(20, 20, 20, 0.92);
    transform: scale(1.06);
  }

  /* On touch screens people swipe; the dots are enough. */
  ${({ theme }) => theme.media.md} {
    display: none;
  }
`

const Dots = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

const Dot = styled.button<{ $active: boolean }>`
  width: ${({ $active }) => ($active ? '1.9rem' : '0.5rem')};
  height: 0.5rem;
  padding: 0;
  border: 0;
  border-radius: 999px;
  background: ${({ $active, theme }) => ($active ? theme.colors.white : 'rgba(255, 255, 255, 0.45)')};
  cursor: pointer;
  transition: width 0.35s ease, background 0.35s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.white};
  }
`

const skeletonBar = css`
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.2);
  animation: ${pulse} 1.4s ease-in-out infinite;
`

const HeroSkeleton = styled.div`
  width: 100%;
  height: 12rem;
  display: grid;
  align-content: center;
  justify-items: center;
  gap: 1rem;

  &::before {
    content: '';
    width: 80%;
    height: 3.2rem;
    ${skeletonBar}
  }

  &::after {
    content: '';
    width: 55%;
    height: 1.1rem;
    ${skeletonBar}
  }
`
