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
import { mountMusicControls } from './musicControls.ts'

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
  '--dsw-alias-bg-layer-1': {
    light: 'var(--glass-surface-light)',
    dark: 'var(--glass-surface-dark)',
  },
  '--dsw-alias-bg-layer-2': {
    light: 'var(--glass-surface-light)',
    dark: 'var(--glass-surface-dark)',
  },
  '--dsw-alias-bg-layer-3': {
    light: 'var(--glass-surface-light)',
    dark: 'var(--glass-surface-dark)',
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
        engine.apply(config)
      })
      .catch(() => {
        if (!disposed) engine.apply({ ...DEFAULT_CONFIG } as GlassConfig)
      })
    return () => {
      disposed = true
      engine.dispose()
    }
  }, 'dsh-glass-ui: glass engine')

  // 3) dictionaries + settings section
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'dsh-glass-ui: dictionaries')
  const t = ctx.locale.bind(NS)

  // 3.5) compact music controls beside the settings button
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
