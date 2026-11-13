import { Hero } from '../components/Hero'
import { TopThisWeek } from '../components/TopThisWeek'
import { FALLBACK_ANIME } from '../data/fallback'
import { useTrendingAnime } from '../hooks/useTrendingAnime'

export default function Home() {
  const { data, isError } = useTrendingAnime()

  // If AniList can't be reached, show built-in sample data rather than a blank page.
  const anime = isError ? FALLBACK_ANIME : data
  const featured = anime?.find((item) => item.bannerImage) ?? anime?.[0]

  return (
    <>
      <Hero anime={featured} />
      <TopThisWeek items={anime?.slice(0, 10)} />
    </>
  )
}
