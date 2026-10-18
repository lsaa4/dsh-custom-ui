/**
 * Compact now-playing pill for the composer dock row.
 *
 * We intentionally keep this outside React: the DSH slot API does not expose a
 * dedicated slot for this position in every version, so this mounts a small
 * player into the dock row that dockPlate.ts tags (next to the lyric line and
 * the stats). It used to float over the session list, which covered the list.
 */
import { getLyricPos, playback, type PlaybackState } from './lyrics.ts'
import type { Translate } from './locales.ts'

const CONTAINER_CLASS = 'dsh-glass-music-controls'
/** The composer dock row, tagged by dockPlate.ts. */
const DOCK_ROW = '.dsh-glass-dock'

// Simple store so the NetEase settings panel can toggle the floating media card.
let mediaDisplayEnabled = true
const mediaDisplayListeners = new Set<() => void>()

export function setMediaDisplayEnabled(enabled: boolean): void {
  if (mediaDisplayEnabled === enabled) return
  mediaDisplayEnabled = enabled
  for (const listener of mediaDisplayListeners) listener()
}

export function getMediaDisplayEnabled(): boolean {
  return mediaDisplayEnabled
}

export function subscribeMediaDisplay(listener: () => void): () => void {
  mediaDisplayListeners.add(listener)
  return () => mediaDisplayListeners.delete(listener)
}


function createButton(label: string, title: string): HTMLButtonElement {
  const button = document.createElement('button')
  button.type = 'button'
  button.textContent = label
  button.title = title
  button.setAttribute('aria-label', title)
  return button
}

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00'
  const s = Math.floor(seconds)
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

/**
 * Mount the player card below the session-log button and return a disposer.
 * The card is visible whenever a song is loaded (playing or paused).
 */
export function mountMusicControls(t: Translate): () => void {
  const container = document.createElement('div')
  container.className = CONTAINER_CLASS
  container.style.display = 'none'

  // Cover
  const coverWrap = document.createElement('div')
  coverWrap.className = 'dsh-glass-music-cover'
  const coverPlaceholder = document.createElement('span')
  coverPlaceholder.className = 'dsh-glass-music-cover-placeholder'
  coverPlaceholder.textContent = '♪'
  const coverImg = document.createElement('img')
  coverImg.alt = ''
  coverImg.addEventListener('error', () => {
    coverImg.style.display = 'none'
    coverPlaceholder.style.display = 'flex'
  })
  coverWrap.append(coverImg, coverPlaceholder)

  // Song label; only shown when the dock's lyric line is hidden (otherwise the
  // lyric line right next to it already carries the name).
  const titleSpan = document.createElement('span')
  titleSpan.className = 'dsh-glass-music-title'
  titleSpan.style.display = 'none'

  // Progress
  const progressWrap = document.createElement('div')
  progressWrap.className = 'dsh-glass-music-progress'
  const progressInput = document.createElement('input')
  progressInput.type = 'range'
  progressInput.min = '0'
  progressInput.max = '1000'
  progressInput.step = '1'
  progressInput.value = '0'
  progressInput.setAttribute('aria-label', 'Progress')
  const timeWrap = document.createElement('div')
  timeWrap.className = 'dsh-glass-music-times'
  const currentTime = document.createElement('span')
  currentTime.className = 'dsh-glass-music-time-current'
  currentTime.textContent = '0:00'
  const totalTime = document.createElement('span')
  totalTime.className = 'dsh-glass-music-time-total'
  totalTime.textContent = '0:00'
  timeWrap.append(currentTime, totalTime)
  progressWrap.append(progressInput, timeWrap)

  // Controls
  const controls = document.createElement('div')
  controls.className = 'dsh-glass-music-buttons'
  const prevButton = createButton('⏮', t('prevTrack'))
  const toggleButton = createButton('⏸', t('lyricPause'))
  const nextButton = createButton('⏭', t('nextTrack'))

  const volumeWrap = document.createElement('label')
  volumeWrap.className = 'dsh-glass-volume'
  volumeWrap.title = t('volumeLabel')
  const volumeIcon = document.createElement('span')
  volumeIcon.textContent = '🔊'
  const volumeInput = document.createElement('input')
  volumeInput.type = 'range'
  volumeInput.min = '0'
  volumeInput.max = '1'
  volumeInput.step = '0.05'
  volumeInput.value = String(playback.getSnapshot().volume)
  volumeInput.setAttribute('aria-label', t('volumeLabel'))
  volumeWrap.append(volumeIcon, volumeInput)

  controls.append(prevButton, toggleButton, nextButton, volumeWrap)
  container.append(coverWrap, titleSpan, progressWrap, controls)

  const disposers: Array<() => void> = []
  let mediaEnabled = getMediaDisplayEnabled()

  const update = (): void => {
    const snap: PlaybackState = playback.getSnapshot()
    const visible = snap.song !== null
    container.style.display = visible && mediaEnabled ? 'inline-flex' : 'none'
    if (snap.song !== null) {
      const label = `${snap.song.name} - ${snap.song.artists}`
      container.title = label
      titleSpan.textContent = label
      // the dock's lyric line already shows this, so the pill's own label is
      // only needed when the lyric line is hidden
      titleSpan.style.display = getLyricPos() === 'hidden' ? '' : 'none'
    }

    const cover = snap.song?.cover ?? ''
    if (cover !== '') {
      coverImg.src = cover
      coverImg.style.display = 'block'
      coverPlaceholder.style.display = 'none'
    } else {
      coverImg.removeAttribute('src')
      coverImg.style.display = 'none'
      coverPlaceholder.style.display = 'flex'
    }

    const duration = Number.isFinite(snap.duration) ? snap.duration : 0
    const progress = duration > 0 ? Math.min(1000, Math.max(0, (snap.time / duration) * 1000)) : 0
    if (document.activeElement !== progressInput) {
      progressInput.value = String(Math.round(progress))
    }
    currentTime.textContent = formatTime(snap.time)
    totalTime.textContent = formatTime(duration)
    progressInput.disabled = duration <= 0

    toggleButton.textContent = snap.playing ? '⏸' : '▶'
    toggleButton.title = snap.playing ? t('lyricPause') : t('lyricPlay')
    toggleButton.setAttribute('aria-label', toggleButton.title)
    prevButton.disabled = !visible || snap.queueIndex <= 0
    nextButton.disabled = !visible || snap.queueIndex < 0 || snap.queueIndex >= snap.queue.length - 1
    if (document.activeElement !== volumeInput) {
      volumeInput.value = String(snap.volume)
    }
  }

  const unsub = playback.subscribe(update)
  disposers.push(unsub)
  const unsubMedia = subscribeMediaDisplay(() => {
    mediaEnabled = getMediaDisplayEnabled()
    update()
  })
  disposers.push(unsubMedia)

  prevButton.addEventListener('click', () => playback.previous())
  nextButton.addEventListener('click', () => playback.next())
  toggleButton.addEventListener('click', () => playback.toggle())
  volumeInput.addEventListener('input', () => playback.setVolume(Number(volumeInput.value)))
  progressInput.addEventListener('input', () => {
    const snap = playback.getSnapshot()
    const duration = Number.isFinite(snap.duration) ? snap.duration : 0
    if (duration > 0) {
      playback.seek((Number(progressInput.value) / 1000) * duration)
    }
  })

  /**
   * Put the pill in the composer dock row.
   *
   * The row is tagged by dockPlate.ts, so the pill is simply prepended into it
   * and inherits the row's layout: no fixed positioning, no covering the
   * session list. When there is no composer (settings-only views, no session)
   * there is nothing to attach to and the pill stays hidden rather than
   * floating over content.
   */
  const attach = (): boolean => {
    const dock = document.querySelector<HTMLElement>(DOCK_ROW)
    if (dock === null) return false
    // layout belongs to glass.css; clear whatever a previous version set inline
    container.style.position = ''
    container.style.top = ''
    container.style.left = ''
    container.style.zIndex = ''
    if (container.parentElement !== dock) dock.prepend(container)
    return true
  }

  attach()

  // React re-creates the composer subtree on session switches and the dock can
  // appear after the plugin does, so keep the node attached while active.
  const keepAlive = window.setInterval(() => {
    if (!container.isConnected && attach()) update()
  }, 1000)
  disposers.push(() => window.clearInterval(keepAlive))

  update()

  return () => {
    for (const dispose of disposers.splice(0)) dispose()
    container.remove()
  }
}
