/** The lyric line rendered in the composer dock, level with the stats row. */
import { useSyncExternalStore } from 'react'
import {
  getLyricPos,
  playback,
  subscribeLyricPos,
} from './lyrics.ts'
import styles from './LyricsLine.module.css'

export function LyricsLine(): JSX.Element | null {
  const state = useSyncExternalStore(playback.subscribe, playback.getSnapshot)
  const pos = useSyncExternalStore(subscribeLyricPos, getLyricPos)

  if (pos === 'hidden') return null
  if (state.song === null) return null

  const title = `${state.song.name} - ${state.song.artists || '未知歌手'}`
  const line = state.loading
    ? '加载中…'
    : state.error !== null
      ? state.error
      : state.currentLine !== null
        ? state.currentLine.text
        : state.playing
          ? '♪'
          : '已暂停'

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
