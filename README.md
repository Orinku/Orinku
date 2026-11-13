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

| Page area         | Request                                                   |
| ----------------- | --------------------------------------------------------- |
| Hero slideshow    | `GET {VITE_API_BASE_URL}/api` (`results.spotlights`)      |
| Genre bar         | `GET {VITE_API_BASE_URL}/api` (`results.genres`, filtered by `src/data/genres.ts`) |
| Trending row      | `GET {VITE_API_BASE_URL}/api` (`results.trending`)        |

- Restart `npm run dev` after editing `.env`; Vite only reads it at start-up.
- The API must allow cross-origin requests (CORS) from the site's origin.
- `.env.example` is a template to copy.

## Stack

- **Vite + React 19 + TypeScript** (strict mode)
- **styled-components** with a typed theme (`src/styles/theme.ts`)
- **React Router** for pages
- **TanStack Query** for data fetching and caching
- **Embla Carousel** (+ wheel gestures) for the "Top this week" row

## Structure

```
src/
  api/          API client (client.ts) and endpoint functions (index.ts)
  assets/brand/ logos (fox mark + wordmark, black and white)
  components/   Navbar, Hero (slideshow), GenreBar, Trending, ErrorState, Layout
  hooks/        useHome
  pages/        Home, ComingSoon (placeholder for unbuilt pages)
  styles/       theme, global styles, styled-components typings
  types/        API response types
```

## Status

- [x] Home page (hero slideshow + top ten with Today / Week / Month)
- [ ] Now Airing
- [ ] Movies
- [ ] Genre
- [ ] Anime details page (`/anime/:slug`, target of "Watch now" and the poster cards)
- [ ] Working search and profile (currently visual placeholders)
