/** Playback manager + LRC parser + lyric-position store. */
import {
  fetchLyric,
  fetchPublicSongUrl,
  fetchSongUrl,
  type NeteaseSong,
} from './netease.ts'

// ---------------------------------------------------------------------------
// LRC parsing
// ---------------------------------------------------------------------------

export interface LyricLine {
  /** seconds */
  time: number
  text: string
}

const LRC_TAG = /\[(\d{1,2}):(\d{1,2})(?:[.:](\d{1,3}))?\]/g

/** One timestamp tag → seconds (e.g. `[1:02.5]` → 62.5). */
function tagToSeconds(tag: RegExpExecArray): number {
  const minutes = Number(tag[1] ?? 0)
  const seconds = Number(tag[2] ?? 0)
  const fracRaw = tag[3]
  const frac = fracRaw === undefined ? 0 : Number(fracRaw.padEnd(3, '0')) / 1000
  return minutes * 60 + seconds + frac
}

/**
 * Parse LRC into timed lines. Handles repeated timestamps on one line
 * (`[00:10][00:20]歌词` → two lines at 10s and 20s) and skips pure metadata
 * lines (no timestamp tags, e.g. `[ti:...]` / `[ar:...]`).
 */
export function parseLrc(lrc: string): LyricLine[] {
  const lines: LyricLine[] = []
  for (const raw of lrc.split('\n')) {
    LRC_TAG.lastIndex = 0
    const text = raw.replace(LRC_TAG, '').trim()
    if (text === '') continue
    let tag: RegExpExecArray | null
    while ((tag = LRC_TAG.exec(raw)) !== null) {
      lines.push({ time: tagToSeconds(tag), text })
    }
  }
  lines.sort((a, b) => a.time - b.time)
  return lines
}

/** The lyric line active at `time` (or null before the first line). */
export function lineAtTime(lines: LyricLine[], time: number): LyricLine | null {
  let current: LyricLine | null = null
  for (const line of lines) {
    if (line.time > time) break
    current = line
  }
  return current
}

// ---------------------------------------------------------------------------
// playback manager
// ---------------------------------------------------------------------------

export interface PlaybackState {
  song: NeteaseSong | null
  playing: boolean
  /** seconds */
  time: number
  /** seconds */
  duration: number
  currentLine: LyricLine | null
  lyrics: LyricLine[]
  /** locale message key when the stream is unavailable (VIP etc.); null = ok */
  error: string | null
  loading: boolean
  /** audio volume, 0..1 */
  volume: number
  /** current playback queue */
  queue: NeteaseSong[]
  /** index of the current song in queue */
  queueIndex: number
}

/** Locale key for "this song cannot be played (VIP/licensing)". */
export const PLAYBACK_ERROR_KEY = 'lyricUnavailable'

const EMPTY: PlaybackState = {
  song: null,
  playing: false,
  time: 0,
  duration: 0,
  currentLine: null,
  lyrics: [],
  error: null,
  loading: false,
  volume: 1,
  queue: [],
  queueIndex: -1,
}

type Listener = () => void

class PlaybackManager {
  private audio = new Audio()
  private song: NeteaseSong | null = null
  private lyrics: LyricLine[] = []
  private queue: NeteaseSong[] = []
  private queueIndex = -1
  private state: PlaybackState = { ...EMPTY }
  private listeners = new Set<Listener>()
  /** monotonically increasing play request id — stale async results are dropped */
  private playSeq = 0

  constructor() {
    this.audio.preload = 'auto'
      this.audio.volume = 1
      this.audio.volume = 1
    this.audio.addEventListener('timeupdate', () => this.sync())
    this.audio.addEventListener('loadedmetadata', () => this.sync())
    this.audio.addEventListener('play', () => this.sync())
    this.audio.addEventListener('pause', () => this.sync())
    this.audio.addEventListener('ended', () => {
      this.sync()
      this.playNext()
    })
    this.audio.addEventListener('error', () => {
      this.state = { ...this.state, playing: false, error: PLAYBACK_ERROR_KEY }
      this.emit()
    })
  }

  getSnapshot = (): PlaybackState => this.state

  subscribe = (listener: Listener): (() => void) => {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  private emit(): void {
    for (const listener of this.listeners) listener()
  }

  private sync(): void {
    this.state = {
      ...this.state,
      playing: !this.audio.paused,
      time: this.audio.currentTime,
      duration: Number.isFinite(this.audio.duration) ? this.audio.duration : 0,
      currentLine: lineAtTime(this.lyrics, this.audio.currentTime),
    }
    this.emit()
  }

  /** Load and play a song; fetch its stream URL and lyrics. */
  async play(song: NeteaseSong, queue?: NeteaseSong[]): Promise<void> {
    const seq = ++this.playSeq // supersede any in-flight play()
    if (queue !== undefined) {
      this.queue = queue
      this.queueIndex = queue.findIndex((s) => s.id === song.id)
    }
    this.state = {
        ...EMPTY,
        song,
        loading: true,
        volume: this.audio.volume,
        queue: this.queue,
        queueIndex: this.queueIndex,
      }
    this.emit()
    const [weapiUrl, lrc] = await Promise.all([
      fetchSongUrl(song.id),
      fetchLyric(song.id).catch(() => ''),
    ])
    if (seq !== this.playSeq) return // a newer play()/stop() superseded this one
    // weapi URL needs login; fall back to the public outer-url stream
    const url = weapiUrl ?? await fetchPublicSongUrl(song.id)
    if (seq !== this.playSeq) return
    if (url === null) {
      this.state = {
        ...EMPTY,
        song,
        error: PLAYBACK_ERROR_KEY,
          volume: this.audio.volume,
          queue: this.queue,
          queueIndex: this.queueIndex,
      }
      this.emit()
      return
    }
    this.lyrics = parseLrc(lrc)
    this.song = song
    this.audio.src = url
    this.state = { ...this.state, loading: false, lyrics: this.lyrics }
    this.emit()
    try {
      await this.audio.play()
    } catch {
      if (seq !== this.playSeq) return
      this.state = { ...this.state, playing: false }
      this.emit()
    }
  }

  /** Auto-advance to the next song in the queue when one finishes. */
  private playNext(): void {
    if (this.queue.length === 0 || this.queueIndex < 0 || this.queueIndex >= this.queue.length - 1) {
      return
    }
    this.queueIndex += 1
    const next = this.queue[this.queueIndex]
    if (next !== undefined) void this.play(next)
  }

  toggle(): void {
    if (this.song === null) return
    if (this.audio.paused) {
      void this.audio.play().catch(() => undefined)
    } else {
      this.audio.pause()
    }
  }

    /** Set audio volume (0..1). */
    setVolume(volume: number): void {
      const next = Number.isFinite(volume) ? Math.min(1, Math.max(0, volume)) : this.audio.volume
      if (next === this.audio.volume) return
      this.audio.volume = next
      this.state = { ...this.state, volume: next }
      this.emit()
    }

    /** Seek to a playback position in seconds. */
    seek(time: number): void {
      if (!Number.isFinite(time)) return
      const max = Number.isFinite(this.audio.duration) ? this.audio.duration : time
      this.audio.currentTime = Math.min(Math.max(0, time), max)
      this.sync()
    }

    /** Play the next track in the current queue, if any. */
    next(): void {
      if (this.queue.length === 0 || this.queueIndex < 0 || this.queueIndex >= this.queue.length - 1) {
        return
      }
      this.queueIndex += 1
      const next = this.queue[this.queueIndex]
      if (next !== undefined) void this.play(next)
    }

    /** Play the previous track, or restart the current one after 3s. */
    previous(): void {
      if (this.queue.length === 0 || this.queueIndex <= 0) {
        if (this.audio.currentTime > 3) {
          this.audio.currentTime = 0
          this.sync()
        }
        return
      }
      if (this.audio.currentTime > 3) {
        this.audio.currentTime = 0
        this.sync()
        return
      }
      this.queueIndex -= 1
      const prev = this.queue[this.queueIndex]
      if (prev !== undefined) void this.play(prev)
    }

  stop(): void {
    this.playSeq += 1 // cancel any in-flight play()
    this.audio.pause()
    this.audio.removeAttribute('src')
    this.audio.load()
    this.song = null
    this.lyrics = []
    this.queue = []
    this.queueIndex = -1
    this.state = { ...EMPTY, volume: this.audio.volume }
    this.emit()
  }
}

export const playback = new PlaybackManager()

// ---------------------------------------------------------------------------
// lyric position store (settings-panel ↔ dock line)
// ---------------------------------------------------------------------------

export type LyricPos = 'inline' | 'end' | 'hidden'

const DEFAULT_POS: LyricPos = 'inline'
let lyricPos: LyricPos = DEFAULT_POS
const posListeners = new Set<() => void>()

export function getLyricPos(): LyricPos {
  return lyricPos
}

export function setLyricPos(pos: LyricPos): void {
  if (pos === lyricPos) return
  lyricPos = pos
  for (const listener of posListeners) listener()
}

export function subscribeLyricPos(listener: () => void): () => void {
  posListeners.add(listener)
  return () => posListeners.delete(listener)
}

export function initLyricPos(saved: LyricPos | undefined): void {
  if (saved === 'inline' || saved === 'end' || saved === 'hidden') {
    lyricPos = saved
  }
}
