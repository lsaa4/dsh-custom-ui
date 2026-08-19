/** The "UI Design" settings section: tune the glass look in real time. */
import { useEffect, useRef, useState } from 'react'
import type { RefObject } from 'react'
import { Button, Input, Pill, Toast } from '@deepseek-ai/dsh-client-ui-primitives'
import { CUSTOM_FONT_FAMILY, type GlassEngine } from './engine.ts'
import {
  DEFAULT_CONFIG,
  deleteMedia,
  loadConfig,
  normalizeConfig,
  saveConfig,
  uploadMedia,
  type BgFit,
  type BgType,
  type GlassConfig,
} from './config.ts'
import { FONT_PRESETS, type Translate } from './locales.ts'
import styles from './GlassPanel.module.css'
import { NeteasePanel } from './NeteasePanel.tsx'
import { setLyricPos, type LyricPos } from './lyrics.ts'

export interface GlassPanelProps {
  t: Translate
  engine: GlassEngine
}

type SaveState = 'idle' | 'saving' | 'saved' | 'fail'

const BG_TYPES: ReadonlyArray<{ id: BgType; labelKey: string }> = [
  { id: 'none', labelKey: 'bgNone' },
  { id: 'image', labelKey: 'bgImage' },
  { id: 'video', labelKey: 'bgVideo' },
]

const BG_FITS: ReadonlyArray<{ id: BgFit; labelKey: string }> = [
  { id: 'cover', labelKey: 'fitCover' },
  { id: 'contain', labelKey: 'fitContain' },
  { id: 'original', labelKey: 'fitOriginal' },
]

const ANIM_LEVELS: ReadonlyArray<{ id: GlassConfig['animLevel']; labelKey: string }> = [
  { id: 'none', labelKey: 'animNone' },
  { id: 'soft', labelKey: 'animSoft' },
  { id: 'strong', labelKey: 'animStrong' },
]

function mediaName(url: string): string {
  const name = url.split('/').pop() ?? url
  return name.length > 36 ? `${name.slice(0, 33)}…` : name
}

export function GlassPanel({ t, engine }: GlassPanelProps): JSX.Element {
  const [config, setConfig] = useState<GlassConfig>({ ...DEFAULT_CONFIG })
  const [saveState, setSaveState] = useState<SaveState>('idle')
  const [uploading, setUploading] = useState<BgType | 'font' | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const saveTimer = useRef<number | undefined>(undefined)
  /** monotonically increasing save id — a stale save response must not
   *  overwrite newer local edits (the debounce only gates the request). */
  const saveSeq = useRef(0)
  const imageInput = useRef<HTMLInputElement>(null)
  const videoInput = useRef<HTMLInputElement>(null)
  const fontInput = useRef<HTMLInputElement>(null)
  const importInput = useRef<HTMLInputElement>(null)

  useEffect(() => {
    let cancelled = false
    void loadConfig()
      .then((cfg) => {
        if (cancelled) return
        setConfig(cfg)
        engine.apply(cfg)
      })
      .catch(() => {
        if (cancelled) return
        engine.apply({ ...DEFAULT_CONFIG })
      })
    return () => {
      cancelled = true
      window.clearTimeout(saveTimer.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /** Apply a change immediately, persist it debounced. */
  function update(next: GlassConfig): void {
    setConfig(next)
    engine.apply(next)
    setSaveState('saving')
    window.clearTimeout(saveTimer.current)
    const seq = ++saveSeq.current
    saveTimer.current = window.setTimeout(() => {
      saveConfig(next)
        .then((saved) => {
          if (seq !== saveSeq.current) return // a newer edit landed meanwhile
          setConfig(saved)
        })
        .then(() => {
          if (seq !== saveSeq.current) return
          setSaveState('saved')
        })
        .catch((err: unknown) => {
          if (seq !== saveSeq.current) return
          setSaveState('fail')
          setToast(t('saveFail', { error: err instanceof Error ? err.message : String(err) }))
        })
    }, 600)
  }

  async function onUpload(file: File, kind: 'image' | 'video' | 'font'): Promise<void> {
    setUploading(kind)
    try {
      const { url } = await uploadMedia(file, kind)
      if (kind === 'font') {
        update({ ...config, fontUrl: url, font: `'${CUSTOM_FONT_FAMILY}', sans-serif` })
      } else if (kind === 'image') {
        // append to the carousel list and make it the current slide
        const bgImages = config.bgImages.includes(url)
          ? config.bgImages
          : [...config.bgImages, url]
        update({ ...config, bgType: 'image', bgImage: url, bgImages, bgVideo: '' })
      } else {
        // keep the image list — switching to a video wallpaper must not
        // destroy the user's uploaded image collection
        update({ ...config, bgType: 'video', bgVideo: url })
      }
    } catch (err) {
      setToast(t('uploadFail', { error: err instanceof Error ? err.message : String(err) }))
    } finally {
      setUploading(null)
    }
  }

  function pickFile(
    ref: RefObject<HTMLInputElement>,
    kind: 'image' | 'video' | 'font',
  ): void {
    const input = ref.current
    if (input === null) return
    input.accept =
      kind === 'image'
        ? 'image/jpeg,image/png,image/webp,image/gif,image/avif'
        : kind === 'video'
          ? 'video/mp4,video/webm,video/quicktime'
          : 'font/woff2,font/woff,font/ttf,font/otf,.woff2,.woff,.ttf,.otf'
    input.onchange = () => {
      const file = input.files?.[0]
      if (file !== undefined) void onUpload(file, kind)
      input.value = ''
    }
    input.click()
  }

  async function removeImage(url: string): Promise<void> {
    const bgImages = config.bgImages.filter((u) => u !== url)
    const next: GlassConfig = {
      ...config,
      bgImages,
      bgImage: bgImages[0] ?? '',
    }
    if (next.bgImage === '') next.bgType = 'none'
    try {
      await deleteMedia(url)
    } catch {
      /* media may already be gone */
    }
    update(next)
  }

  async function removeBackground(): Promise<void> {
    const next = { ...config, bgType: 'none' as BgType }
    const urls = [...config.bgImages, config.bgVideo].filter((u) => u !== '')
    for (const url of urls) {
      try {
        await deleteMedia(url)
      } catch {
        /* media may already be gone */
      }
    }
    next.bgImage = ''
    next.bgImages = []
    next.bgVideo = ''
    update(next)
  }

  async function removeFont(): Promise<void> {
    if (config.fontUrl !== '') {
      try {
        await deleteMedia(config.fontUrl)
      } catch {
        /* already gone */
      }
    }
    update({ ...config, fontUrl: '', font: '' })
  }

  function reset(): void {
    window.clearTimeout(saveTimer.current)
    const next = { ...DEFAULT_CONFIG }
    setLyricPos(next.lyricPos)
    void saveConfig(next)
      .then(() => {
        setConfig(next)
        engine.apply(next)
        setSaveState('saved')
        setToast(t('resetDone'))
      })
      .catch((err: unknown) => {
        setToast(t('saveFail', { error: err instanceof Error ? err.message : String(err) }))
      })
  }

  function exportConfig(): void {
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'dsh-glass-ui-config.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  async function onImportFile(file: File): Promise<void> {
    try {
      const parsed = JSON.parse(await file.text()) as Partial<GlassConfig>
      const next = normalizeConfig(parsed)
      setLyricPos(next.lyricPos)
      await saveConfig(next)
      setConfig(next)
      engine.apply(next)
      setSaveState('saved')
      setToast(t('importDone'))
    } catch (err) {
      setToast(t('importFail', { error: err instanceof Error ? err.message : String(err) }))
    }
  }

  const hasBg = config.bgImage !== '' || config.bgVideo !== ''

  return (
    <div className={styles.panel}>
      {/* ---- glass strength ---- */}
      <section className={styles.card}>
        <h3 className={styles.cardTitle}>{t('glassTitle')}</h3>
        <div className={styles.field}>
          <div className={styles.fieldHead}>
            <span>{t('opacityLabel')}</span>
            <span className={styles.value}>{Math.round(config.opacity * 100)}%</span>
          </div>
          <input
            type="range"
            className={styles.range}
            min={10}
            max={95}
            value={Math.round(config.opacity * 100)}
            onChange={(e) => update({ ...config, opacity: Number(e.target.value) / 100 })}
          />
          <p className={styles.hint}>{t('opacityHint')}</p>
        </div>
        <div className={styles.field}>
          <div className={styles.fieldHead}>
            <span>{t('blurLabel')}</span>
            <span className={styles.value}>{config.blur}px</span>
          </div>
          <input
            type="range"
            className={styles.range}
            min={4}
            max={40}
            value={config.blur}
            onChange={(e) => update({ ...config, blur: Number(e.target.value) })}
          />
          <p className={styles.hint}>{t('blurHint')}</p>
        </div>
      </section>

      {/* ---- font ---- */}
      <section className={styles.card}>
        <h3 className={styles.cardTitle}>{t('fontTitle')}</h3>
        <div className={styles.pills}>
          {FONT_PRESETS.map((preset) => (
            <Pill
              key={preset.label}
              active={config.font === preset.id}
              onClick={() => update({ ...config, font: preset.id })}
            >
              {preset.label}
            </Pill>
          ))}
        </div>
        <div className={styles.row}>
          <Input
            className={styles.grow}
            placeholder={t('fontCustomPlaceholder')}
            value={config.font.includes(CUSTOM_FONT_FAMILY) ? '' : config.font.replaceAll("'", '')}
            onChange={(e) => update({ ...config, font: e.target.value.trim() })}
          />
          <Button
            size="sm"
            variant="outline"
            disabled={uploading === 'font'}
            onClick={() => pickFile(fontInput, 'font')}
          >
            {uploading === 'font' ? t('fontUploading') : t('fontUpload')}
          </Button>
        </div>
        {config.fontUrl !== '' && (
          <div className={styles.row}>
            <span className={styles.fileName}>
              {t('fontUploaded', { name: mediaName(config.fontUrl) })}
            </span>
            <Button size="sm" variant="ghost" onClick={() => void removeFont()}>
              {t('fontRemove')}
            </Button>
          </div>
        )}
        <input ref={fontInput} type="file" hidden />
      </section>

      {/* ---- wallpaper ---- */}
      <section className={styles.card}>
        <h3 className={styles.cardTitle}>{t('bgTitle')}</h3>
        <div className={styles.pills}>
          {BG_TYPES.map((type) => (
            <Pill
              key={type.id}
              active={config.bgType === type.id}
              onClick={() => update({ ...config, bgType: type.id })}
            >
              {t(type.labelKey)}
            </Pill>
          ))}
        </div>
        <div className={styles.row}>
          <Button
            size="sm"
            variant="outline"
            disabled={uploading === 'image'}
            onClick={() => pickFile(imageInput, 'image')}
          >
            {uploading === 'image' ? t('fontUploading') : t('bgUploadImage')}
          </Button>
          <Button
            size="sm"
            variant="outline"
            disabled={uploading === 'video'}
            onClick={() => pickFile(videoInput, 'video')}
          >
            {uploading === 'video' ? t('fontUploading') : t('bgUploadVideo')}
          </Button>
          {hasBg && (
            <Button size="sm" variant="ghost" onClick={() => void removeBackground()}>
              {t('bgRemove')}
            </Button>
          )}
        </div>
        <p className={styles.hint}>{t('bgTypeHint')}</p>
        <input ref={imageInput} type="file" hidden />
        <input ref={videoInput} type="file" hidden />

        {/* dim + fit + carousel */}
        <div className={styles.field}>
          <div className={styles.fieldHead}>
            <span>{t('maskLabel')}</span>
            <span className={styles.value}>{Math.round(config.bgMask * 100)}%</span>
          </div>
          <input
            type="range"
            className={styles.range}
            min={0}
            max={70}
            value={Math.round(config.bgMask * 100)}
            onChange={(e) => update({ ...config, bgMask: Number(e.target.value) / 100 })}
          />
          <p className={styles.hint}>{t('maskHint')}</p>
        </div>
        <div className={styles.field}>
          <span className={styles.fieldLabel}>{t('fitLabel')}</span>
          <div className={styles.pills}>
            {BG_FITS.map((fit) => (
              <Pill
                key={fit.id}
                active={config.bgFit === fit.id}
                onClick={() => update({ ...config, bgFit: fit.id })}
              >
                {t(fit.labelKey)}
              </Pill>
            ))}
          </div>
        </div>
        <label className={styles.toggleRow}>
          <input
            type="checkbox"
            checked={config.bgRotate}
            onChange={(e) => update({ ...config, bgRotate: e.target.checked })}
          />
          <span>{t('rotateLabel')}</span>
          <span className={styles.hint}>{t('rotateHint')}</span>
        </label>
        {config.bgRotate && (
          <div className={styles.row}>
            <span className={styles.fieldLabel}>{t('rotateInterval')}</span>
            <Input
              className={styles.interval}
              type="number"
              min={5}
              max={300}
              value={String(config.bgRotateInterval)}
              onChange={(e) => {
                const n = Number(e.target.value)
                if (Number.isFinite(n) && n >= 5 && n <= 300) {
                  update({ ...config, bgRotateInterval: n })
                }
              }}
            />
          </div>
        )}
        {config.bgImages.length > 0 && (
          <div className={styles.field}>
            <span className={styles.fieldLabel}>{t('imagesLabel')}</span>
            <ul className={styles.imageList}>
              {config.bgImages.map((url) => (
                <li key={url} className={styles.imageRow}>
                  <button
                    type="button"
                    className={styles.imageName}
                    data-active={url === config.bgImage || undefined}
                    title={t('setCurrent')}
                    onClick={() =>
                      update({ ...config, bgType: 'image', bgImage: url, bgVideo: '' })
                    }
                  >
                    {mediaName(url)}
                    {url === config.bgImage && <em>{t('currentBadge')}</em>}
                  </button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => void removeImage(url)}
                  >
                    {t('removeImage')}
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* ---- motion ---- */}
      <section className={styles.card}>
        <h3 className={styles.cardTitle}>{t('animTitle')}</h3>
        <div className={styles.pills}>
          {ANIM_LEVELS.map((level) => (
            <Pill
              key={level.id}
              active={config.animLevel === level.id}
              onClick={() => update({ ...config, animLevel: level.id })}
            >
              {t(level.labelKey)}
            </Pill>
          ))}
        </div>
        <p className={styles.hint}>{t('animHint')}</p>
      </section>

      {/* ---- netease music ---- */}
      <NeteasePanel
        t={t}
        lyricPos={config.lyricPos}
        onLyricPos={(pos: LyricPos) => {
          // keep the live dock store in sync — otherwise the setting only
          // takes effect after a page reload (initLyricPos)
          setLyricPos(pos)
          update({ ...config, lyricPos: pos })
        }}
        neteaseProxy={config.neteaseProxy}
        onNeteaseProxy={(proxy: string) => update({ ...config, neteaseProxy: proxy })}
        neteaseApiBase={config.neteaseApiBase}
        onNeteaseApiBase={(base: string) => update({ ...config, neteaseApiBase: base })}
      />

      {/* ---- custom css ---- */}
      <section className={styles.card}>
        <h3 className={styles.cardTitle}>{t('customCssTitle')}</h3>
        <textarea
          className={styles.cssArea}
          placeholder={t('customCssPlaceholder')}
          spellCheck={false}
          value={config.customCss}
          onChange={(e) => update({ ...config, customCss: e.target.value })}
        />
        <p className={styles.hint}>{t('customCssHint')}</p>
      </section>

      {/* ---- share ---- */}
      <section className={styles.card}>
        <h3 className={styles.cardTitle}>{t('transferTitle')}</h3>
        <div className={styles.row}>
          <Button variant="outline" onClick={exportConfig}>
            {t('exportButton')}
          </Button>
          <Button variant="outline" onClick={() => importInput.current?.click()}>
            {t('importButton')}
          </Button>
          <Button variant="outline" onClick={() => void reset()}>
            {t('resetButton')}
          </Button>
          <span className={styles.saveState} data-state={saveState}>
            {saveState === 'saving' && t('saving')}
            {saveState === 'saved' && t('saved')}
            {saveState === 'fail' && t('saveFail', { error: '…' })}
          </span>
        </div>
        <input
          ref={importInput}
          type="file"
          accept="application/json,.json"
          hidden
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file !== undefined) void onImportFile(file)
            e.target.value = ''
          }}
        />
      </section>

      {toast !== null && <Toast text={toast} onDone={() => setToast(null)} />}
    </div>
  )
}
