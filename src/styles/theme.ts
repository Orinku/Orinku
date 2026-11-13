export const theme = {
  colors: {
    black: '#000000',
    ink: '#111111',
    paper: '#ececec',
    white: '#ffffff',
    accent: '#d3121b',
    glass: 'rgba(48, 48, 48, 0.72)',
    surface: '#141414',
  },
  fonts: {
    body: "'Poppins', system-ui, -apple-system, 'Segoe UI', sans-serif",
    display: "'Cormorant Garamond', Georgia, 'Times New Roman', serif",
  },
  /** Horizontal page gutter, matches the mockup's left margin. */
  gutter: 'clamp(1.25rem, 4.4vw, 5.5rem)',
  media: {
    /** tablets and below */
    md: '@media (max-width: 899px)',
    /** phones */
    sm: '@media (max-width: 639px)',
  },
} as const

export type AppTheme = typeof theme
