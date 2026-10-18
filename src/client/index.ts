/**
 * dsh-glass-ui browser half.
 *
 * Registers the glass look:
 *  1. the compiled glass.css ships inside this bundle — the build script
 *     wraps it in a style-injection preamble that runs before apply();
 *  2. overrides the core surface tokens to translucent glass values
 *     (via ctx.theme.overrideTokens — values are var() references so the
 *     opacity slider only touches :root variables);
 *  3. runs the GlassEngine (background layer, fonts, root variables);
 *  4. registers a "UI Design" section in the Settings dialog.
 *
 * Everything is fiber-owned: dispose() tears the glass off cleanly.
 */
import { createElement as h } from 'react'
import './glass.css'
import { GlassEngine } from './engine.ts'
import { DEFAULT_CONFIG, loadConfig, type GlassConfig } from './config.ts'
import { en, zh } from './locales.ts'
import type { Translate } from './locales.ts'
import { GlassPanel } from './GlassPanel.tsx'
import { LyricsLine } from './LyricsLine.tsx'
import { initLyricPos } from './lyrics.ts'
import { mountMusicControls, setMediaDisplayEnabled } from './musicControls.ts'
import { mountDockPlate } from './dockPlate.ts'

const NS = 'dsh-glass-ui'

/** The subset of the slots service this plugin touches. */
interface SlotsService {
  inject(slot: string, register: () => unknown): void
  register(meta: Record<string, unknown>, component: () => unknown): unknown
}

/** The subset of the locale service this plugin touches. */
interface LocaleService {
  register(namespace: string, dicts: { zh: Record<string, string>; en: Record<string, string> }): unknown
  bind(namespace: string): Translate
}

/** The subset of the theme service this plugin touches. */
interface ThemeService {
  overrideTokens(
    source: string,
    tokens: Record<string, { light: string; dark: string }>,
  ): () => void
}

/** The client cordis context shape this plugin relies on (structural). */
interface GlassClientContext {
  effect(callback: () => unknown | (() => void), label?: string): void
  locale: LocaleService
  slots: SlotsService
  theme: ThemeService
}

export const name = NS
export const inject = ['slots', 'locale', 'theme']

/**
 * The translucent surface tokens. Values are var() references resolved on
 * :root, so slider changes never need to re-run overrideTokens.
 */
const GLASS_TOKENS: Record<string, { light: string; dark: string }> = {
  '--dsw-alias-bg-base': {
    light: 'var(--glass-surface-light)',
    dark: 'var(--glass-surface-dark)',
  },
  // Raised layers are where dialogs and panels live (the modal card and the
  // settings panel both paint themselves with bg-layer-2), so they follow the
  // content knob rather than the background glass.
  '--dsw-alias-bg-layer-1': {
    light: 'var(--glass-panel-light)',
    dark: 'var(--glass-panel-dark)',
  },
  '--dsw-alias-bg-layer-2': {
    light: 'var(--glass-panel-light)',
    dark: 'var(--glass-panel-dark)',
  },
  '--dsw-alias-bg-layer-3': {
    light: 'var(--glass-panel-light)',
    dark: 'var(--glass-panel-dark)',
  },
  '--dsw-alias-bg-module-platform': {
    light: 'var(--glass-surface-light)',
    dark: 'var(--glass-surface-dark)',
  },
  '--dsw-specific-sidebar-fill': {
    light: 'var(--glass-surface-light)',
    dark: 'var(--glass-surface-dark)',
  },
  // menus / popovers stay mostly solid so they stay readable over content
  '--dsw-alias-bg-overlay': {
    light: 'rgba(250, 250, 252, 0.92)',
    dark: 'rgba(22, 22, 30, 0.93)',
  },
  '--dsw-specific-menu': {
    light: 'rgba(250, 250, 252, 0.92)',
    dark: 'rgba(22, 22, 30, 0.93)',
  },
  // softer borders read as glass edges
  '--dsw-alias-border-l1': {
    light: 'rgba(0, 0, 0, 0.07)',
    dark: 'rgba(255, 255, 255, 0.09)',
  },
  '--dsw-alias-border-l2': {
    light: 'rgba(0, 0, 0, 0.12)',
    dark: 'rgba(255, 255, 255, 0.14)',
  },
  '--dsw-alias-brand-primary': {
    light: 'rgba(65, 118, 230, 0.92)',
    dark: 'rgba(126, 168, 255, 0.94)',
  },
  // Button plates. The sidebar's New Session button paints itself with
  // --dsw-alias-button-elevated-fill and the composer's floating controls with
  // --dsw-alias-button-floating-fill; leaving them out kept those controls
  // opaque while everything around them was glass. They use the solid glass so
  // a label sitting on a button keeps its contrast.
  '--dsw-alias-button-elevated-fill': {
    light: 'var(--glass-solid-light)',
    dark: 'var(--glass-solid-dark)',
  },
  '--dsw-alias-button-floating-fill': {
    light: 'var(--glass-solid-light)',
    dark: 'var(--glass-solid-dark)',
  },
  '--dsw-alias-button-floating-hover': {
    light: 'var(--glass-hover-light)',
    dark: 'var(--glass-hover-dark)',
  },
  '--dsw-alias-button-ghost-active-fill': {
    light: 'var(--glass-hover-light)',
    dark: 'var(--glass-hover-dark)',
  },
  '--dsw-alias-button-ghost-active-hover': {
    light: 'var(--glass-hover-light)',
    dark: 'var(--glass-hover-dark)',
  },
  // Interaction plates that used to stay solid: list/nav rows and the
  // multi-select plate (their stock values are the opaque neutral-bluish ramp).
  '--dsw-alias-interactive-bg-hover-solid': {
    light: 'var(--glass-hover-light)',
    dark: 'var(--glass-hover-dark)',
  },
  '--dsw-specific-sidebar-nav-item-hover': {
    light: 'var(--glass-hover-light)',
    dark: 'var(--glass-hover-dark)',
  },
  '--dsw-alias-bg-multi-select': {
    light: 'var(--glass-hover-light)',
    dark: 'var(--glass-hover-dark)',
  },
  // Menu group headers ship at 94% opacity; keep them on the menu surface
  // instead of punching an opaque strip through it.
  '--dsw-alias-menu-group-header-fill': {
    light: 'rgba(250, 250, 252, 0.92)',
    dark: 'rgba(22, 22, 30, 0.93)',
  },
  // Text-bearing surfaces. Code blocks, the message bubble and the composer's
  // own plates ship fully opaque, which is exactly where a glass theme starts
  // costing legibility: they carry text, so they get the solid glass instead of
  // the panel value.
  '--dsw-specific-bubble': {
    light: 'var(--glass-solid-light)',
    dark: 'var(--glass-solid-dark)',
  },
  '--dsw-specific-input-major': {
    light: 'var(--glass-solid-light)',
    dark: 'var(--glass-solid-dark)',
  },
  '--dsw-alias-markdown-code-block': {
    light: 'var(--glass-solid-light)',
    dark: 'var(--glass-solid-dark)',
  },
  '--dsw-alias-markdown-code-block-banner': {
    light: 'var(--glass-solid-light)',
    dark: 'var(--glass-solid-dark)',
  },
  '--dsw-alias-markdown-inline-code': {
    light: 'var(--glass-solid-light)',
    dark: 'var(--glass-solid-dark)',
  },
  '--dsw-alias-markdown-tag': {
    light: 'var(--glass-solid-light)',
    dark: 'var(--glass-solid-dark)',
  },
  '--dsw-alias-markdown-citation': {
    light: 'var(--glass-solid-light)',
    dark: 'var(--glass-solid-dark)',
  },
  '--dsw-alias-markdown-placeholder': {
    light: 'var(--glass-solid-light)',
    dark: 'var(--glass-solid-dark)',
  },
  // multi-file code blocks: the selected tab keeps the solid plate, the
  // unselected one drops to the panel value so the pair stays distinguishable
  '--dsw-alias-markdown-code-segment-selected': {
    light: 'var(--glass-solid-light)',
    dark: 'var(--glass-solid-dark)',
  },
  '--dsw-alias-markdown-code-segment-unselected': {
    light: 'var(--glass-surface-light)',
    dark: 'var(--glass-surface-dark)',
  },
  // The dialog and settings backdrop ships as `none`, so their translucent
  // panel sits on sharp, un-blurred content — the one place where the glass
  // technique has no blur at all. Blurring the mask is what makes a dialog read
  // as frosted glass; it follows the blur slider.
  '--dsw-mask-blur': {
    light: 'blur(var(--glass-blur))',
    dark: 'blur(var(--glass-blur))',
  },
  // Dimmed text ramps assume an opaque surface underneath. Over a wallpaper
  // they lose too much contrast, so the two weakest steps move one step up the
  // shipped palette (caption takes tertiary's value, tertiary takes
  // secondary's): the hierarchy is preserved, only its floor rises.
  '--dsw-alias-label-caption': {
    light: 'var(--dsw-static-neutral-bluish-600)',
    dark: 'var(--dsw-static-neutral-bluish-400)',
  },
  '--dsw-alias-label-tertiary': {
    light: 'var(--dsw-static-neutral-bluish-700)',
    dark: 'var(--dsw-static-neutral-bluish-300)',
  },
}

export function apply(ctx: GlassClientContext): void {
  // shared engine: the settings panel applies live previews through it
  const engine = new GlassEngine()

  // 1) translucent surface tokens
  ctx.effect(() => ctx.theme.overrideTokens(NS, GLASS_TOKENS), 'dsh-glass-ui: surface tokens')

  // 2) engine: loads the saved config (or defaults) and applies it
  ctx.effect(() => {
    let disposed = false
    void loadConfig()
      .then((config) => {
        if (disposed) return // fiber torn down while the fetch was in flight
        initLyricPos(config.lyricPos)
          setMediaDisplayEnabled(config.mediaDisplay)
        engine.apply(config)
      })
      .catch(() => {
        if (!disposed) engine.apply({ ...DEFAULT_CONFIG } as GlassConfig)
          if (!disposed) setMediaDisplayEnabled(true)
      })
    return () => {
      disposed = true
      engine.dispose()
    }
  }, 'dsh-glass-ui: glass engine')

  // 3) dictionaries + settings section
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'dsh-glass-ui: dictionaries')
  const t = ctx.locale.bind(NS)

  // 3.5) tag the composer dock row first: the player pill mounts into it
  ctx.effect(() => mountDockPlate(), 'dsh-glass-ui: dock plate')

  // 3.6) now-playing pill, inline in that row (no floating card over content)
  ctx.effect(() => mountMusicControls(t), 'dsh-glass-ui: music controls')

  // 4) lyric line in the composer dock, level with the stats row
  ctx.slots.inject('conversation.composer.dock', () => ctx.slots.register({
    name: 'conversation.composer.dock',
    id: 'dsh-glass-lyrics',
    order: 5,
    locale: NS,
  }, () => h(LyricsLine)))

  ctx.slots.inject('settings.section', () => ctx.slots.register({
    name: 'settings.section',
    id: 'glass-ui',
    order: 80,
    label: () => t('nav'),
    locale: NS,
    inject: () => ({ t }),
  }, () => h(GlassPanel, { t, engine })))
}
