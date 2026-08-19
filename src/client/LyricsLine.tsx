/**
 * The lyric line rendered in the composer dock, level with the stats row.
 * The slot renderer injects a `t` bound to this entry's locale namespace
 * (registered via `locale: NS`); it is optional here only for type safety.
 */
import { useSyncExternalStore } from 'react'
import {
  getLyricPos,
  playback,
  subscribeLyricPos,
} from './lyrics.ts'
import type { Translate } from './locales.ts'
import styles from './LyricsLine.module.css'

export interface LyricsLineProps {
  t?: Translate
}

export function LyricsLine({ t }: LyricsLineProps): JSX.Element | null {
  const state = useSyncExternalStore(playback.subscribe, playback.getSnapshot)
  const pos = useSyncExternalStore(subscribeLyricPos, getLyricPos)

  if (pos === 'hidden') return null
  if (state.song === null) return null

  const title = `${state.song.name} - ${state.song.artists || (t !== undefined ? t('lyricUnknownArtist') : '未知歌手')}`
  const line = state.loading
    ? (t !== undefined ? t('lyricLoading') : '加载中…')
    : state.error !== null
      ? (t !== undefined ? t(state.error) : '该歌曲暂不可播放（版权/VIP 限制）')
      : state.currentLine !== null
        ? state.currentLine.text
        : state.playing
          ? '♪'
          : (t !== undefined ? t('lyricPaused') : '已暂停')

  return (
    <span
      className={styles.root}
      data-pos={pos}
      title={`${title}\n${line}`}
    >
      <span className={styles.icon}>{state.playing ? '♪' : '⏸'}</span>
      <span className={styles.title}>{title}</span>
      <span className={styles.sep}>·</span>
      <span className={styles.line}>{line}</span>
    </span>
  )
}
