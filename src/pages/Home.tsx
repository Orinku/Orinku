import { Hero } from '../components/Hero'
import { Trending } from '../components/Trending'
import { useHome } from '../hooks/useHome'

export default function Home() {
  const home = useHome()

  // Skip any spotlight that has no backdrop image.
  const slides = home.data?.spotlights.filter((spotlight) => spotlight.poster)

  return (
    <>
      <Hero slides={slides} isError={home.isError} onRetry={() => void home.refetch()} />
      <Trending
        items={home.data?.trending}
        isError={home.isError}
        onRetry={() => void home.refetch()}
      />
    </>
  )
}
