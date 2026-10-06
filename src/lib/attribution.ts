export type Touch = {
  capturedAt: string
  params: [string, string][]
}

export type Attribution = {
  firstTouch: Touch
  latestTouch: Touch
}

const storageKey = 'met.philippines.attribution.v1'
const maxAgeMs = 30 * 24 * 60 * 60 * 1000
const sensitiveSegments = new Set([
  'token', 'secret', 'password', 'passwd', 'auth', 'authorization',
  'code', 'otp', 'session', 'state', 'email', 'phone', 'mobile',
  'whatsapp',
])

function isSafeKey(key: string): boolean {
  const normalized = key.replace(/([a-z0-9])([A-Z])/g, '$1_$2').toLowerCase()
  if (['name', 'first_name', 'last_name', 'full_name'].includes(normalized)) return false
  return !normalized.split(/[^a-z0-9]+/).some((segment) => sensitiveSegments.has(segment))
}

function isTouch(value: unknown): value is Touch {
  if (!value || typeof value !== 'object') return false
  const touch = value as Touch
  return typeof touch.capturedAt === 'string' &&
    Array.isArray(touch.params) &&
    touch.params.every((entry) => Array.isArray(entry) && entry.length === 2 &&
      typeof entry[0] === 'string' && typeof entry[1] === 'string')
}

function readStored(now: number): Attribution | null {
  try {
    const raw = localStorage.getItem(storageKey)
    if (!raw) return null
    const value: unknown = JSON.parse(raw)
    if (!value || typeof value !== 'object') return null
    const attribution = value as Attribution
    if (!isTouch(attribution.firstTouch) || !isTouch(attribution.latestTouch)) return null
    const latestTime = Date.parse(attribution.latestTouch.capturedAt)
    if (!Number.isFinite(latestTime) || latestTime > now || now - latestTime > maxAgeMs) {
      localStorage.removeItem(storageKey)
      return null
    }
    const firstTime = Date.parse(attribution.firstTouch.capturedAt)
    if (!Number.isFinite(firstTime) || firstTime > now || now - firstTime > maxAgeMs) {
      attribution.firstTouch = attribution.latestTouch
    }
    return attribution
  } catch {
    return null
  }
}

export function captureAttribution(search = window.location.search): Attribution | null {
  const now = Date.now()
  const existing = readStored(now)
  const params = [...new URLSearchParams(search).entries()].filter(([key]) => isSafeKey(key))
  if (params.length === 0) return existing

  const touch: Touch = { capturedAt: new Date(now).toISOString(), params }
  const attribution: Attribution = {
    firstTouch: existing?.firstTouch ?? touch,
    latestTouch: touch,
  }

  try {
    localStorage.setItem(storageKey, JSON.stringify(attribution))
  } catch {
    // The page remains usable when browser storage is unavailable.
  }
  return attribution
}

export function getAttribution(): Attribution | null {
  return readStored(Date.now())
}
