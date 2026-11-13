import styled from 'styled-components'

interface ErrorStateProps {
  message: string
  onRetry: () => void
}

/** Inherits its colour from the parent so it works on light and dark areas. */
export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <Wrap role="alert">
      <p>{message}</p>
      <RetryButton type="button" onClick={onRetry}>
        Try again
      </RetryButton>
    </Wrap>
  )
}

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.9rem;
  padding: 1.5rem 0;
  text-align: center;

  p {
    font-weight: 300;
  }
`

const RetryButton = styled.button`
  padding: 0.6em 1.8em;
  border: 1px solid currentColor;
  border-radius: 999px;
  background: transparent;
  color: inherit;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: rgba(128, 128, 128, 0.25);
  }
`
