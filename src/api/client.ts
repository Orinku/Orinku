import type { ApiEnvelope } from '../types/api'

const DEFAULT_BASE_URL = 'http://localhost:4000'

/**
 * API origin from `.env`. Trailing slashes are removed, and so is a trailing
 * `/api`, in case it was pasted in by mistake (endpoints add it themselves).
 */
export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || DEFAULT_BASE_URL)
  .replace(/\/+$/, '')
  .replace(/\/api$/, '')

export class ApiError extends Error {
  status: number | null

  constructor(message: string, status: number | null = null) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

/** GET `{API_BASE_URL}{path}` and return the `results` payload. */
export async function apiGet<T>(path: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { Accept: 'application/json' },
    signal,
  })

  if (!response.ok) {
    throw new ApiError(`Request to ${path} failed (${response.status})`, response.status)
  }

  const body = (await response.json()) as ApiEnvelope<T>
  if (!body.success) {
    throw new ApiError(`API reported failure for ${path}`)
  }

  return body.results
}
