/**
 * dsh-glass-ui host half.
 *
 * Persists the glass theme configuration and uploaded media (background
 * images, live wallpapers, font files) under
 * `$DSH_HOME/data/glass-ui/`, serves the media back to the browser, and
 * injects a first-paint bootstrap style so a page refresh renders the saved
 * glass look before the client plugin activates (no flash).
 *
 * Routes (all under the webServer service):
 *   GET    /glass-ui/config          → saved config JSON
 *   PUT    /glass-ui/config          → save config JSON
 *   POST   /glass-ui/media           → raw-body upload (x-media-kind header)
 *   GET    /glass-ui/media/<file>    → static media file
 *   DELETE /glass-ui/media/<file>    → delete media file
 */
import { createReadStream, createWriteStream, existsSync, mkdirSync, readFileSync, writeFileSync, renameSync, readdirSync, rmSync, statSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { clearCookie, registerNeteaseRoutes } from './netease.js';
export const DEFAULT_CONFIG = Object.freeze({
    opacity: 0.72,
    blur: 18,
    font: '',
    fontUrl: '',
    bgType: 'none',
    bgImage: '',
    bgImages: [],
    bgVideo: '',
    bgRotate: false,
    bgRotateInterval: 15,
    bgMask: 0,
    bgFit: 'cover',
    animLevel: 'soft',
    customCss: '',
    lyricPos: 'inline',
    neteaseProxy: '',
    mediaDisplay: true,
    neteaseApiBase: '',
});
// ---------------------------------------------------------------------------
// storage helpers
// ---------------------------------------------------------------------------
function dataRoot() {
    const home = process.env.DSH_HOME ?? join(homedir(), '.dsh');
    return join(home, 'data', 'glass-ui');
}
function mediaDir() {
    return join(dataRoot(), 'media');
}
function configPath() {
    return join(dataRoot(), 'config.json');
}
function readConfig() {
    try {
        const raw = JSON.parse(readFileSync(configPath(), 'utf8'));
        // legacy fields from before the background-style / anim-level changes
        const { bgMode: _bgMode, animations: _animations, ...rest } = raw;
        return normalizeHostConfig({ ...DEFAULT_CONFIG, ...rest });
    }
    catch {
        return { ...DEFAULT_CONFIG };
    }
}
/** Host-side normalize: mirrors the client's normalizeConfig. */
function normalizeHostConfig(cfg) {
    cfg.bgImages = (cfg.bgImages ?? []).filter((u) => typeof u === 'string' && u !== '');
    if (cfg.bgImage !== '' && !cfg.bgImages.includes(cfg.bgImage)) {
        cfg.bgImages = [cfg.bgImage, ...cfg.bgImages];
    }
    if (cfg.bgImages.length === 0)
        cfg.bgImage = '';
    else
        cfg.bgImage = cfg.bgImages[0] ?? '';
    return cfg;
}
function writeConfig(config) {
    mkdirSync(dataRoot(), { recursive: true });
    const tmp = configPath() + '.tmp';
    writeFileSync(tmp, JSON.stringify(config, null, 2), 'utf8');
    renameSync(tmp, configPath()); // atomic publish
}
// ---------------------------------------------------------------------------
// media garbage collection
// ---------------------------------------------------------------------------
/** Collect the media file names referenced by a config (relative or absolute
 *  `/glass-ui/media/<file>` URLs). */
function referencedMedia(config) {
    const refs = new Set();
    for (const u of [config.fontUrl, config.bgImage, config.bgVideo, ...config.bgImages]) {
        if (typeof u !== 'string' || u === '')
            continue;
        // capture the file name directly — never derive it with length arithmetic
        const m = /\/(glass-ui\/media\/)([a-zA-Z0-9._-]+)$/.exec(u);
        if (m === null)
            continue;
        const name = m[2];
        if (SAFE_NAME.test(name))
            refs.add(name);
    }
    return refs;
}
/**
 * Only sweep orphans older than this — a fresh upload referenced by the
 * config another tab just saved must survive a stale writer's save, and an
 * in-flight upload must not be deleted mid-stream.
 */
const GC_MIN_AGE_MS = 60 * 60 * 1000;
/**
 * Delete media files the current config no longer references. Runs after
 * every config save and once at plugin start, so repeated uploads, resets and
 * config imports cannot pile up orphaned files (a 1 GB wallpaper left behind
 * by a reset used to stay on disk forever). Incomplete `.tmp` uploads are
 * swept immediately; other orphans only once older than GC_MIN_AGE_MS.
 */
function gcMedia(config) {
    try {
        const dir = mediaDir();
        if (!existsSync(dir))
            return;
        const refs = referencedMedia(config);
        for (const name of readdirSync(dir)) {
            const isTmp = name.endsWith('.tmp');
            if (!isTmp && !(SAFE_NAME.test(name) && !refs.has(name)))
                continue;
            if (!isTmp) {
                try {
                    const ageMs = Date.now() - statSync(join(dir, name)).mtimeMs;
                    if (ageMs < GC_MIN_AGE_MS)
                        continue;
                }
                catch {
                    continue;
                }
            }
            rmSync(join(dir, name), { force: true });
        }
    }
    catch {
        /* GC is best-effort; never block config handling on it */
    }
}
/** Uploads are only accepted for these kinds/extensions (safety whitelist). */
const MEDIA_EXT = {
    image: ['jpg', 'jpeg', 'png', 'webp', 'gif', 'avif'],
    video: ['mp4', 'webm', 'mov', 'm4v'],
    font: ['woff2', 'woff', 'ttf', 'otf'],
};
const CONTENT_TYPES = {
    jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp',
    gif: 'image/gif', avif: 'image/avif',
    mp4: 'video/mp4', webm: 'video/webm', mov: 'video/quicktime', m4v: 'video/x-m4v',
    woff2: 'font/woff2', woff: 'font/woff', ttf: 'font/ttf', otf: 'font/otf',
};
/**
 * Per-kind upload caps. Live wallpapers (video) may be up to 1 GB; images and
 * fonts stay small. Bodies stream straight to disk, so a 1 GB video never
 * sits in memory.
 */
const MAX_UPLOAD = {
    image: 20 * 1024 * 1024,
    video: 1024 * 1024 * 1024,
    font: 20 * 1024 * 1024,
};
/** Only safe file names may pass the media route (path-traversal guard). */
const SAFE_NAME = /^[a-zA-Z0-9._-]+$/;
/** Read a small body (config JSON) fully into memory. */
function readSmallBody(req, max) {
    return new Promise((resolve, reject) => {
        const chunks = [];
        let size = 0;
        req.on('data', (chunk) => {
            size += chunk.length;
            if (size > max) {
                reject(new Error('payload too large'));
                req.destroy();
                return;
            }
            chunks.push(chunk);
        });
        req.on('end', () => resolve(Buffer.concat(chunks)));
        req.on('error', reject);
    });
}
/**
 * Stream the request body into the target file, enforcing the size cap.
 * Returns the number of bytes written.
 */
function saveBodyToFile(req, target, max) {
    return new Promise((resolve, reject) => {
        let size = 0;
        const out = createWriteStream(target, { flags: 'w' });
        req.on('data', (chunk) => {
            size += chunk.length;
            if (size > max) {
                out.destroy();
                req.destroy();
                reject(new Error('payload too large'));
            }
        });
        req.pipe(out);
        out.on('finish', () => resolve(size));
        out.on('error', (err) => {
            req.destroy();
            reject(err);
        });
        req.on('error', (err) => {
            out.destroy();
            reject(err);
        });
    });
}
function sendJson(res, status, body) {
    res.writeHead(status, {
        'content-type': 'application/json; charset=utf-8',
        'cache-control': 'no-store',
    });
    res.end(JSON.stringify(body));
}
function sendText(res, status, text) {
    res.writeHead(status, { 'content-type': 'text/plain; charset=utf-8' });
    res.end(text);
}
// ---------------------------------------------------------------------------
// plugin
// ---------------------------------------------------------------------------
export const name = 'dsh-glass-ui';
export function apply(ctx) {
    ctx.inject(['webServer'], (host) => {
        // sweep orphaned media once at startup (crash leftovers, pre-GC uploads)
        host.effect(() => {
            gcMedia(readConfig());
            return undefined;
        }, 'dsh-glass-ui: startup media gc');
        // config read/write
        host.effect(() => host.webServer.register({
            kind: 'exact',
            path: '/glass-ui/config',
            handler: async (req, res) => {
                if (req.method === 'GET') {
                    sendJson(res, 200, readConfig());
                    return;
                }
                if (req.method === 'PUT') {
                    try {
                        const body = await readSmallBody(req, 256 * 1024);
                        const parsed = JSON.parse(body.toString('utf8'));
                        const merged = { ...DEFAULT_CONFIG, ...parsed };
                        merged.opacity = clampNumber(merged.opacity, 0.1, 0.95, DEFAULT_CONFIG.opacity);
                        merged.blur = clampNumber(merged.blur, 4, 40, DEFAULT_CONFIG.blur);
                        merged.bgType = ['none', 'image', 'video'].includes(merged.bgType) ? merged.bgType : 'none';
                        merged.font = String(merged.font ?? '').slice(0, 200);
                        merged.fontUrl = String(merged.fontUrl ?? '').slice(0, 500);
                        merged.bgImage = String(merged.bgImage ?? '').slice(0, 500);
                        merged.bgVideo = String(merged.bgVideo ?? '').slice(0, 500);
                        merged.bgImages = Array.isArray(merged.bgImages)
                            ? merged.bgImages.map((u) => String(u).slice(0, 500)).filter((u) => u !== '')
                            : [];
                        merged.bgRotate = merged.bgRotate === true;
                        merged.bgRotateInterval = clampNumber(merged.bgRotateInterval, 5, 300, DEFAULT_CONFIG.bgRotateInterval);
                        merged.bgMask = clampNumber(merged.bgMask, 0, 0.7, DEFAULT_CONFIG.bgMask);
                        merged.bgFit = ['cover', 'contain', 'original'].includes(merged.bgFit) ? merged.bgFit : 'cover';
                        merged.animLevel = ['none', 'soft', 'strong'].includes(merged.animLevel) ? merged.animLevel : 'soft';
                        merged.customCss = String(merged.customCss ?? '').slice(0, 64 * 1024);
                        merged.lyricPos = ['inline', 'end', 'hidden'].includes(merged.lyricPos) ? merged.lyricPos : 'inline';
                        merged.mediaDisplay = merged.mediaDisplay === true;
                        merged.neteaseProxy = String(merged.neteaseProxy ?? '').trim().slice(0, 300);
                        merged.neteaseApiBase = String(merged.neteaseApiBase ?? '').trim().slice(0, 300);
                        const normalized = normalizeHostConfig(merged);
                        writeConfig(normalized);
                        gcMedia(normalized);
                        sendJson(res, 200, normalized);
                    }
                    catch (err) {
                        sendText(res, 400, err instanceof Error ? err.message : 'bad config');
                    }
                    return;
                }
                sendText(res, 405, 'method not allowed');
            },
        }), 'dsh-glass-ui: config route');
        // media upload
        host.effect(() => host.webServer.register({
            kind: 'exact',
            path: '/glass-ui/media',
            handler: async (req, res) => {
                if (req.method !== 'POST') {
                    sendText(res, 405, 'method not allowed');
                    return;
                }
                try {
                    const kind = String(req.headers['x-media-kind'] ?? '').toLowerCase();
                    const allowed = MEDIA_EXT[kind];
                    const max = MAX_UPLOAD[kind];
                    if (allowed === undefined || max === undefined) {
                        sendText(res, 400, 'x-media-kind must be image | video | font');
                        return;
                    }
                    // early reject on a lying/chunked content-length beyond the cap
                    const declared = Number(req.headers['content-length'] ?? 0);
                    if (Number.isFinite(declared) && declared > max) {
                        sendText(res, 413, `upload exceeds ${Math.round(max / (1024 * 1024))}MB cap`);
                        return;
                    }
                    const ext = contentTypeToExt(req.headers['content-type'], kind);
                    if (ext === null || !allowed.includes(ext)) {
                        sendText(res, 415, `content-type not allowed for ${kind} (${req.headers['content-type'] ?? 'none'})`);
                        return;
                    }
                    const fileName = `${Date.now()}-${kind}.${ext}`;
                    mkdirSync(mediaDir(), { recursive: true });
                    const target = join(mediaDir(), fileName);
                    const tmp = target + '.tmp';
                    try {
                        const size = await saveBodyToFile(req, tmp, max);
                        if (size === 0) {
                            sendText(res, 400, 'empty upload');
                            rmSync(tmp, { force: true });
                            return;
                        }
                        renameSync(tmp, target);
                    }
                    catch (err) {
                        rmSync(tmp, { force: true });
                        throw err;
                    }
                    sendJson(res, 200, { url: `/glass-ui/media/${fileName}`, name: fileName });
                }
                catch (err) {
                    sendText(res, 400, err instanceof Error ? err.message : 'upload failed');
                }
            },
        }), 'dsh-glass-ui: media upload route');
        // media static serving + delete
        host.effect(() => host.webServer.register({
            kind: 'prefix',
            path: '/glass-ui/media',
            handler: (req, res) => {
                let rel;
                try {
                    rel = decodeURIComponent(req.url ?? '').replace(/^\/glass-ui\/media\/?/, '');
                }
                catch {
                    sendText(res, 400, 'bad url');
                    return;
                }
                if (rel === '' || rel.includes('/') || !SAFE_NAME.test(rel)) {
                    sendText(res, 404, 'not found');
                    return;
                }
                const ext = rel.includes('.') ? rel.split('.').pop().toLowerCase() : '';
                if (req.method === 'DELETE') {
                    try {
                        rmSync(join(mediaDir(), rel), { force: true });
                    }
                    catch {
                        /* already gone */
                    }
                    sendJson(res, 200, { ok: true });
                    return;
                }
                if (req.method !== 'GET' && req.method !== 'HEAD') {
                    sendText(res, 405, 'method not allowed');
                    return;
                }
                const file = join(mediaDir(), rel);
                let size;
                try {
                    size = statSync(file).size;
                }
                catch {
                    sendText(res, 404, 'not found');
                    return;
                }
                res.writeHead(200, {
                    'content-type': CONTENT_TYPES[ext] ?? 'application/octet-stream',
                    'cache-control': 'public, max-age=31536000, immutable',
                    'content-length': String(size),
                });
                if (req.method === 'GET') {
                    // stream — a 1 GB wallpaper must never be buffered whole in memory
                    const stream = createReadStream(file);
                    stream.on('error', () => res.destroy());
                    stream.pipe(res);
                }
                else {
                    res.end();
                }
            },
        }), 'dsh-glass-ui: media static route');
        // clear personal data: NetEase login, uploaded media, and saved config
        host.effect(() => host.webServer.register({
            kind: 'exact',
            path: '/glass-ui/clear-data',
            handler: async (_req, res) => {
                try {
                    clearCookie();
                    const dir = mediaDir();
                    if (existsSync(dir)) {
                        for (const name of readdirSync(dir)) {
                            rmSync(join(dir, name), { force: true });
                        }
                    }
                    writeConfig({ ...DEFAULT_CONFIG });
                    sendJson(res, 200, { ok: true });
                }
                catch (err) {
                    sendText(res, 500, err instanceof Error ? err.message : 'clear data failed');
                }
            },
        }), 'dsh-glass-ui: clear data route');
        // first-paint bootstrap: inject the saved glass variables before React
        // mounts so a refresh does not flash the stock theme
        host.effect(() => host.webServer.tapIndex((html) => {
            const config = readConfig();
            const vars = bootstrapCss(config);
            const style = `<style id="dsh-glass-ui-boot">${vars}</style>`;
            return html.includes('dsh-glass-ui-boot') ? html : html.replace('<body>', `<body>${style}`);
        }), 'dsh-glass-ui: index bootstrap');
        // NetEase Cloud Music proxy (QR login / playlists / lyrics / streams)
        for (const dispose of registerNeteaseRoutes(host.webServer)) {
            host.effect(() => dispose, 'dsh-glass-ui: netease route');
        }
    });
}
function clampNumber(value, min, max, fallback) {
    const n = typeof value === 'number' && Number.isFinite(value) ? value : fallback;
    return Math.min(max, Math.max(min, n));
}
/** Infer the file extension from the upload content-type. */
function contentTypeToExt(contentType, kind) {
    if (contentType === undefined || contentType === '')
        return null;
    const main = contentType.split(';')[0].trim().toLowerCase();
    for (const [ext, ct] of Object.entries(CONTENT_TYPES)) {
        if (ct === main)
            return ext;
    }
    return null;
}
/**
 * The pre-activation CSS: root glass variables plus the fixed background
 * layer. Kept minimal — the client half takes over as soon as it activates
 * and re-applies the same values from the live config.
 */
export function bootstrapCss(config) {
    const surface = (rgb) => `rgba(${rgb},${config.opacity})`;
    const lightSurface = surface('255,255,255');
    const darkSurface = surface('16,16,24');
    return [
        ':root{',
        `--glass-opacity:${config.opacity};`,
        `--glass-blur:${config.blur}px;`,
        `--glass-font:${cssString(config.font)};`,
        `--glass-font-url:${cssString(config.fontUrl)};`,
        `--glass-bg-type:${config.bgType};`,
        `--glass-bg-image:${config.bgImage ? `url(${JSON.stringify(config.bgImage)})` : 'none'};`,
        `--glass-bg-video:${config.bgVideo ? `url(${JSON.stringify(config.bgVideo)})` : 'none'};`,
        `--glass-bg-mask:${config.bgMask};`,
        `--glass-bg-fit:${config.bgFit};`,
        `--glass-anim-level:${config.animLevel};`,
        `--glass-surface-light:${lightSurface};`,
        `--glass-surface-dark:${darkSurface};`,
        '}',
    ].join('');
}
function cssString(value) {
    if (value === '')
        return "''";
    return `"${value.replaceAll('\\', '\\\\').replaceAll('"', '\\"')}"`;
}
//# sourceMappingURL=index.js.map