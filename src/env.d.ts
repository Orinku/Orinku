export {}

declare global {
  interface ImportMetaEnv {
    /** Origin of the Orinku API, e.g. `https://your-api-domain.com` (no `/api`). */
    readonly VITE_API_BASE_URL?: string
  }
}
