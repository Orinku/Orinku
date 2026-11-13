import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import styled, { css, keyframes } from 'styled-components'
import wordmarkBlack from '../assets/brand/wordmark-black.png'
import wordmarkWhite from '../assets/brand/wordmark-white.png'
import foxBlack from '../assets/brand/fox-black.png'

const LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/airing', label: 'Now Airing', end: false },
  { to: '/movies', label: 'Movies', end: false },
  { to: '/genre', label: 'Genre', end: false },
] as const

/** How far the page must scroll before the bar turns into floating capsules. */
const SCROLL_THRESHOLD = 40

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <circle cx="11" cy="11" r="6.5" />
      <path d="M16 16l4.5 4.5" />
    </svg>
  )
}

export function Navbar() {
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(() => window.scrollY > SCROLL_THRESHOLD)
  const [searchOpen, setSearchOpen] = useState(false)
  const searchRef = useRef<HTMLInputElement>(null)

  // Only the home page has the light hero; every other page is plain black.
  const onDark = pathname !== '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // When the search pill opens from its icon, put the cursor straight in it.
  useEffect(() => {
    if (searchOpen) searchRef.current?.focus()
  }, [searchOpen])

  // While floating, the search is just an icon until it's clicked.
  const showSearchInput = !scrolled || searchOpen

  return (
    <Bar $dark={onDark} $scrolled={scrolled}>
      <LeftPill $scrolled={scrolled}>
        <Brand to="/" aria-label="Orinku home">
          <LogoDark $dark={onDark || scrolled} src={wordmarkBlack} alt="Orinku" />
          <LogoLight $dark={onDark || scrolled} src={wordmarkWhite} alt="" aria-hidden="true" />
        </Brand>

        <Links id="primary-nav" $open={open} $scrolled={scrolled} aria-label="Primary">
          {LINKS.map((link) => (
            <StyledNavLink key={link.to} to={link.to} end={link.end} onClick={() => setOpen(false)}>
              {link.label}
            </StyledNavLink>
          ))}
        </Links>
      </LeftPill>

      <Actions $scrolled={scrolled}>
        {/* Placeholders for now — search and profile come in a later pass. */}
        {showSearchInput ? (
          <SearchField>
            <SearchGlyph>
              <SearchIcon />
            </SearchGlyph>
            <Search
              ref={searchRef}
              type="search"
              placeholder="Search"
              aria-label="Search anime"
              onBlur={() => setSearchOpen(false)}
              onKeyDown={(event) => {
                if (event.key === 'Escape') event.currentTarget.blur()
              }}
            />
          </SearchField>
        ) : (
          <SearchButton type="button" aria-label="Search anime" onClick={() => setSearchOpen(true)}>
            <SearchIcon />
          </SearchButton>
        )}
        <Avatar type="button" aria-label="Your profile">
          <img src={foxBlack} alt="" />
        </Avatar>
        <MenuButton
          type="button"
          aria-label="Menu"
          aria-expanded={open}
          aria-controls="primary-nav"
          onClick={() => setOpen((value) => !value)}
        >
          <span />
          <span />
          <span />
        </MenuButton>
      </Actions>
    </Bar>
  )
}

const dropIn = keyframes`
  from { opacity: 0; transform: translateY(-12px); }
  to { opacity: 1; transform: translateY(0); }
`

/* The dark glass look shared by both floating capsules.
   The blur lives on a pseudo-element: backdrop-filter on the capsule itself would
   trap the mobile dropdown (position: fixed) inside it. */
const capsule = css`
  position: relative;
  isolation: isolate;
  color: ${({ theme }) => theme.colors.white};
  animation: ${dropIn} 0.35s cubic-bezier(0.22, 1, 0.36, 1) both;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: -1;
    border-radius: 999px;
    background: rgba(18, 18, 18, 0.72);
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 8px 28px rgba(0, 0, 0, 0.35);
    backdrop-filter: blur(16px) saturate(1.4);
    -webkit-backdrop-filter: blur(16px) saturate(1.4);
  }
`

const Bar = styled.header<{ $dark: boolean; $scrolled: boolean }>`
  position: fixed;
  inset: 0 0 auto 0;
  z-index: 50;
  /* only the controls catch clicks, the gaps let the page underneath through */
  pointer-events: none;
  padding: ${({ $scrolled }) =>
      $scrolled ? 'clamp(0.6rem, 1.2vw, 1.1rem)' : 'clamp(1rem, 2.6vw, 2.75rem)'}
    ${({ theme }) => theme.gutter};
  color: ${({ theme, $dark, $scrolled }) =>
    $dark || $scrolled ? theme.colors.white : theme.colors.ink};
  transition: padding 0.3s ease;

  ${({ $scrolled }) =>
    $scrolled
      ? css`
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
        `
      : css`
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
        `}

  ${({ theme }) => theme.media.md} {
    grid-template-columns: 1fr auto;
    color: ${({ theme }) => theme.colors.white};
  }
`

/* Logo + links. At the top of the page it's invisible (its children sit directly in
   the bar's grid); once scrolled it becomes the left capsule. */
const LeftPill = styled.div<{ $scrolled: boolean }>`
  display: contents;

  ${({ $scrolled }) =>
    $scrolled &&
    css`
      ${capsule}
      display: flex;
      align-items: center;
      gap: clamp(1.5rem, 3vw, 3.5rem);
      padding: 0.55rem clamp(1.1rem, 1.8vw, 2rem);
      pointer-events: auto;
    `}
`

const Brand = styled(Link)`
  justify-self: start;
  display: inline-flex;
  align-items: center;
  pointer-events: auto;
`

const logoSize = `
  width: clamp(112px, 8vw, 168px);
  height: auto;
`

const LogoDark = styled.img<{ $dark: boolean }>`
  ${logoSize}
  display: ${({ $dark }) => ($dark ? 'none' : 'block')};

  ${({ theme }) => theme.media.md} {
    display: none;
  }
`

const LogoLight = styled.img<{ $dark: boolean }>`
  ${logoSize}
  display: ${({ $dark }) => ($dark ? 'block' : 'none')};

  ${({ theme }) => theme.media.md} {
    display: block;
  }
`

const Links = styled.nav<{ $open: boolean; $scrolled: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ $scrolled }) => ($scrolled ? 'clamp(1.25rem, 2.4vw, 3rem)' : 'clamp(1.5rem, 3.4vw, 4.5rem)')};
  pointer-events: auto;

  ${({ theme }) => theme.media.md} {
    display: ${({ $open }) => ($open ? 'flex' : 'none')};
    /* fixed (not absolute) so it hangs off the screen, not off the capsule */
    position: fixed;
    top: ${({ $scrolled }) => ($scrolled ? '4rem' : '4.5rem')};
    left: ${({ theme }) => theme.gutter};
    right: ${({ theme }) => theme.gutter};
    flex-direction: column;
    align-items: stretch;
    gap: 0;
    padding: 0.5rem 1.25rem;
    border-radius: 1.25rem;
    background: rgba(12, 12, 12, 0.92);
    backdrop-filter: blur(14px);
  }
`

const StyledNavLink = styled(NavLink)`
  font-size: clamp(0.95rem, 1.3vw, 1.45rem);
  font-weight: 300;
  white-space: nowrap;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.7;
  }

  &.active {
    font-weight: 600;
    text-decoration: underline;
    text-underline-offset: 0.3em;
    text-decoration-thickness: 2px;
  }

  ${({ theme }) => theme.media.md} {
    padding: 0.85rem 0;
    font-size: 1rem;
    color: ${({ theme }) => theme.colors.white};

    & + & {
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }
  }
`

const Actions = styled.div<{ $scrolled: boolean }>`
  justify-self: end;
  display: flex;
  align-items: center;
  gap: ${({ $scrolled }) => ($scrolled ? '0.4rem' : 'clamp(0.6rem, 1vw, 1.1rem)')};
  pointer-events: auto;

  ${({ $scrolled }) =>
    $scrolled &&
    css`
      ${capsule}
      padding: 0.35rem;
    `}
`

/* Search collapsed to an icon, shown only while the bar is floating. */
const SearchButton = styled.button`
  display: grid;
  place-items: center;
  width: clamp(2.3rem, 2.7vw, 3.1rem);
  aspect-ratio: 1;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.12);
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.22);
  }

  ${({ theme }) => theme.media.sm} {
    display: none;
  }
`

/* Wraps the input so the magnifier can sit inside it. */
const SearchField = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;

  ${({ theme }) => theme.media.sm} {
    display: none;
  }
`

const SearchGlyph = styled.span`
  position: absolute;
  left: 0.95rem;
  display: grid;
  place-items: center;
  color: rgba(255, 255, 255, 0.85);
  pointer-events: none;

  svg {
    width: clamp(15px, 1.1vw, 20px);
    height: auto;
  }
`

const Search = styled.input`
  width: clamp(140px, 10vw, 200px);
  height: clamp(2.3rem, 2.7vw, 3.1rem);
  padding: 0 1.1rem 0 clamp(2.4rem, 2.6vw, 3rem);
  border: 0;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.glass};
  backdrop-filter: blur(10px);
  color: ${({ theme }) => theme.colors.white};
  font-size: clamp(0.85rem, 1vw, 1.1rem);
  font-weight: 300;
  text-align: left;
  transition: background 0.2s ease, width 0.25s ease;

  &::placeholder {
    color: rgba(255, 255, 255, 0.8);
  }

  &:focus {
    width: clamp(170px, 14vw, 260px);
    background: rgba(30, 30, 30, 0.92);
  }

  /* hide the browser's own clear button, we'll style our own later */
  &::-webkit-search-cancel-button {
    display: none;
  }
`

const Avatar = styled.button`
  display: grid;
  place-items: center;
  width: clamp(2.3rem, 2.7vw, 3.1rem);
  aspect-ratio: 1;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.white};
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.22);
  cursor: pointer;
  overflow: hidden;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.06);
  }

  img {
    width: 62%;
    height: 62%;
    object-fit: contain;
  }
`

const MenuButton = styled.button`
  display: none;
  width: 2.5rem;
  height: 2.5rem;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.glass};
  cursor: pointer;
  place-content: center;
  gap: 4px;

  span {
    display: block;
    width: 1.1rem;
    height: 2px;
    border-radius: 2px;
    background: ${({ theme }) => theme.colors.white};
  }

  ${({ theme }) => theme.media.md} {
    display: grid;
  }
`
