/**
 * Lightweight DOM music controls that sit below the session-log button.
 *
 * We intentionally keep this outside React: the DSH slot API does not expose a
 * dedicated slot for this position in every version, so this mounts a small
 * player card near the session-log trigger (or as a fixed bottom-left fallback
 * while the trigger is still mounting).
 */
import { playback, type PlaybackState } from './lyrics.ts'
import type { Translate } from './locales.ts'

const CONTAINER_CLASS = 'dsh-glass-music-controls'
const FIXED_CLASS = 'dsh-glass-music-controls--fixed'

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


function findSessionLogButton(): HTMLElement | null {
  const selectors = [
    'button[aria-label="Session log"]',
    'button[aria-label="Session Log"]',
    'button[aria-label="session log"]',
    'button[aria-label*="session log"]',
    'button[aria-label*="Session Log"]',
    'button[aria-label="会话日志"]',
    'button[aria-label*="会话日志"]',
    'button[title="Session log"]',
    'button[title="Session Log"]',
    'button[title*="session log"]',
    'button[title*="Session Log"]',
    'button[title="会话日志"]',
    'button[title*="会话日志"]',
    '[data-testid="session-log"]',
    '[data-testid="session_log"]',
    '.session-log',
  ]
  for (const selector of selectors) {
    const el = document.querySelector<HTMLElement>(selector)
    if (el !== null) return el
  }
  // Last resort: scan buttons / role=button elements by their visible text.
  const candidates = Array.from(document.querySelectorAll<HTMLElement>('button, [role="button"]'))
  return candidates.find((el) => {
    const text = (el.textContent ?? '').toLowerCase()
    return text.includes('session log') || text.includes('会话日志') || text.includes('会话记录')
  }) ?? null
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
  container.append(coverWrap, progressWrap, controls)

  const disposers: Array<() => void> = []
  let mediaEnabled = getMediaDisplayEnabled()

  const update = (): void => {
    const snap: PlaybackState = playback.getSnapshot()
    const visible = snap.song !== null
    container.style.display = visible && mediaEnabled ? 'flex' : 'none'

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

  const tryAttach = (): boolean => {
    const sessionLog = findSessionLogButton()
    if (sessionLog === null) return false
    const rect = sessionLog.getBoundingClientRect()
      container.style.position = 'fixed'
      container.style.top = `${rect.bottom + 30}px`
      const cardWidth = container.offsetWidth || 180
      const maxLeft = window.innerWidth - cardWidth - 8
      container.style.left = `${Math.max(8, Math.min(rect.left, maxLeft))}px`
      container.style.zIndex = '1000'
      if (container.parentElement !== document.body) document.body.appendChild(container)
    container.classList.add(FIXED_CLASS)
    return true
  }

  if (!tryAttach()) {
    document.body.appendChild(container)
      container.style.position = 'fixed'
      container.style.top = '56px'
      container.style.left = '12px'
      container.style.zIndex = '1000'
    container.classList.add(FIXED_CLASS)
    const retryTimer = window.setInterval(() => {
      if (tryAttach()) window.clearInterval(retryTimer)
    }, 500)
    const timeout = window.setTimeout(() => window.clearInterval(retryTimer), 10000)
    disposers.push(() => {
      window.clearInterval(retryTimer)
      window.clearTimeout(timeout)
    })
  }

    // Reposition the floating card on scroll/resize without touching the top bar.
    const reposition = (): void => {
      if (!tryAttach()) {
        document.body.appendChild(container)
          container.style.position = 'fixed'
          container.style.top = '56px'
          container.style.left = '12px'
          container.style.zIndex = '1000'
        container.classList.add(FIXED_CLASS)
      }
    }
    window.addEventListener('scroll', reposition, true)
    window.addEventListener('resize', reposition)
    disposers.push(() => {
      window.removeEventListener('scroll', reposition, true)
      window.removeEventListener('resize', reposition)
    })

  // React may re-render the sidebar and drop our foreign DOM node; reattach it
  // if that happens while the plugin is still active.
  const keepAlive = window.setInterval(() => {
    if (!container.isConnected) {
      if (!tryAttach()) {
        document.body.appendChild(container)
            container.style.position = 'fixed'
            container.style.top = '56px'
            container.style.left = '12px'
            container.style.zIndex = '1000'
        container.classList.add(FIXED_CLASS)
      }
    }
  }, 2000)
  disposers.push(() => window.clearInterval(keepAlive))

  update()

  return () => {
    for (const dispose of disposers.splice(0)) dispose()
    container.remove()
  }
}
