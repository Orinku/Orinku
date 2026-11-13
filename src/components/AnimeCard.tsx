import { Link } from 'react-router-dom'
import styled, { css, keyframes } from 'styled-components'
import { animeSlug, statusOf } from '../lib/format'
import type { ListItem } from '../types/api'
import { MetaChips, StatusDot } from './meta'

export function AnimeCard({ item }: { item: ListItem }) {
  return (
    <Card to={`/anime/${animeSlug(item.slug)}`} title={item.title} draggable={false}>
      <Poster>
        <img src={item.poster} alt="" loading="lazy" referrerPolicy="no-referrer" draggable={false} />
      </Poster>
      <Title>
        <StatusDot $status={statusOf(item)} />
        <span>{item.title}</span>
      </Title>
      <MetaChips type={item.type} sub={item.sub} dub={item.dub} rating={item.rating} />
    </Card>
  )
}

/** Placeholder while a page is loading. */
export function AnimeCardSkeleton() {
  return (
    <Skeleton aria-hidden="true">
      <Poster $loading />
      <Bar style={{ width: '82%' }} />
      <Bar style={{ width: '56%', height: '0.9rem' }} />
    </Skeleton>
  )
}

const pulse = keyframes`
  0%, 100% { opacity: 0.55; }
  50% { opacity: 1; }
`

/* Opacity only: a transform here would override the hover lift on the same element. */
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`

const Poster = styled.div<{ $loading?: boolean }>`
  width: 100%;
  aspect-ratio: 2 / 3;
  border-radius: clamp(10px, 1vw, 18px);
  background: ${({ theme }) => theme.colors.surface};
  overflow: hidden;
  transition: box-shadow 0.35s ease;
  ${({ $loading }) =>
    $loading &&
    css`
      animation: ${pulse} 1.4s ease-in-out infinite;
    `}

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    animation: ${fadeIn} 0.4s ease both;
  }
`

const Card = styled(Link)`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 0;
  outline: none;
  transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);

  &:hover,
  &:focus-visible {
    transform: translateY(-0.4rem);
  }

  &:hover ${Poster}, &:focus-visible ${Poster} {
    box-shadow: 0 14px 28px rgba(0, 0, 0, 0.55);
  }

  &:focus-visible ${Poster} {
    outline: 2px solid ${({ theme }) => theme.colors.accent};
    outline-offset: 3px;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;

    &:hover,
    &:focus-visible {
      transform: none;
    }
  }
`

const Title = styled.h3`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.2rem;
  font-size: clamp(0.82rem, 0.76rem + 0.25vw, 1rem);
  font-weight: 600;
  line-height: 1.3;

  span {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`

const Skeleton = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
`

const Bar = styled.div`
  height: 1.05rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.1);
  animation: ${pulse} 1.4s ease-in-out infinite;
`
