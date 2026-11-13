import { useState } from 'react'
import { Link } from 'react-router-dom'
import styled, { css, keyframes } from 'styled-components'
import type { Anime } from '../types/anime'

interface HeroProps {
  /** `undefined` while the first request is still loading. */
  anime: Anime | undefined
}

const FORMAT_LABELS: Record<string, string> = {
  TV: 'TV Series',
  TV_SHORT: 'TV Short',
  MOVIE: 'The Movie',
  SPECIAL: 'Special',
  OVA: 'OVA',
  ONA: 'ONA',
  MUSIC: 'Music',
}

function subtitleFor(anime: Anime): string {
  const parts = [
    anime.format ? (FORMAT_LABELS[anime.format] ?? anime.format) : null,
    anime.year ? String(anime.year) : null,
  ].filter(Boolean)
  return parts.join('  ·  ')
}

export function Hero({ anime }: HeroProps) {
  return (
    <Section $color={anime?.color ?? null}>
      {anime?.bannerImage && <Banner key={anime.id} src={anime.bannerImage} />}
      <LightFade />
      <BottomFade />

      <Content>
        {anime ? (
          <>
            <Title>{anime.title}</Title>
            {subtitleFor(anime) && <Subtitle>{subtitleFor(anime)}</Subtitle>}
            {anime.description && <Description>{anime.description}</Description>}
            <WatchButton to={`/anime/${anime.id}`}>Watch now</WatchButton>
          </>
        ) : (
          <HeroSkeleton aria-busy="true" aria-label="Loading featured anime" />
        )}
      </Content>
    </Section>
  )
}

/** Banner fades in once the image has actually loaded. */
function Banner({ src }: { src: string }) {
  const [loaded, setLoaded] = useState(false)
  return (
    <BannerImage
      src={src}
      alt=""
      $loaded={loaded}
      onLoad={() => setLoaded(true)}
      fetchPriority="high"
    />
  )
}

const pulse = keyframes`
  0%, 100% { opacity: 0.35; }
  50% { opacity: 0.7; }
`

const Section = styled.section<{ $color: string | null }>`
  position: relative;
  isolation: isolate;
  display: flex;
  align-items: center;
  min-height: clamp(520px, 66vh, 780px);
  padding: clamp(6rem, 9vw, 9rem) ${({ theme }) => theme.gutter} clamp(3rem, 5vw, 6rem);
  background: ${({ $color, theme }) => $color ?? theme.colors.paper};
  overflow: hidden;

  ${({ theme }) => theme.media.md} {
    align-items: flex-end;
    min-height: clamp(520px, 78vh, 700px);
    justify-content: center;
  }
`

const BannerImage = styled.img<{ $loaded: boolean }>`
  position: absolute;
  inset: 0;
  z-index: -3;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: 75% 25%;
  opacity: ${({ $loaded }) => ($loaded ? 1 : 0)};
  transition: opacity 0.7s ease;
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

  ${({ theme }) => theme.media.md} {
    width: min(100%, 560px);
    color: ${({ theme }) => theme.colors.white};
  }
`

const Title = styled.h1`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: clamp(2.2rem, 4.7vw, 5.4rem);
  font-weight: 600;
  line-height: 1.05;
  letter-spacing: 0.08em;
  text-wrap: balance;
  text-shadow: 0 2px 14px rgba(0, 0, 0, 0.18);

  ${({ theme }) => theme.media.md} {
    font-size: clamp(2rem, 8vw, 3.2rem);
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
