export {}

declare global {
  interface ImportMetaEnv {
    /** Base URL of the Orinku API, including the `/api` prefix. */
    readonly VITE_API_URL?: string
  }
}
