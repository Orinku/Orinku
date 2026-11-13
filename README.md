# Orinku

Anime discovery site. Built with Vite, React, TypeScript and styled-components.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build
```

## API setup

The site reads its data from the Orinku API. `.env` is git-ignored, so create it
from the template and set the API's domain (origin only: no trailing slash and no `/api`):

```bash
cp .env.example .env
```

```
VITE_API_BASE_URL=https://your-api-domain.com
```

| Page area                  | Request                                                              |
| -------------------------- | -------------------------------------------------------------------- |
| Hero, genre bar, Trending  | `GET /api` (`spotlights`, `genres`, `trending`)                      |
| Newest tab                 | `GET /api/new-release?page=N`                                        |
| Popular tab                | `GET /api/most-popular?page=N`                                       |
| New Added tab              | `GET /api/newly-added?page=N`                                        |
| Top Anime (Today/Week/Month) | `GET /api/top-ten` (`results.today / week / month`)                |
| Airing Schedule            | `GET /api/schedule` (times are UTC, shown in the visitor's time zone) |

All paths are relative to `VITE_API_BASE_URL`. The page-number query parameter name is the
`PAGE_PARAM` constant in `src/api/index.ts`.

- Restart `npm run dev` after editing `.env`; Vite only reads it at start-up.
- The API must allow cross-origin requests (CORS) from the site's origin.
- `.env.example` is a template to copy.

## Stack

- **Vite + React 19 + TypeScript** (strict mode)
- **styled-components** with a typed theme (`src/styles/theme.ts`)
- **React Router** for pages
- **TanStack Query** for data fetching and caching
- **Embla Carousel** (+ wheel gestures) for the Trending row

## Structure

```
src/
  api/          API client (client.ts) and endpoint functions (index.ts)
  assets/brand/ logos (fox mark + wordmark, black and white)
  components/   Navbar, Hero, GenreBar, Trending, BrowseSection, TopAnime, Schedule, shared bits
  hooks/        useHome, useTopTen, useBrowse, useSchedule, useNow
  lib/          format helpers (slugs, status, UTC to local time)
  pages/        Home, ComingSoon (placeholder for unbuilt pages)
  styles/       theme, global styles, styled-components typings
  types/        API response types
```

## Status

- [x] Home: hero slideshow, genre bar, Trending, Newest / Popular / New Added grid, Top Anime, Airing Schedule
- [ ] Home: Just Finished, Top Movies, Upcoming panels (waiting on their API endpoints)
- [ ] Now Airing
- [ ] Movies
- [ ] Genre
- [ ] Anime details page (`/anime/:slug`, target of "Watch now" and the poster cards)
- [ ] Working search and profile (currently visual placeholders)
