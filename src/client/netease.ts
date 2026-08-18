/** Client-side NetEase API wrappers over the host proxy. */

export interface NeteaseAccount {
  loggedIn: boolean
  uid?: number
  nickname?: string
  avatarUrl?: string
}

export interface NeteaseSong {
  id: number
  name: string
  artists: string
  album?: string
  durationMs?: number
}

export interface NeteasePlaylist {
  id: number
  name: string
  trackCount: number
}

export async function weapi<T>(path: string, data: Record<string, unknown> = {}): Promise<T> {
  const res = await fetch('/netease/weapi', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ path, data }),
    signal: AbortSignal.timeout(30000),
  })
  if (!res.ok) throw new Error(`weapi ${path}: HTTP ${res.status}`)
  return (await res.json()) as T
}

export async function getAccount(): Promise<NeteaseAccount> {
  const res = await fetch('/netease/account', { cache: 'no-store' })
  if (!res.ok) return { loggedIn: false }
  return (await res.json()) as NeteaseAccount
}

export async function logout(): Promise<void> {
  await fetch('/netease/logout', { method: 'POST' })
}

const COOKIE_NAME_RES = [
  /^Hm_lpvt_[a-f0-9]{32}/,
  /^Hm_lvt_[a-f0-9]{32}/,
  /^HMACCOUNT_BFESS/,
  /^JSESSIONID-WYYY/,
  /^__snaker__id/,
  /^ntes_kaola_ad/,
  /^MUSIC_A_T/,
  /^MUSIC_R_T/,
  /^gdxidpyhx/,
  /^_iuqxldmzr_/,
  /^_ntes_nnid/,
  /^_ntes_nuid/,
  /^HMACCOUNT/,
  /^MUSIC_U/,
  /^NMTID/,
  /^ntes_utid/,
  /^WM_NIKE/,
  /^WM_NI/,
  /^WM_TID/,
  /^__csrf/,
].sort((a, b) => b.source.length - a.source.length)

const STANDARD_COOKIE_RE = /^(?:[^=;\s]+=[^;]*)(?:\s*;\s*[^=;\s]+=[^;]*)*$/

export function normalizeCookiePaste(raw: string): string {
  const trimmed = raw.trim()
  if (trimmed === '') return ''
  if (STANDARD_COOKIE_RE.test(trimmed)) return trimmed
  const lines = trimmed
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.includes('=') && !l.startsWith(';'))
  if (lines.length > 1 && lines.every((l) => /^[^=;\s]+=[^;]*$/.test(l))) {
    return lines.join('; ')
  }
  const unanchored = COOKIE_NAME_RES.map((re) => new RegExp(re.source.replace(/^\^/, '')))
  const parts: string[] = []
  let rest = trimmed
  while (rest.length > 0) {
    let name: string | null = null
    for (const re of COOKIE_NAME_RES) {
      const m = rest.match(re)
      if (m !== null) {
        name = m[0]
        break
      }
    }
    if (name === null) break // unrecognized tail — stop, keep what we have
    rest = rest.slice(name.length)
    let end = rest.length
    for (const re of unanchored) {
      const idx = rest.search(re)
      if (idx !== -1 && idx < end) end = idx
    }
    parts.push(`${name}=${rest.slice(0, end)}`)
    rest = rest.slice(end)
  }
  return parts.join('; ')
}

/** Login by pasting a music.163.com session cookie (works when QR is blocked). */
export async function submitCookie(
  cookie: string,
): Promise<{ ok: boolean; nickname?: string; uid?: number; reason?: string }> {
  const res = await fetch('/netease/cookie', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ cookie }),
  })
  if (!res.ok) throw new Error(`cookie login: HTTP ${res.status}`)
  return (await res.json()) as { ok: boolean; nickname?: string; uid?: number; reason?: string }
}

export interface QrKeyResult {
  key: string
  /** ready-made QR image (data URL) when a remote API server provides it */
  qrimg?: string
}

export async function requestQrKey(): Promise<QrKeyResult> {
  const json = await weapi<{ unikey?: string; qrimg?: string }>('/weapi/login/qrcode/unikey', { type: 1 })
  if (typeof json.unikey !== 'string' || json.unikey === '') {
    throw new Error('unikey missing')
  }
  return { key: json.unikey, qrimg: json.qrimg }
}

export type QrStatus =
  | { code: 800 }
  | { code: 801 }
  | { code: 802 }
  | { code: 803; nickname?: string; avatarUrl?: string }

export async function pollQrLogin(key: string): Promise<QrStatus> {
  const json = await weapi<{ code?: number; nickname?: string; avatarUrl?: string }>(
    '/weapi/login/qrcode/client/login',
    { key, type: 1 },
  )
  const code = json.code ?? -1
  if (code === 800) return { code: 800 }
  if (code === 801) return { code: 801 }
  if (code === 802) return { code: 802 }
  if (code === 803) {
    return { code: 803, nickname: json.nickname, avatarUrl: json.avatarUrl }
  }
  throw new Error(`unexpected qr code ${code}`)
}

/** Playlists owned by / collected by the user. */
export async function fetchPlaylists(uid: number): Promise<NeteasePlaylist[]> {
  const json = await weapi<{ playlist?: Array<{ id?: number; name?: string; trackCount?: number }> }>(
    '/weapi/user/playlist',
    { uid, limit: 60, offset: 0, includeVideo: true },
  )
  return (json.playlist ?? [])
    .filter((p) => typeof p.id === 'number' && typeof p.name === 'string')
    .map((p) => ({ id: p.id as number, name: p.name as string, trackCount: p.trackCount ?? 0 }))
}

/** Tracks of one playlist. */
export async function fetchPlaylistTracks(id: number): Promise<NeteaseSong[]> {
  const json = await weapi<{
    playlist?: { tracks?: Array<{
      id?: number
      name?: string
      ar?: Array<{ name?: string }>
      al?: { name?: string }
      dt?: number
    }> }
  }>('/weapi/v6/playlist/detail', { id, n: 1000, s: 8 })
  const tracks = json.playlist?.tracks ?? []
  return tracks
    .filter((t) => typeof t.id === 'number' && typeof t.name === 'string')
    .map((t) => ({
      id: t.id as number,
      name: t.name as string,
      artists: (t.ar ?? []).map((a) => a.name ?? '').filter((s) => s !== '').join(' / '),
      album: t.al?.name,
      durationMs: t.dt,
    }))
}

/** Daily recommended songs (requires login). */
export async function fetchDailySongs(): Promise<NeteaseSong[]> {
  const json = await weapi<{
    data?: { dailySongs?: Array<{
      id?: number
      name?: string
      ar?: Array<{ name?: string }>
      al?: { name?: string }
      dt?: number
    }> }
  }>('/weapi/v1/discovery/recommend/songs', {})
  const songs = json.data?.dailySongs ?? []
  return songs
    .filter((s) => typeof s.id === 'number' && typeof s.name === 'string')
    .map((s) => ({
      id: s.id as number,
      name: s.name as string,
      artists: (s.ar ?? []).map((a) => a.name ?? '').filter((x) => x !== '').join(' / '),
      album: s.al?.name,
      durationMs: s.dt,
    }))
}

export async function fetchLyric(id: number): Promise<string> {
  const res = await fetch(`/netease/lyric?id=${id}`, { cache: 'no-store' })
  if (!res.ok) throw new Error(`lyric: HTTP ${res.status}`)
  const json = (await res.json()) as { lrc?: string }
  return json.lrc ?? ''
}

/** Playable stream URL (null for VIP/region-restricted songs). */
export async function fetchSongUrl(id: number): Promise<string | null> {
  try {
    const json = await weapi<{ data?: Array<{ url?: string | null }> }>(
      '/weapi/song/enhance/player/url',
      { ids: [id], br: 320000 },
    )
    const url = json.data?.[0]?.url
    return typeof url === 'string' && url !== '' ? url : null
  } catch {
    return null
  }
}

// ---------------------------------------------------------------------------
// public (unauthenticated) fallbacks — work even when the weapi QR login is
// unreachable from the current network
// ---------------------------------------------------------------------------

export async function fetchHotPlaylists(): Promise<NeteasePlaylist[]> {
  const res = await fetch('/netease/hot-playlists', { cache: 'no-store' })
  if (!res.ok) throw new Error(`hot playlists: HTTP ${res.status}`)
  const json = (await res.json()) as { playlists?: Array<{ id: number; name: string; trackCount: number }> }
  return json.playlists ?? []
}

export async function searchSongs(query: string): Promise<NeteaseSong[]> {
  const res = await fetch(`/netease/search?q=${encodeURIComponent(query)}`, { cache: 'no-store' })
  if (!res.ok) throw new Error(`search: HTTP ${res.status}`)
  const json = (await res.json()) as { songs?: Array<{
    id: number
    name: string
    artists: string
    album?: string
    durationMs?: number
  }> }
  return json.songs ?? []
}

/** Public stream URL via the outer-url redirect (no login required). */
export async function fetchPublicSongUrl(id: number): Promise<string | null> {
  try {
    const res = await fetch(`/netease/song-url?id=${id}`, { cache: 'no-store' })
    if (!res.ok) return null
    const json = (await res.json()) as { url?: string | null }
    return typeof json.url === 'string' && json.url !== '' ? json.url : null
  } catch {
    return null
  }
}
