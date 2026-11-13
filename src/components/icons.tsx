import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement>

const base = {
  width: '1em',
  height: '1em',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
} as const

/** Subtitles. */
export const CcIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <rect x="3" y="5" width="18" height="14" rx="2.5" />
    <path d="M10 10.5a2 2 0 1 0 0 3M17 10.5a2 2 0 1 0 0 3" />
  </svg>
)

/** Dub / voice. */
export const MicIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <rect x="9" y="3" width="6" height="11" rx="3" />
    <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
  </svg>
)

export const StarIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.8 6.8 19.6l1-5.8L3.5 9.7l5.9-.9L12 3.5z" />
  </svg>
)

export const ChevronIcon = ({
  direction = 'down',
  ...props
}: IconProps & { direction?: 'up' | 'down' | 'left' | 'right' }) => {
  const paths = {
    down: 'M6 9l6 6 6-6',
    up: 'M6 15l6-6 6 6',
    left: 'M15 5l-7 7 7 7',
    right: 'M9 5l7 7-7 7',
  }
  return (
    <svg {...base} strokeWidth={2.4} {...props}>
      <path d={paths[direction]} />
    </svg>
  )
}
