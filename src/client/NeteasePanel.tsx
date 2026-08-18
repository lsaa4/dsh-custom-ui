import { useEffect, useRef, useState } from 'react'
import QRCode from 'qrcode/lib/browser.js'
import { Button, Input, Pill, Toast } from '@deepseek-ai/dsh-client-ui-primitives'
import {
  fetchDailySongs,
  fetchHotPlaylists,
  fetchPlaylistTracks,
  fetchPlaylists,
  getAccount,
  logout,
  pollQrLogin,
  requestQrKey,
  searchSongs,
  submitCookie,
  normalizeCookiePaste,
  type NeteaseAccount,
  type NeteasePlaylist,
  type NeteaseSong,
} from './netease.ts'
import { playback, type LyricPos } from './lyrics.ts'
import type { Translate } from './locales.ts'
import styles from './NeteasePanel.module.css'

export interface NeteasePanelProps {
  t: Translate
  lyricPos: LyricPos
  onLyricPos: (pos: LyricPos) => void
  neteaseProxy: string
  onNeteaseProxy: (proxy: string) => void
  neteaseApiBase: string
  onNeteaseApiBase: (base: string) => void
}

const LYRIC_POSITIONS: ReadonlyArray<{ id: LyricPos; labelKey: string }> = [
  { id: 'inline', labelKey: 'lyricPosInline' },
  { id: 'end', labelKey: 'lyricPosEnd' },
  { id: 'hidden', labelKey: 'lyricPosHidden' },
]

function fmtTime(ms: number | undefined): string {
  if (ms === undefined || !Number.isFinite(ms)) return ''
  const s = Math.floor(ms / 1000)
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

export function NeteasePanel({ t, lyricPos, onLyricPos, neteaseProxy, onNeteaseProxy, neteaseApiBase, onNeteaseApiBase }: NeteasePanelProps): JSX.Element {
  const [account, setAccount] = useState<NeteaseAccount | null | 'loading'>('loading')
  const [qrKey, setQrKey] = useState<string | null>(null)
  const [qrImg, setQrImg] = useState<string | null>(null)
  const [qrState, setQrState] = useState<string>('')
  const [polling, setPolling] = useState(false)
  const [playlists, setPlaylists] = useState<NeteasePlaylist[]>([])
  const [playlistId, setPlaylistId] = useState<number | null>(null)
  const [tracks, setTracks] = useState<NeteaseSong[]>([])
  const [daily, setDaily] = useState<NeteaseSong[] | null>(null)
  const [hotPlaylists, setHotPlaylists] = useState<NeteasePlaylist[]>([])
  const [hotTracks, setHotTracks] = useState<NeteaseSong[] | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<NeteaseSong[] | null>(null)
  const [busy, setBusy] = useState(false)
  const [cookieInput, setCookieInput] = useState('')
  const [toast, setToast] = useState<string | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pollTimer = useRef<number | undefined>(undefined)

  // current playback (for the small control row)
  const [playing, setPlaying] = useState(false)
  const [currentSongId, setCurrentSongId] = useState<number | null>(null)
  useEffect(() => {
    const unsub = playback.subscribe(() => {
      const snap = playback.getSnapshot()
      setPlaying(snap.playing)
      setCurrentSongId(snap.song?.id ?? null)
    })
    return unsub
  }, [])

  useEffect(() => {
    let cancelled = false
    // hot playlists work without login (public API fallback)
    void fetchHotPlaylists().then((list) => {
      if (!cancelled) setHotPlaylists(list)
    }).catch(() => undefined)
    void getAccount().then((acc) => {
      if (cancelled) return
      setAccount(acc)
      if (acc.loggedIn && acc.uid !== undefined) {
        void fetchPlaylists(acc.uid).then((list) => {
          if (!cancelled) setPlaylists(list)
        })
      }
    })
    return () => {
      cancelled = true
      if (pollTimer.current !== undefined) window.clearInterval(pollTimer.current)
    }
  }, [])

  async function startQrLogin(): Promise<void> {
    try {
      setBusy(true)
      setQrState(t('lyricQrLoading'))
      const { key, qrimg } = await requestQrKey()
      setQrKey(key)
      setQrImg(qrimg ?? null)
      if (qrimg === undefined || qrimg === '') {
        // remote server gave no image — render locally as fallback
        const canvas = canvasRef.current
        if (canvas !== null) {
          await QRCode.toCanvas(canvas, `https://music.163.com/login?codekey=${key}`, {
            width: 168,
            margin: 1,
          })
        }
      }
      setQrState(t('lyricQrScan'))
      setPolling(true)
      if (pollTimer.current !== undefined) window.clearInterval(pollTimer.current)
      pollTimer.current = window.setInterval(async () => {
        try {
          const status = await pollQrLogin(key)
          if (status.code === 803) {
            if (pollTimer.current !== undefined) window.clearInterval(pollTimer.current)
            setPolling(false)
            setQrKey(null)
            const acc: NeteaseAccount = {
              loggedIn: true,
              nickname: status.nickname,
            }
            setAccount(acc)
            setToast(t('lyricLoginOk', { name: status.nickname ?? '' }))
            if (acc.uid === undefined) {
              const fresh = await getAccount()
              setAccount(fresh)
              if (fresh.uid !== undefined) {
                void fetchPlaylists(fresh.uid).then(setPlaylists)
              }
            }
          } else if (status.code === 802) {
            setQrState(t('lyricQrConfirm'))
          } else if (status.code === 800) {
            setQrState(t('lyricQrExpired'))
            setPolling(false)
            if (pollTimer.current !== undefined) window.clearInterval(pollTimer.current)
          }
        } catch {
          /* keep polling */
        }
      }, 2000)
    } catch (err) {
      setToast(t('lyricQrFail', { error: err instanceof Error ? err.message : String(err) }))
    } finally {
      setBusy(false)
    }
  }

  function cancelQr(): void {
    if (pollTimer.current !== undefined) window.clearInterval(pollTimer.current)
    setPolling(false)
    setQrKey(null)
  }

  async function doCookieLogin(): Promise<void> {
    // tolerate multi-line pastes and missing '=' separators (normalize repairs)
    const cookie = normalizeCookiePaste(cookieInput)
    if (cookie === '') return
    setBusy(true)
    try {
      const result = await submitCookie(cookie)
      if (result.ok) {
        const acc: NeteaseAccount = { loggedIn: true, nickname: result.nickname, uid: result.uid }
        setAccount(acc)
        setCookieInput('')
        setToast(t('lyricLoginOk', { name: result.nickname ?? '' }))
        if (acc.uid !== undefined) {
          void fetchPlaylists(acc.uid).then(setPlaylists)
        }
      } else {
        setToast(t('lyricCookieRejected'))
      }
    } catch (err) {
      setToast(t('lyricCookieFail', { error: err instanceof Error ? err.message : String(err) }))
    } finally {
      setBusy(false)
    }
  }

  async function doLogout(): Promise<void> {
    await logout()
    setAccount({ loggedIn: false })
    setPlaylists([])
    setTracks([])
    setDaily(null)
  }

  async function openPlaylist(id: number): Promise<void> {
    setPlaylistId(id)
    setDaily(null)
    setBusy(true)
    try {
      setTracks(await fetchPlaylistTracks(id))
    } catch (err) {
      setToast(t('lyricListFail', { error: err instanceof Error ? err.message : String(err) }))
    } finally {
      setBusy(false)
    }
  }

  async function openDaily(): Promise<void> {
    setDaily(null)
    setPlaylistId(null)
    setHotTracks(null)
    setSearchResults(null)
    setBusy(true)
    try {
      setDaily(await fetchDailySongs())
    } catch (err) {
      setToast(t('lyricListFail', { error: err instanceof Error ? err.message : String(err) }))
    } finally {
      setBusy(false)
    }
  }

  async function openHotPlaylist(id: number): Promise<void> {
    setHotTracks(null)
    setDaily(null)
    setPlaylistId(null)
    setSearchResults(null)
    setBusy(true)
    try {
      setHotTracks(await fetchPlaylistTracks(id))
    } catch (err) {
      setToast(t('lyricListFail', { error: err instanceof Error ? err.message : String(err) }))
    } finally {
      setBusy(false)
    }
  }

  async function doSearch(): Promise<void> {
    const q = searchQuery.trim()
    if (q === '') return
    setSearchResults(null)
    setDaily(null)
    setPlaylistId(null)
    setHotTracks(null)
    setBusy(true)
    try {
      setSearchResults(await searchSongs(q))
    } catch (err) {
      setToast(t('lyricListFail', { error: err instanceof Error ? err.message : String(err) }))
    } finally {
      setBusy(false)
    }
  }

  function playSong(song: NeteaseSong, queue?: NeteaseSong[]): void {
    void playback.play(song, queue)
  }

  const songList = searchResults ?? hotTracks ?? daily ?? tracks

  return (
    <section className={styles.card}>
      <h3 className={styles.cardTitle}>{t('lyricTitle')}</h3>

      {/* ---- proxy (VPN) for NetEase requests ---- */}
      <div className={styles.row}>
        <span className={styles.fieldLabel}>{t('lyricProxyLabel')}</span>
        <Input
          className={styles.grow}
          placeholder="http://127.0.0.1:7890 / socks5://127.0.0.1:10808"
          value={neteaseProxy}
          onChange={(e) => onNeteaseProxy(e.target.value.trim())}
        />
      </div>

      <div className={styles.row}>
        <span className={styles.fieldLabel}>{t('lyricApiLabel')}</span>
        <Input
          className={styles.grow}
          placeholder="https://music.mcseekeri.com"
          value={neteaseApiBase}
          onChange={(e) => onNeteaseApiBase(e.target.value.trim())}
        />
      </div>

      <div className={styles.row}>
        <span className={styles.fieldLabel}>{t('lyricPosLabel')}</span>
        <div className={styles.pills}>
          {LYRIC_POSITIONS.map((pos) => (
            <Pill
              key={pos.id}
              active={lyricPos === pos.id}
              onClick={() => onLyricPos(pos.id)}
            >
              {t(pos.labelKey)}
            </Pill>
          ))}
        </div>
      </div>

      {/* ---- login / account ---- */}
      {account === 'loading' ? (
        <p className={styles.hint}>{t('lyricLoading')}</p>
      ) : account === null || !account.loggedIn ? (
        <div className={styles.loginBox}>
          {qrKey === null ? (
            <Button variant="outline" disabled={busy} onClick={() => void startQrLogin()}>
              {t('lyricQrLogin')}
            </Button>
          ) : (
            <div className={styles.qrBox}>
              {qrImg !== null ? (
                <img src={qrImg} width={168} height={168} alt="QR" />
              ) : (
                <canvas ref={canvasRef} width={168} height={168} />
              )}
              <p className={styles.qrState}>{qrState}</p>
              {polling && (
                <Button size="sm" variant="ghost" onClick={cancelQr}>
                  {t('lyricQrCancel')}
                </Button>
              )}
            </div>
          )}

          <div className={styles.row}>
            <Input
              className={styles.grow}
              placeholder={t('lyricCookiePh')}
              value={cookieInput}
              onChange={(e) => setCookieInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') void doCookieLogin()
              }}
            />
            <Button
              size="sm"
              variant="outline"
              disabled={busy || cookieInput.trim() === ''}
              onClick={() => void doCookieLogin()}
            >
              {t('lyricCookieLogin')}
            </Button>
          </div>
        </div>
      ) : (
        <div className={styles.row}>
          <span className={styles.account}>
            {t('lyricLoggedIn', { name: account.nickname ?? '' })}
          </span>
          <Button size="sm" variant="ghost" onClick={() => void doLogout()}>
            {t('lyricLogout')}
          </Button>
        </div>
      )}

      {/* ---- browse: my playlists (logged in) / hot playlists + search ---- */}
      {account !== 'loading' && (
        <div className={styles.field}>
          <div className={styles.row}>
            {account !== null && account.loggedIn ? (
              <>
                <select
                  className={styles.select}
                  value={playlistId ?? ''}
                  onChange={(e) => {
                    const id = Number(e.target.value)
                    if (id > 0) void openPlaylist(id)
                  }}
                >
                  <option value="">{t('lyricPlaylists')}</option>
                  {playlists.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}（{p.trackCount}）
                    </option>
                  ))}
                </select>
                <Button size="sm" variant="outline" disabled={busy} onClick={() => void openDaily()}>
                  {t('lyricDaily')}
                </Button>
              </>
            ) : (
              <select
                className={styles.select}
                value=""
                onChange={(e) => {
                  const id = Number(e.target.value)
                  if (id > 0) void openHotPlaylist(id)
                }}
              >
                <option value="">{t('lyricHot')}</option>
                {hotPlaylists.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}（{p.trackCount}）
                  </option>
                ))}
              </select>
            )}
            <Input
              className={styles.grow}
              placeholder={t('lyricSearchPh')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') void doSearch()
              }}
            />
            <Button size="sm" variant="outline" disabled={busy} onClick={() => void doSearch()}>
              {t('lyricSearch')}
            </Button>
          </div>

          {busy && <p className={styles.hint}>{t('lyricLoading')}</p>}

          {!busy && songList !== null && songList.length > 0 && (
            <>
              <div className={styles.row}>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => void playback.play(songList[0]!, songList)}
                >
                  {t('lyricPlayAll')}
                </Button>
              </div>
              <ul className={styles.songList}>
                {songList.slice(0, 50).map((song) => (
                  <li key={song.id} className={styles.songRow}>
                    <button
                      type="button"
                      className={`${styles.songName}${currentSongId === song.id ? ` ${styles.songActive}` : ''}`}
                      onClick={() => playSong(song, songList)}
                      title={song.album ?? ''}
                    >
                      <span className={styles.songTitle}>{song.name}</span>
                      <span className={styles.songMeta}>
                        {song.artists}
                        {fmtTime(song.durationMs) !== '' && ` · ${fmtTime(song.durationMs)}`}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}

      {/* ---- playback control ---- */}
      <div className={styles.row}>
        <Button
          size="sm"
          variant="outline"
          disabled={!playing && playback.getSnapshot().song === null}
          onClick={() => playback.toggle()}
        >
          {playing ? t('lyricPause') : t('lyricPlay')}
        </Button>
        <Button
          size="sm"
          variant="ghost"
          disabled={playback.getSnapshot().song === null}
          onClick={() => playback.stop()}
        >
          {t('lyricStop')}
        </Button>
        <span className={styles.nowPlaying}>
          {playback.getSnapshot().song !== null
            ? `${playback.getSnapshot().song!.name} - ${playback.getSnapshot().song!.artists}`
            : t('lyricNone')}
        </span>
      </div>

      {toast !== null && <Toast text={toast} onDone={() => setToast(null)} />}
    </section>
  )
}
