import type { ReactNode } from 'react'
import styled from 'styled-components'
import { ChevronIcon } from './icons'

interface PanelProps {
  title: string
  /** Shown on the right of the heading, e.g. a Today / Week / Month switch. */
  action?: ReactNode
  children: ReactNode
}

/** The dark rounded card the sidebar lists live in. */
export function Panel({ title, action, children }: PanelProps) {
  return (
    <Box aria-label={title}>
      <Header>
        <Heading>
          <ChevronIcon direction="right" />
          {title}
        </Heading>
        {action}
      </Header>
      {children}
    </Box>
  )
}

interface ExpandBarProps {
  expanded: boolean
  onToggle: () => void
  /** What the bar reveals, for screen readers, e.g. "more rankings". */
  controls: string
}

/** The full-width chevron under a list that shows the rest of it. */
export function ExpandBar({ expanded, onToggle, controls }: ExpandBarProps) {
  return (
    <Bar
      type="button"
      aria-expanded={expanded}
      aria-label={expanded ? `Show fewer ${controls}` : `Show ${controls}`}
      onClick={onToggle}
    >
      <ChevronIcon direction={expanded ? 'up' : 'down'} />
    </Bar>
  )
}

const Box = styled.section`
  padding: clamp(0.75rem, 1.1vw, 1.1rem);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: clamp(14px, 1.3vw, 22px);
  background: #0c0c0d;
`

const Header = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.6rem;
  padding: 0.35rem 0.4rem 0.9rem;
`

const Heading = styled.h2`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: clamp(0.95rem, 0.85rem + 0.3vw, 1.2rem);
  font-weight: 700;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  line-height: 1;

  svg {
    color: rgba(255, 255, 255, 0.85);
    font-size: 1.1em;
  }
`

const Bar = styled.button`
  display: grid;
  place-items: center;
  width: 100%;
  height: 2.6rem;
  margin-top: 0.5rem;
  padding: 0;
  border: 0;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  transition:
    background 0.2s ease,
    color 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: ${({ theme }) => theme.colors.white};
  }
`
