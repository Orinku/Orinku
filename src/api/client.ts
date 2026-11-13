import type { ApiEnvelope } from '../types/api'

const DEFAULT_API_URL = 'http://localhost:4000/api'

/** Base URL from `.env`, with any trailing slash removed. */
export const API_URL = (import.meta.env.VITE_API_URL || DEFAULT_API_URL).replace(/\/+$/, '')

export class ApiError extends Error {
  status: number | null

  constructor(message: string, status: number | null = null) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

/** GET `{API_URL}{path}` and return the `results` payload. */
export async function apiGet<T>(path = '', signal?: AbortSignal): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { Accept: 'application/json' },
    signal,
  })

  if (!response.ok) {
    throw new ApiError(`Request to ${path || '/'} failed (${response.status})`, response.status)
  }

  const body = (await response.json()) as ApiEnvelope<T>
  if (!body.success) {
    throw new ApiError(`API reported failure for ${path || '/'}`)
  }

  return body.results
}
