import styled from 'styled-components'
import { type AnimeStatus, ratingLabel, STATUS_LABELS } from '../lib/format'
import { CcIcon, MicIcon, StarIcon } from './icons'

const STATUS_COLORS: Record<AnimeStatus, string> = {
  airing: '#3ddc84',
  completed: '#4aa3ff',
  upcoming: '#ffa733',
}

/** Small coloured dot in front of a title: airing / completed / upcoming. */
export const StatusDot = styled.span.attrs<{ $status: AnimeStatus }>(({ $status }) => ({
  title: STATUS_LABELS[$status],
  role: 'img',
  'aria-label': STATUS_LABELS[$status],
}))<{ $status: AnimeStatus }>`
  flex: none;
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background: ${({ $status }) => STATUS_COLORS[$status]};
  box-shadow: 0 0 8px ${({ $status }) => STATUS_COLORS[$status]}99;
`

interface MetaChipsProps {
  type?: string
  sub?: number
  dub?: number
  rating?: string
}

/** Type, subbed / dubbed episode counts and rating. Anything missing is left out. */
export function MetaChips({ type, sub, dub, rating }: MetaChipsProps) {
  const score = rating ? ratingLabel(rating) : null
  return (
    <Row>
      {type && <Chip>{type}</Chip>}
      {sub ? (
        <Chip title={`${sub} subbed episodes`}>
          <CcIcon />
          {sub}
        </Chip>
      ) : null}
      {dub ? (
        <Chip title={`${dub} dubbed episodes`}>
          <MicIcon />
          {dub}
        </Chip>
      ) : null}
      {score && (
        <Chip title="Rating">
          <StarIcon />
          {score}
        </Chip>
      )}
    </Row>
  )
}

const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
  min-width: 0;
`

const Chip = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.28em;
  padding: 0.18em 0.55em;
  border-radius: 0.5rem;
  background: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.66);
  font-size: clamp(0.66rem, 0.62rem + 0.18vw, 0.78rem);
  font-weight: 500;
  line-height: 1.5;
  white-space: nowrap;
  font-variant-numeric: tabular-nums;

  svg {
    font-size: 1.05em;
  }
`
