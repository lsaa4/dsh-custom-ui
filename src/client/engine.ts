/**
 * The glass engine: applies a GlassConfig to the live page.
 *
 * Values are written as CSS variables on :root plus a few body attributes /
 * classes; the static glass.css consumes them. Everything created here is
 * tracked so the plugin fiber can tear it down (dispose).
 */
import type { GlassConfig } from './config.ts'

const BG_ID = 'dsh-glass-bg'
const FONT_FACE_ID = 'dsh-glass-fontface'
const CUSTOM_CSS_ID = 'dsh-glass-custom'

/** The custom font family name used when a font file is uploaded. */
export const CUSTOM_FONT_FAMILY = 'GlassCustomFont'

const SURFACE_LIGHT = '255, 255, 255'
const SURFACE_DARK = '16, 16, 24'

export class GlassEngine {
  private disposers: Array<() => void> = []
  private applied = false
  private carouselTimer: number | undefined
  /** double-buffered wallpaper images (alternate as active) */
  private imgA: HTMLImageElement | null = null
  private imgB: HTMLImageElement | null = null
  private active: 'A' | 'B' = 'A'
  private imageSeq = 0
  private currentVideo: HTMLVideoElement | null = null
  private videoSeq = 0

  /** Mount the background host element (idempotent). */
  private ensureBgHost(): HTMLElement {
    let host = document.getElementById(BG_ID)
    if (host !== null) return host as HTMLElement
    host = document.createElement('div')
    host.id = BG_ID
    document.body.appendChild(host)
    const remove = (): void => {
      host?.remove()
    }
    this.disposers.push(remove)
    return host
  }

  /** Apply a config to the live page. Safe to call repeatedly. */
  apply(config: GlassConfig): void {
    const root = document.documentElement
    const cssFont = config.font === '' ? 'inherit' : config.font
    root.style.setProperty('--glass-opacity', String(config.opacity))
    root.style.setProperty('--glass-blur', `${config.blur}px`)
    root.style.setProperty('--glass-font', cssFont)
    root.style.setProperty('--glass-font-url', config.fontUrl === '' ? 'none' : `url("${config.fontUrl}")`)
    root.style.setProperty('--glass-bg-type', config.bgType)
    root.style.setProperty('--glass-bg-image', config.bgImage === '' ? 'none' : `url("${config.bgImage}")`)
    root.style.setProperty('--glass-bg-video', config.bgVideo === '' ? 'none' : `url("${config.bgVideo}")`)
    root.style.setProperty('--glass-bg-mask', String(config.bgMask))
    root.style.setProperty('--glass-bg-fit', config.bgFit)
    root.style.setProperty('--glass-anim-level', config.animLevel)
    root.style.setProperty('--glass-surface-light', `rgba(${SURFACE_LIGHT}, ${config.opacity})`)
    root.style.setProperty('--glass-surface-dark', `rgba(${SURFACE_DARK}, ${config.opacity})`)

    const body = document.body
    body.classList.add('dsh-glass-on')
    body.dataset.glassFit = config.bgFit
    body.classList.toggle('dsh-glass-anim-soft', config.animLevel === 'soft')
    body.classList.toggle('dsh-glass-anim-strong', config.animLevel === 'strong')
    body.classList.toggle('dsh-glass-anim-none', config.animLevel === 'none')

    this.updateFontFace(config)
    this.updateBackground(config)
    this.updateCustomCss(config.customCss)
    // after the first apply, fade the background layer in (see glass.css)
    body.classList.add('dsh-glass-ready')
    this.applied = true
  }

  private updateFontFace(config: GlassConfig): void {
    const existing = document.getElementById(FONT_FACE_ID)
    if (config.fontUrl === '' || !config.font.includes(CUSTOM_FONT_FAMILY)) {
      existing?.remove()
      return
    }
    if (existing !== null) return
    const style = document.createElement('style')
    style.id = FONT_FACE_ID
    style.textContent =
      `@font-face{font-family:${CUSTOM_FONT_FAMILY};src:url("${config.fontUrl}") format("woff2"),` +
      `url("${config.fontUrl}") format("woff"),url("${config.fontUrl}") format("truetype");font-display:swap}`
    document.head.appendChild(style)
    this.disposers.push(() => style.remove())
  }

  private updateCustomCss(css: string): void {
    const existing = document.getElementById(CUSTOM_CSS_ID)
    if (css === '') {
      existing?.remove()
      return
    }
    if (existing === null) {
      const style = document.createElement('style')
      style.id = CUSTOM_CSS_ID
      document.head.appendChild(style)
      this.disposers.push(() => style.remove())
    }
    const el = document.getElementById(CUSTOM_CSS_ID) as HTMLStyleElement | null
    if (el !== null && el.textContent !== css) el.textContent = css
  }

  private stopCarousel(): void {
    if (this.carouselTimer !== undefined) {
      window.clearInterval(this.carouselTimer)
      this.carouselTimer = undefined
    }
  }

  /**
   * Crossfade to a new wallpaper with double buffering: the new image is
   * preloaded first and only then faded in over the still-visible old one.
   * The background never goes blank, so there is no black flash while
   * switching/uploading wallpapers in the settings panel.
   */
  private imageEl(key: 'A' | 'B'): HTMLImageElement {
    const host = this.ensureBgHost()
    let el = key === 'A' ? this.imgA : this.imgB
    if (el === null || !host.contains(el)) {
      el = document.createElement('img')
      el.alt = ''
      el.style.opacity = '0'
      host.appendChild(el)
      if (key === 'A') this.imgA = el
      else this.imgB = el
    }
    return el
  }

  private renderImage(url: string): void {
    const host = this.ensureBgHost()
    const activeEl = this.imageEl(this.active)
    if (activeEl.src === url) return
    const seq = ++this.imageSeq
    const probe = new Image()
    probe.onload = () => {
      if (seq !== this.imageSeq) return // a newer request superseded this one
      if (!host.isConnected) return // engine disposed meanwhile
      const nextKey = this.active === 'A' ? 'B' : 'A'
      const nextEl = this.imageEl(nextKey)
      nextEl.src = url
      nextEl.style.opacity = '0'
      // flush style, then crossfade
      void nextEl.offsetWidth
      nextEl.style.transition = 'opacity 0.45s ease'
      nextEl.style.opacity = '1'
      activeEl.style.transition = 'opacity 0.45s ease'
      activeEl.style.opacity = '0'
      this.active = nextKey
    }
    probe.onerror = () => {
      // keep the current image; never blank the background
    }
    probe.src = url
  }

  /**
   * Video wallpaper with readiness gating: a bare <video> paints BLACK while
   * its source loads or switches, which is exactly the flash users saw. So a
   * hidden probe video preloads the new URL first; only when the first frame
   * is available (loadeddata) does it fade in over the still-visible old
   * video, which is then released. The gradient backdrop stays visible the
   * whole time, so the background never goes black — on upload, switch,
   * carousel, or page refresh.
   */
  private renderVideo(url: string): void {
    const host = this.ensureBgHost()
    if (this.currentVideo !== null && this.currentVideo.src === url) return
    const seq = ++this.videoSeq

    const probe = document.createElement('video')
    probe.muted = true
    probe.loop = true
    probe.playsInline = true
    probe.preload = 'auto'
    probe.style.opacity = '0'

    const onReady = (): void => {
      if (seq !== this.videoSeq || !host.isConnected) {
        probe.remove()
        return
      }
      probe.removeEventListener('loadeddata', onReady)
      probe.removeEventListener('error', onError)
      const old = this.currentVideo
      this.currentVideo = probe
      void probe.offsetWidth // flush style
      probe.style.transition = 'opacity 0.5s ease'
      probe.style.opacity = '1'
      void probe.play().catch(() => undefined)
      if (old !== null && old !== probe) {
        old.style.transition = 'opacity 0.5s ease'
        old.style.opacity = '0'
        window.setTimeout(() => {
          if (old !== null && old !== this.currentVideo) {
            old.pause()
            old.removeAttribute('src')
            old.load() // release the big media buffer
            old.remove()
          }
        }, 560)
      }
    }
    const onError = (): void => {
      if (seq !== this.videoSeq) return
      probe.removeEventListener('loadeddata', onReady)
      probe.remove()
    }

    probe.addEventListener('loadeddata', onReady)
    probe.addEventListener('error', onError)
    probe.src = url
    probe.load()
    host.appendChild(probe)
  }

  private updateBackground(config: GlassConfig): void {
    const host = this.ensureBgHost()
    this.stopCarousel()
    if (config.bgType === 'image') {
      this.currentVideo?.remove()
      this.currentVideo = null
      const slides = config.bgImages.length > 0
        ? config.bgImages
        : config.bgImage !== ''
          ? [config.bgImage]
          : []
      if (slides.length === 0) {
        // no slides: drop the images (the gradient backdrop remains)
        this.imgA?.remove()
        this.imgA = null
        this.imgB?.remove()
        this.imgB = null
        return
      }
      if (config.bgRotate && slides.length > 1) {
        let index = Math.max(0, slides.indexOf(config.bgImage))
        const first = slides[index]
        if (first !== undefined) this.renderImage(first)
        this.carouselTimer = window.setInterval(() => {
          index = (index + 1) % slides.length
          const url = slides[index]
          if (url !== undefined) this.renderImage(url)
        }, config.bgRotateInterval * 1000)
      } else {
        this.renderImage(config.bgImage)
      }
    } else if (config.bgType === 'video') {
      this.imgA?.remove()
      this.imgA = null
      this.imgB?.remove()
      this.imgB = null
      if (config.bgVideo !== '') {
        this.renderVideo(config.bgVideo)
      } else {
        // wallpaper removed: drop the video, gradient backdrop remains
        this.currentVideo?.remove()
        this.currentVideo = null
      }
    } else {
      this.imgA?.remove()
      this.imgA = null
      this.imgB?.remove()
      this.imgB = null
      this.currentVideo?.remove()
      this.currentVideo = null
    }
  }

  /** Remove everything the engine created (plugin unload / HMR). */
  dispose(): void {
    this.imageSeq += 1 // invalidate in-flight preloads
    this.videoSeq += 1 // invalidate in-flight video probes
    this.stopCarousel()
    for (const dispose of this.disposers.splice(0)) dispose()
    const bg = document.getElementById(BG_ID)
    bg?.remove()
    document.getElementById(FONT_FACE_ID)?.remove()
    document.getElementById(CUSTOM_CSS_ID)?.remove()
    const body = document.body
    body.classList.remove(
      'dsh-glass-on',
      'dsh-glass-anim-soft',
      'dsh-glass-anim-strong',
      'dsh-glass-anim-none',
      'dsh-glass-ready',
    )
    delete body.dataset.glassFit
    this.imgA = null
    this.imgB = null
    this.currentVideo = null
    this.applied = false
  }
}
