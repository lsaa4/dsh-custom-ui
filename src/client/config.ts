/**
 * Shared config model + HTTP client for the host half's /glass-ui routes.
 * The same shape as the host's GlassConfig; kept in sync manually.
 */

export interface GlassConfig {
  /** Glass surface opacity, 0.1..0.95 (higher = more solid). */
  opacity: number
  /** Background blur radius in px, 4..40. */
  blur: number
  /** Font family applied to the whole UI; '' keeps the built-in font. */
  font: string
  /** Uploaded font file URL (/glass-ui/media/...) for a custom @font-face. */
  fontUrl: string
  /** Background source: none | image | video. */
  bgType: 'none' | 'image' | 'video'
  /** Primary background image URL (first slide of the carousel). */
  bgImage: string
  /** All background image URLs (carousel slides; bgImage is slide 0). */
  bgImages: string[]
  /** Live wallpaper (video) URL (/glass-ui/media/...). */
  bgVideo: string
  /** Carousel: rotate through bgImages every N seconds. */
  bgRotate: boolean
  /** Carousel interval in seconds, 5..300. */
  bgRotateInterval: number
  /** Dark overlay strength over the wallpaper, 0..0.7 (readability). */
  bgMask: number
  /** Wallpaper fit mode. */
  bgFit: 'cover' | 'contain' | 'original'
  /** Animation level: none | soft | strong. */
  animLevel: 'none' | 'soft' | 'strong'
  /** User-supplied extra CSS injected verbatim. */
  customCss: string
  /** Lyric line position in the composer dock. */
  lyricPos: 'inline' | 'end' | 'hidden'
  /** HTTP proxy for NetEase requests (e.g. http://127.0.0.1:7890). */
  neteaseProxy: string
  /** Remote NeteaseCloudMusicApi server base URL (public/self-hosted instance). */
  neteaseApiBase: string
}

export const DEFAULT_CONFIG: GlassConfig = {
  opacity: 0.72,
  blur: 18,
  font: '',
  fontUrl: '',
  bgType: 'none',
  bgImage: '',
  bgImages: [],
  bgVideo: '',
  bgRotate: false,
  bgRotateInterval: 15,
  bgMask: 0,
  bgFit: 'cover',
  animLevel: 'soft',
  customCss: '',
  lyricPos: 'inline',
  neteaseProxy: '',
  neteaseApiBase: '',
}

export type BgType = GlassConfig['bgType']
export type BgFit = GlassConfig['bgFit']
export type AnimLevel = GlassConfig['animLevel']

/** Migrate a raw (possibly legacy) config into the current shape. */
export function normalizeConfig(raw: Partial<GlassConfig>): GlassConfig {
  const merged = { ...DEFAULT_CONFIG, ...raw } as GlassConfig
  // legacy: animations boolean → animLevel
  const legacyAnimations = (raw as Record<string, unknown>).animations
  if (legacyAnimations === false && merged.animLevel === 'soft') merged.animLevel = 'none'
  // legacy: single bgImage → slide list
  if (merged.bgImage !== '' && !merged.bgImages.includes(merged.bgImage)) {
    merged.bgImages = [merged.bgImage, ...merged.bgImages]
  }
  merged.bgImages = merged.bgImages.filter((u) => typeof u === 'string' && u !== '')
  if (merged.bgImages.length === 0) merged.bgImage = ''
  else merged.bgImage = merged.bgImages[0] ?? ''
  return merged
}

export async function loadConfig(): Promise<GlassConfig> {
  const res = await fetch('/glass-ui/config', { cache: 'no-store' })
  if (!res.ok) throw new Error(`load config: HTTP ${res.status}`)
  return normalizeConfig((await res.json()) as Partial<GlassConfig>)
}

export async function saveConfig(config: GlassConfig): Promise<GlassConfig> {
  const res = await fetch('/glass-ui/config', {
    method: 'PUT',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(config),
  })
  if (!res.ok) throw new Error(`save config: HTTP ${res.status}`)
  return normalizeConfig((await res.json()) as Partial<GlassConfig>)
}

export async function uploadMedia(
  blob: Blob,
  kind: 'image' | 'video' | 'font',
): Promise<{ url: string; name: string }> {
  const res = await fetch('/glass-ui/media', {
    method: 'POST',
    headers: { 'x-media-kind': kind },
    body: blob,
  })
  if (!res.ok) throw new Error(`upload ${kind}: HTTP ${res.status}`)
  return (await res.json()) as { url: string; name: string }
}

export async function deleteMedia(url: string): Promise<void> {
  const res = await fetch(url, { method: 'DELETE' })
  if (!res.ok) throw new Error(`delete media: HTTP ${res.status}`)
}
