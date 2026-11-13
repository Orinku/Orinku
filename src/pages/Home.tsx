import styled from 'styled-components'
import { BrowseSection } from '../components/BrowseSection'
import { GenreBar } from '../components/GenreBar'
import { Hero } from '../components/Hero'
import { Schedule } from '../components/Schedule'
import { TopAnime } from '../components/TopAnime'
import { Trending } from '../components/Trending'
import { useHome } from '../hooks/useHome'
import { useSchedule } from '../hooks/useSchedule'
import { useTopTen } from '../hooks/useTopTen'

export default function Home() {
  const home = useHome()
  const topTen = useTopTen()
  const schedule = useSchedule()

  // Skip any spotlight that has no backdrop image.
  const slides = home.data?.spotlights.filter((spotlight) => spotlight.poster)

  return (
    <>
      <Hero slides={slides} isError={home.isError} onRetry={() => void home.refetch()} />
      <GenreBar genres={home.data?.genres} isError={home.isError} />
      <Trending
        items={home.data?.trending}
        isError={home.isError}
        onRetry={() => void home.refetch()}
      />

      <Content>
        <BrowseSection />
        <Sidebar>
          <TopAnime
            data={topTen.data}
            isError={topTen.isError}
            onRetry={() => void topTen.refetch()}
          />
          <Schedule
            items={schedule.data}
            isError={schedule.isError}
            onRetry={() => void schedule.refetch()}
          />
        </Sidebar>
      </Content>
    </>
  )
}

const Content = styled.div`
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: minmax(0, 1fr) clamp(300px, 26vw, 440px);
  gap: clamp(1.5rem, 2.4vw, 3rem);
  align-items: start;
  padding: 0 ${({ theme }) => theme.gutter} clamp(4rem, 8vw, 9rem);
  background: ${({ theme }) => theme.colors.black};

  ${({ theme }) => theme.media.md} {
    grid-template-columns: minmax(0, 1fr);
  }
`

const Sidebar = styled.aside`
  display: flex;
  flex-direction: column;
  gap: clamp(1.25rem, 2vw, 2rem);
  min-width: 0;
`
