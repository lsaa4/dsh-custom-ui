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

const LRC_LINE = /\[(\d{1,2}):(\d{1,2})(?:[.:](\d{1,3}))?\]\s*(.*)/

export function parseLrc(lrc: string): LyricLine[] {
  const lines: LyricLine[] = []
  for (const raw of lrc.split('\n')) {
    const m = LRC_LINE.exec(raw.trim())
    if (m === null) continue
    const minutes = Number(m[1] ?? 0)
    const seconds = Number(m[2] ?? 0)
    const fracRaw = m[3]
    const frac = fracRaw === undefined ? 0 : Number(fracRaw.padEnd(3, '0')) / 1000
    const text = (m[4] ?? '').trim()
    if (text === '') continue
    lines.push({ time: minutes * 60 + seconds + frac, text })
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
  /** error message when the stream is unavailable (VIP etc.) */
  error: string | null
  loading: boolean
}

const EMPTY: PlaybackState = {
  song: null,
  playing: false,
  time: 0,
  duration: 0,
  currentLine: null,
  lyrics: [],
  error: null,
  loading: false,
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

  constructor() {
    this.audio.preload = 'auto'
    this.audio.addEventListener('timeupdate', () => this.sync())
    this.audio.addEventListener('loadedmetadata', () => this.sync())
    this.audio.addEventListener('play', () => this.sync())
    this.audio.addEventListener('pause', () => this.sync())
    this.audio.addEventListener('ended', () => {
      this.sync()
      this.playNext()
    })
    this.audio.addEventListener('error', () => {
      this.state = { ...this.state, playing: false, error: '该歌曲暂不可播放（版权/VIP 限制）' }
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
    if (queue !== undefined) {
      this.queue = queue
      this.queueIndex = queue.findIndex((s) => s.id === song.id)
    }
    this.state = { ...EMPTY, song, loading: true }
    this.emit()
    const [weapiUrl, lrc] = await Promise.all([
      fetchSongUrl(song.id),
      fetchLyric(song.id).catch(() => ''),
    ])
    // weapi URL needs login; fall back to the public outer-url stream
    const url = weapiUrl ?? await fetchPublicSongUrl(song.id)
    if (url === null) {
      this.state = {
        ...EMPTY,
        song,
        error: '该歌曲暂不可播放（VIP/版权限制）',
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

  stop(): void {
    this.audio.pause()
    this.audio.removeAttribute('src')
    this.audio.load()
    this.song = null
    this.lyrics = []
    this.queue = []
    this.queueIndex = -1
    this.state = { ...EMPTY }
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
