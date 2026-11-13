import styled from 'styled-components'

interface Option<T extends string> {
  id: T
  label: string
}

interface SegmentedProps<T extends string> {
  /** Accessible name for the group. */
  label: string
  options: readonly Option<T>[]
  value: T
  onChange: (value: T) => void
  /** Tighter padding, for narrow spots like a sidebar heading. */
  compact?: boolean
}

/** The pill-shaped "Today | Week | Month" style switch. */
export function Segmented<T extends string>({
  label,
  options,
  value,
  onChange,
  compact = false,
}: SegmentedProps<T>) {
  return (
    <Group role="tablist" aria-label={label}>
      {options.map((option) => (
        <Tab
          key={option.id}
          type="button"
          role="tab"
          aria-selected={option.id === value}
          $active={option.id === value}
          $compact={compact}
          onClick={() => onChange(option.id)}
        >
          {option.label}
        </Tab>
      ))}
    </Group>
  )
}

const Group = styled.div`
  display: inline-flex;
  padding: 4px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(8px);
`

const Tab = styled.button<{ $active: boolean; $compact: boolean }>`
  padding: ${({ $compact }) => ($compact ? '0.4em 0.85em' : '0.45em 1.15em')};
  border: 0;
  border-radius: 999px;
  background: ${({ $active, theme }) => ($active ? theme.colors.white : 'transparent')};
  color: ${({ $active, theme }) => ($active ? theme.colors.black : theme.colors.white)};
  font-size: clamp(0.74rem, 0.7rem + 0.2vw, 0.92rem);
  font-weight: 500;
  line-height: 1.2;
  white-space: nowrap;
  cursor: pointer;
  transition:
    background 0.25s ease,
    color 0.25s ease;

  &:hover {
    background: ${({ $active, theme }) => ($active ? theme.colors.white : 'rgba(255, 255, 255, 0.14)')};
  }

  ${({ theme }) => theme.media.sm} {
    padding: 0.45em 0.9em;
  }
`
