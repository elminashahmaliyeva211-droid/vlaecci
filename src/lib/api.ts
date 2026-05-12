const clientApiBaseUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000').replace(/\/$/, '')
const serverApiBaseUrl = (process.env.API_URL_INTERNAL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000').replace(/\/$/, '')

export function buildApiUrl(path: string) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${clientApiBaseUrl}${normalizedPath}`
}

export function buildServerApiUrl(path: string) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${serverApiBaseUrl}${normalizedPath}`
}

export function apiFetch(path: string, init?: RequestInit) {
  return fetch(buildApiUrl(path), {
    ...init,
    credentials: init?.credentials ?? 'include',
  })
}

export function serverApiFetch(path: string, init?: RequestInit) {
  return fetch(buildServerApiUrl(path), {
    ...init,
    cache: init?.cache ?? 'no-store',
  })
}
