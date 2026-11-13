import { Hero } from '../components/Hero'
import { TopThisWeek } from '../components/TopThisWeek'
import { useHome } from '../hooks/useHome'
import { useTopTen } from '../hooks/useTopTen'

export default function Home() {
  const home = useHome()
  const topTen = useTopTen()

  // Skip any spotlight that has no backdrop image.
  const slides = home.data?.spotlights.filter((spotlight) => spotlight.poster)

  return (
    <>
      <Hero slides={slides} isError={home.isError} onRetry={() => void home.refetch()} />
      <TopThisWeek
        data={topTen.data}
        isError={topTen.isError}
        onRetry={() => void topTen.refetch()}
      />
    </>
  )
}
