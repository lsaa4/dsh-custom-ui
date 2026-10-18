/**
 * Frosted backing for the composer dock row.
 *
 * The row under the input card carries the output-speed / cache readouts, the
 * session-stats trigger, this plugin's lyric line and the context-usage meter.
 * DSH ships it with no background of its own, so all of that dimmed text sits
 * straight on the wallpaper and loses contrast — the one place in the composer
 * with nothing behind the glyphs.
 *
 * The row cannot be targeted from CSS: its module class name is hashed per
 * build (`<hash>_dock`), and only the `_dock` suffix is stable. So it is found
 * by walking up from this plugin's own dock marker (see LyricsLine.tsx) and
 * tagged with a class glass.css can style.
 *
 * Deliberately not styled with backdrop-filter: the context meter opens a
 * `position: fixed` detail panel from inside this row, and a containing block
 * on the row would place that panel relative to the row instead of the
 * viewport. The wallpaper behind the row is already blurred by the background
 * layer, so a translucent plate still reads as frosted.
 */
const MARK = 'dsh-glass-dock'
const ANCHOR = '[data-dsh-glass-dock-anchor]'
/** `<hashed>_dock` — the only stable part of the row's generated class name. */
const DOCK_CLASS = /(?:^|\s)[A-Za-z0-9_-]*_dock(?:\s|$)/
/** How far to climb: marker → slot entry → slot wrapper → the dock row. */
const MAX_DEPTH = 4

/** The outermost `_dock` ancestor of the marker, i.e. the row holding every dock item. */
function dockRowFor(anchor: HTMLElement): HTMLElement | null {
  let node: HTMLElement | null = anchor
  let dock: HTMLElement | null = null
  for (let depth = 0; depth < MAX_DEPTH; depth += 1) {
    node = node.parentElement
    if (node === null) break
    if (typeof node.className === 'string' && DOCK_CLASS.test(node.className)) dock = node
  }
  return dock
}

/**
 * Tag the composer dock row and keep the tag applied across re-renders.
 * @returns Disposer that removes both the tag and the watcher.
 */
export function mountDockPlate(): () => void {
  let marked: HTMLElement | null = null

  const sync = (): void => {
    const anchor = document.querySelector<HTMLElement>(ANCHOR)
    const dock = anchor === null ? null : dockRowFor(anchor)
    if (dock === marked) return
    marked?.classList.remove(MARK)
    marked = dock
    marked?.classList.add(MARK)
  }

  sync()
  // React re-creates the composer subtree on session switches and layout
  // changes, which drops the tag with the old node; the poll re-tags the new
  // one. Same shape as the music card's keep-alive.
  const timer = window.setInterval(sync, 2000)

  return () => {
    window.clearInterval(timer)
    marked?.classList.remove(MARK)
    marked = null
  }
}
