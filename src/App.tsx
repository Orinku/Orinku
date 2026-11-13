import { Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import ComingSoon from './pages/ComingSoon'
import Home from './pages/Home'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="airing" element={<ComingSoon title="Now Airing" />} />
        <Route path="movies" element={<ComingSoon title="Movies" />} />
        <Route path="genre" element={<ComingSoon title="Genre" />} />
        <Route
          path="anime/:id"
          element={<ComingSoon title="Details" message="The details page is coming soon." />}
        />
        <Route
          path="*"
          element={<ComingSoon title="Page not found" message="That page doesn't exist." />}
        />
      </Route>
    </Routes>
  )
}
