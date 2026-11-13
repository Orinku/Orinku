import { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import wordmarkBlack from '../assets/brand/wordmark-black.png'
import wordmarkWhite from '../assets/brand/wordmark-white.png'
import foxBlack from '../assets/brand/fox-black.png'

const LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/airing', label: 'Now Airing', end: false },
  { to: '/movies', label: 'Movies', end: false },
  { to: '/genre', label: 'Genre', end: false },
] as const

export function Navbar() {
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)

  // Only the home page has the light hero; every other page is plain black.
  const onDark = pathname !== '/'

  return (
    <Bar $dark={onDark}>
      <Brand to="/" aria-label="Orinku home">
        <LogoDark $dark={onDark} src={wordmarkBlack} alt="Orinku" />
        <LogoLight $dark={onDark} src={wordmarkWhite} alt="" aria-hidden="true" />
      </Brand>

      <Links id="primary-nav" $open={open} aria-label="Primary">
        {LINKS.map((link) => (
          <StyledNavLink key={link.to} to={link.to} end={link.end} onClick={() => setOpen(false)}>
            {link.label}
          </StyledNavLink>
        ))}
      </Links>

      <Actions>
        {/* Placeholders for now — search and profile come in a later pass. */}
        <Search type="search" placeholder="search" aria-label="Search anime" />
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

const Bar = styled.header<{ $dark: boolean }>`
  position: absolute;
  inset: 0 0 auto 0;
  z-index: 10;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  padding: clamp(1rem, 2.6vw, 2.75rem) ${({ theme }) => theme.gutter};
  color: ${({ theme, $dark }) => ($dark ? theme.colors.white : theme.colors.ink)};

  ${({ theme }) => theme.media.md} {
    grid-template-columns: 1fr auto;
    color: ${({ theme }) => theme.colors.white};
  }
`

const Brand = styled(Link)`
  justify-self: start;
  display: inline-flex;
  align-items: center;
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

const Links = styled.nav<{ $open: boolean }>`
  display: flex;
  align-items: center;
  gap: clamp(1.5rem, 3.4vw, 4.5rem);

  ${({ theme }) => theme.media.md} {
    display: ${({ $open }) => ($open ? 'flex' : 'none')};
    position: absolute;
    top: 100%;
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

const Actions = styled.div`
  justify-self: end;
  display: flex;
  align-items: center;
  gap: clamp(0.6rem, 1vw, 1.1rem);
`

const Search = styled.input`
  width: clamp(130px, 9vw, 190px);
  height: clamp(2.3rem, 2.7vw, 3.1rem);
  padding: 0 1.1rem;
  border: 0;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.glass};
  backdrop-filter: blur(10px);
  color: ${({ theme }) => theme.colors.white};
  font-size: clamp(0.85rem, 1vw, 1.1rem);
  font-weight: 300;
  text-align: center;
  transition: background 0.2s ease, width 0.25s ease;

  &::placeholder {
    color: rgba(255, 255, 255, 0.8);
  }

  &:focus {
    width: clamp(160px, 14vw, 260px);
    background: rgba(30, 30, 30, 0.92);
    text-align: left;
  }

  /* hide the browser's own clear button, we'll style our own later */
  &::-webkit-search-cancel-button {
    display: none;
  }

  ${({ theme }) => theme.media.sm} {
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
  background: ${({ theme }) => theme.colors.paper};
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
