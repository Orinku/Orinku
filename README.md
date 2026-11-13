# Orinku

Anime discovery site. Built with Vite, React, TypeScript and styled-components.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build
```

## Stack

- **Vite + React 19 + TypeScript** (strict mode)
- **styled-components** with a typed theme (`src/styles/theme.ts`)
- **React Router** for pages
- **TanStack Query** for data fetching and caching
- **Embla Carousel** for the "Top this week" row
- **AniList GraphQL API** for data (free, no key needed)

## Structure

```
src/
  api/          AniList client
  assets/brand/ logos (fox mark + wordmark, black and white)
  components/   Navbar, Hero, TopThisWeek, Layout
  data/         fallback data used if AniList is unreachable
  hooks/        useTrendingAnime
  pages/        Home, ComingSoon (placeholder for unbuilt pages)
  styles/       theme, global styles, styled-components typings
  types/        shared types
```

## Status

- [x] Home page
- [ ] Now Airing
- [ ] Movies
- [ ] Genre
- [ ] Anime details page (`/anime/:id`, target of "Watch now")
- [ ] Working search and profile (currently visual placeholders)
