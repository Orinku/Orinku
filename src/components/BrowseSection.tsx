import { useRef, useState } from 'react'
import styled from 'styled-components'
import { useBrowse } from '../hooks/useBrowse'
import type { BrowseKind } from '../types/api'
import { AnimeCard, AnimeCardSkeleton } from './AnimeCard'
import { ErrorState } from './ErrorState'
import { ChevronIcon } from './icons'
import { Segmented } from './Segmented'

const TABS = [
  { id: 'new-release', label: 'Newest' },
  { id: 'most-popular', label: 'Popular' },
  { id: 'newly-added', label: 'New Added' },
] as const satisfies readonly { id: BrowseKind; label: string }[]

const SKELETON_COUNT = 12

/** Newest / Popular / New Added: a tabbed, paged grid of posters. */
export function BrowseSection() {
  const [kind, setKind] = useState<BrowseKind>('new-release')
  const [page, setPage] = useState(1)
  const sectionRef = useRef<HTMLElement>(null)

  const { data, isError, isPlaceholderData, refetch } = useBrowse(kind, page)
  const pagination = data?.pagination

  const changeKind = (next: BrowseKind) => {
    setKind(next)
    setPage(1)
  }

  const goToPage = (next: number) => {
    setPage(next)
    // If the grid's top has scrolled out of view, bring it back so the new page starts at the top.
    const top = sectionRef.current?.getBoundingClientRect().top ?? 0
    if (top < 0) sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <Section ref={sectionRef} aria-label="Browse anime">
      <Toolbar>
        <Segmented label="Sort anime by" options={TABS} value={kind} onChange={changeKind} />

        <Pager aria-label="Pagination">
          <PagerButton
            type="button"
            aria-label="Previous page"
            disabled={!pagination?.hasPrev}
            onClick={() => goToPage(page - 1)}
          >
            <ChevronIcon direction="left" />
          </PagerButton>
          <PageNumber
            aria-live="polite"
            title={pagination ? `Page ${page} of ${pagination.totalPages}` : undefined}
          >
            {page}
          </PageNumber>
          <PagerButton
            type="button"
            aria-label="Next page"
            disabled={!pagination?.hasNext}
            onClick={() => goToPage(page + 1)}
          >
            <ChevronIcon direction="right" />
          </PagerButton>
        </Pager>
      </Toolbar>

      {isError && !data ? (
        <ErrorState message="Couldn't load this list." onRetry={() => void refetch()} />
      ) : (
        <Grid $busy={isPlaceholderData} aria-busy={isPlaceholderData}>
          {data
            ? data.data.map((item) => <AnimeCard key={item.slug} item={item} />)
            : Array.from({ length: SKELETON_COUNT }, (_, index) => <AnimeCardSkeleton key={index} />)}
        </Grid>
      )}
    </Section>
  )
}

const Section = styled.section`
  min-width: 0;
  /* the fixed navbar shouldn't cover the toolbar after a page change */
  scroll-margin-top: 5.5rem;
`

const Toolbar = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem 1rem;
  margin-bottom: clamp(1rem, 1.8vw, 1.75rem);
`

const Pager = styled.nav`
  display: inline-flex;
  align-items: center;
  padding: 4px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.1);
`

const PagerButton = styled.button`
  display: grid;
  place-items: center;
  width: 2rem;
  height: 2rem;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: transparent;
  color: ${({ theme }) => theme.colors.white};
  font-size: 1rem;
  cursor: pointer;
  transition:
    background 0.2s ease,
    color 0.2s ease,
    opacity 0.2s ease;

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.white};
    color: ${({ theme }) => theme.colors.black};
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`

const PageNumber = styled.span`
  min-width: 2.4rem;
  text-align: center;
  font-size: 0.9rem;
  font-weight: 500;
  font-variant-numeric: tabular-nums;
`

const Grid = styled.div<{ $busy: boolean }>`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(clamp(138px, 12.5vw, 220px), 1fr));
  gap: clamp(1.2rem, 2vw, 2.2rem) clamp(0.8rem, 1.3vw, 1.5rem);
  opacity: ${({ $busy }) => ($busy ? 0.55 : 1)};
  transition: opacity 0.2s ease;
`
