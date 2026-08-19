/**
 * NetEase Cloud Music integration (host half).
 * Routes: /netease/weapi, /netease/lyric,
 * /netease/account, /netease/logout, /netease/cookie, /netease/hot-playlists,
 * /netease/search, /netease/song-url.
 */
import { createCipheriv, createPublicKey, publicEncrypt, randomBytes, constants } from 'node:crypto';
import { mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import fetch from 'node-fetch';
import { SocksProxyAgent } from 'socks-proxy-agent';
import { HttpProxyAgent } from 'http-proxy-agent';
let proxyAgentCache = null;
function readProxy() {
    try {
        const home = process.env.DSH_HOME ?? join(homedir(), '.dsh');
        const raw = JSON.parse(readFileSync(join(home, 'data', 'glass-ui', 'config.json'), 'utf8'));
        return typeof raw.neteaseProxy === 'string' ? raw.neteaseProxy.trim() : '';
    }
    catch {
        return '';
    }
}
function agentFor(proxyUrl) {
    if (proxyUrl === '')
        return undefined;
    if (proxyAgentCache === null || proxyAgentCache.url !== proxyUrl) {
        proxyAgentCache?.agent.destroy();
        proxyAgentCache = {
            url: proxyUrl,
            agent: proxyUrl.startsWith('socks')
                ? new SocksProxyAgent(proxyUrl)
                : new HttpProxyAgent(proxyUrl),
        };
    }
    return proxyAgentCache.agent;
}
function setCookieList(headers) {
    const raw = headers.raw;
    if (typeof raw === 'function') {
        return raw.call(headers)['set-cookie'] ?? [];
    }
    const single = headers.get('set-cookie');
    return single === null ? [] : [single];
}
const AES_KEY = '0CoJUm6Qyw8W8jud';
const AES_IV = '0102030405060708';
const RSA_E = '010001';
const RSA_N = '00e0b509f6259df8642dbc35662901477df22677ec152b5ff68ace615bb7b725152b3ab17a876aea8a5aa76d2e417629ec4ee341f56135fccf695280104e0312ecbda92557c93870114af6c9d05c4f7f0c3685b7a46bee255932575cce10b424d813cfe4875d3e82047b97ddef52741d546b8e289dc6935b3ece0462db0a22b8e7';
function aesEncrypt(text, key) {
    const cipher = createCipheriv('aes-128-cbc', Buffer.from(key), Buffer.from(AES_IV));
    return cipher.update(text, 'utf8', 'hex') + cipher.final('hex');
}
function rsaEncrypt(text) {
    const reversed = Buffer.from(text).reverse();
    const key = createPublicKey({
        key: {
            kty: 'RSA',
            // JWK fields are base64url — convert from the hex literals
            n: Buffer.from(RSA_N, 'hex').toString('base64url'),
            e: Buffer.from(RSA_E, 'hex').toString('base64url'),
        },
        format: 'jwk',
    });
    return publicEncrypt({ key, padding: constants.RSA_PKCS1_PADDING }, reversed).toString('hex');
}
/** A 16-char random secret: AES-128 needs a 16-byte key (the scheme's own
 * alphabet, matching NeteaseCloudMusicApi's createSecretKey). */
function randomSecret() {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let out = '';
    for (let i = 0; i < 16; i++)
        out += chars[randomBytes(1)[0] % chars.length];
    return out;
}
function weapiParams(data) {
    const randomKey = randomSecret();
    const params = aesEncrypt(aesEncrypt(JSON.stringify(data), randomKey), AES_KEY);
    const encSecKey = rsaEncrypt(randomKey);
    return { params, encSecKey };
}
function cookiePath() {
    const home = process.env.DSH_HOME ?? join(homedir(), '.dsh');
    return join(home, 'data', 'glass-ui', 'netease-cookie.json');
}
function readCookie() {
    try {
        const raw = JSON.parse(readFileSync(cookiePath(), 'utf8'));
        return raw.cookie ?? '';
    }
    catch {
        return '';
    }
}
function writeCookie(cookie) {
    if (cookie === '')
        return;
    mkdirSync(join(cookiePath(), '..'), { recursive: true });
    const tmp = cookiePath() + '.tmp';
    writeFileSync(tmp, JSON.stringify({ cookie }), 'utf8');
    renameSync(tmp, cookiePath());
}
function clearCookie() {
    try {
        writeFileSync(cookiePath(), JSON.stringify({ cookie: '' }), 'utf8');
    }
    catch {
        /* ignore */
    }
}
function mergeCookies(saved, setCookie) {
    if (setCookie === undefined || setCookie.length === 0)
        return saved;
    const parts = saved === '' ? [] : saved.split('; ').map((p) => p.trim());
    const map = new Map(parts.map((p) => [p.split('=')[0], p]));
    for (const raw of setCookie) {
        const first = raw.split(';')[0]?.trim();
        if (first === undefined || first === '')
            continue;
        const name = first.split('=')[0];
        if (name !== undefined)
            map.set(name, first);
    }
    return [...map.values()].join('; ');
}
const API_BASE = 'https://music.163.com';
const NETBASE_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36';
/** Remote NeteaseCloudMusicApi server (public/self-hosted) from config.neteaseApiBase. */
function readApiBase() {
    try {
        const home = process.env.DSH_HOME ?? join(homedir(), '.dsh');
        const raw = JSON.parse(readFileSync(join(home, 'data', 'glass-ui', 'config.json'), 'utf8'));
        return typeof raw.neteaseApiBase === 'string' ? raw.neteaseApiBase.trim().replace(/\/+$/, '') : '';
    }
    catch {
        return '';
    }
}
async function remoteJson(url, headers) {
    // the remote server is reachable directly — no proxy (the proxy is only for
    // the official endpoints that are blocked from this network)
    const res = await fetch(url, {
        headers: { 'user-agent': NETBASE_UA, ...headers },
        signal: AbortSignal.timeout(20000),
    });
    const text = await res.text();
    if (text === '')
        throw new Error(`remote api ${url} returned empty response`);
    return JSON.parse(text);
}
/** Adapt one weapi-style call to a NeteaseCloudMusicApi-compatible server. */
async function remoteWeapiRequest(apiBase, path, data, cookie) {
    const headers = cookie !== '' ? { cookie } : {};
    const d = data;
    switch (path) {
        case '/weapi/login/qrcode/unikey': {
            const j = await remoteJson(`${apiBase}/login/qr/key`, headers);
            const key = j.data?.unikey ?? '';
            let qrimg = '';
            if (key !== '') {
                try {
                    const img = await remoteJson(`${apiBase}/login/qr/create?key=${encodeURIComponent(key)}&qrimg=true`, headers);
                    const data = img.data;
                    qrimg = typeof data?.qrimg === 'string' ? data.qrimg : '';
                }
                catch {
                    qrimg = ''; // client falls back to local rendering
                }
            }
            return { json: { code: 200, unikey: key, qrimg }, setCookie: [] };
        }
        case '/weapi/login/qrcode/client/login': {
            const key = String(d.key ?? '');
            const j = await remoteJson(`${apiBase}/login/qr/check?key=${encodeURIComponent(key)}`, headers);
            const code = Number(j.code ?? 801);
            // 803 = confirmed: NeteaseCloudMusicApi returns the session cookie inline
            if (code === 803 && typeof j.cookie === 'string' && j.cookie !== '') {
                return {
                    json: { code: 803, nickname: j.nickname },
                    setCookie: [j.cookie],
                };
            }
            return { json: { code }, setCookie: [] };
        }
        case '/weapi/user/playlist': {
            const uid = Number(d.uid ?? 0);
            const limit = Number(d.limit ?? 60);
            const offset = Number(d.offset ?? 0);
            const j = await remoteJson(`${apiBase}/user/playlist?uid=${uid}&limit=${limit}&offset=${offset}`, headers);
            return { json: { playlist: j.playlist }, setCookie: [] };
        }
        case '/weapi/w/nuser/account/get': {
            const j = await remoteJson(`${apiBase}/user/account`, headers);
            return { json: { profile: j.profile }, setCookie: [] };
        }
        case '/weapi/v6/playlist/detail': {
            const id = Number(d.id ?? 0);
            const j = await remoteJson(`${apiBase}/playlist/detail?id=${id}`, headers);
            return { json: { playlist: j.playlist }, setCookie: [] };
        }
        case '/weapi/v1/discovery/recommend/songs': {
            const j = await remoteJson(`${apiBase}/recommend/songs`, headers);
            const dailySongs = j.data?.dailySongs ?? [];
            return { json: { data: { dailySongs } }, setCookie: [] };
        }
        case '/weapi/song/enhance/player/url': {
            const ids = Array.isArray(d.ids) ? d.ids : [];
            const id = Number(ids[0] ?? 0);
            const j = await remoteJson(`${apiBase}/song/url?id=${id}`, headers);
            const first = j.data?.[0];
            return { json: { data: [{ url: first?.url ?? null }] }, setCookie: [] };
        }
        default:
            throw new Error(`remote api: unsupported weapi path ${path}`);
    }
}
async function weapiRequest(path, data, cookie) {
    const apiBase = readApiBase();
    if (apiBase !== '') {
        return await remoteWeapiRequest(apiBase, path, data, cookie);
    }
    const form = new URLSearchParams();
    const enc = weapiParams(data);
    form.set('params', enc.params);
    form.set('encSecKey', enc.encSecKey);
    const proxy = readProxy();
    const agent = agentFor(proxy);
    const res = await fetch(`${API_BASE}${path}`, {
        method: 'POST',
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'user-agent': NETBASE_UA,
            ...(cookie !== '' ? { cookie } : {}),
        },
        body: form,
        ...(agent !== undefined ? { agent } : {}),
    });
    const text = await res.text();
    if (text === '') {
        throw new Error('netease weapi unreachable from this network (empty response)');
    }
    const json = JSON.parse(text);
    const setCookie = setCookieList(res.headers);
    return { json, setCookie };
}
async function publicLyric(id) {
    const apiBase = readApiBase();
    const proxy = readProxy();
    const agent = agentFor(proxy);
    const url = apiBase !== ''
        ? `${apiBase}/lyric?id=${encodeURIComponent(id)}`
        : `${API_BASE}/api/song/lyric?id=${encodeURIComponent(id)}&lv=1&kv=1&tv=-1`;
    const res = await fetch(url, {
        headers: {
            'user-agent': NETBASE_UA,
            ...(apiBase !== '' && readCookie() !== '' ? { cookie: readCookie() } : {}),
        },
        ...(agent !== undefined ? { agent } : {}),
    });
    const json = await res.json().catch(() => ({}));
    return { lrc: json.lrc?.lyric };
}
/** GET a public (unencrypted) music.163.com API path. */
async function publicJson(path) {
    const proxy = readProxy();
    const agent = agentFor(proxy);
    const res = await fetch(`${API_BASE}${path}`, {
        headers: {
            'user-agent': NETBASE_UA,
            referer: 'https://music.163.com/',
        },
        ...(agent !== undefined ? { agent } : {}),
    });
    return res.json().catch(() => ({ code: -1 }));
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
function readSmallBody(req, max = 128 * 1024) {
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
/** Register all /netease routes; returns a disposer for each registration. */
export function registerNeteaseRoutes(host) {
    const disposers = [];
    disposers.push(host.register({
        kind: 'exact',
        path: '/netease/weapi',
        handler: async (req, res) => {
            if (req.method !== 'POST') {
                sendText(res, 405, 'method not allowed');
                return;
            }
            try {
                const body = JSON.parse((await readSmallBody(req)).toString('utf8'));
                if (typeof body.path !== 'string' || !body.path.startsWith('/weapi/')) {
                    sendText(res, 400, 'path must start with /weapi/');
                    return;
                }
                const cookie = readCookie();
                const { json, setCookie } = await weapiRequest(body.path, body.data ?? {}, cookie);
                writeCookie(mergeCookies(cookie, setCookie));
                sendJson(res, 200, json);
            }
            catch (err) {
                sendText(res, 502, err instanceof Error ? err.message : 'upstream failed');
            }
        },
    }));
    disposers.push(host.register({
        kind: 'exact',
        path: '/netease/lyric',
        handler: async (req, res) => {
            const url = new URL(req.url ?? '/netease/lyric', 'http://localhost');
            const id = url.searchParams.get('id') ?? '';
            if (id === '') {
                sendText(res, 400, 'missing id');
                return;
            }
            try {
                const { lrc } = await publicLyric(id);
                sendJson(res, 200, { lrc: lrc ?? '' });
            }
            catch (err) {
                sendText(res, 502, err instanceof Error ? err.message : 'lyric failed');
            }
        },
    }));
    disposers.push(host.register({
        kind: 'exact',
        path: '/netease/hot-playlists',
        handler: async (_req, res) => {
            try {
                const apiBase = readApiBase();
                const json = apiBase !== ''
                    ? await remoteJson(`${apiBase}/top/playlist?limit=20&order=hot`, readCookie() !== '' ? { cookie: readCookie() } : {})
                    : await publicJson('/api/playlist/highquality/list?cat=%E5%85%A8%E9%83%A8&limit=20');
                sendJson(res, 200, {
                    playlists: (json.playlists ?? [])
                        .filter((p) => typeof p.id === 'number' && typeof p.name === 'string')
                        .map((p) => ({ id: p.id, name: p.name, trackCount: p.trackCount ?? 0 })),
                });
            }
            catch (err) {
                sendText(res, 502, err instanceof Error ? err.message : 'hot playlists failed');
            }
        },
    }));
    disposers.push(host.register({
        kind: 'exact',
        path: '/netease/search',
        handler: async (req, res) => {
            const url = new URL(req.url ?? '/netease/search', 'http://localhost');
            const q = (url.searchParams.get('q') ?? '').slice(0, 100);
            if (q === '') {
                sendText(res, 400, 'missing q');
                return;
            }
            try {
                const apiBase = readApiBase();
                const json = apiBase !== ''
                    ? await remoteJson(`${apiBase}/search?keywords=${encodeURIComponent(q)}&limit=20`, readCookie() !== '' ? { cookie: readCookie() } : {})
                    : await publicJson(`/api/search/get?type=1&s=${encodeURIComponent(q)}&limit=20`);
                const songs = json.result?.songs ?? [];
                sendJson(res, 200, {
                    songs: songs
                        .filter((s) => typeof s.id === 'number' && typeof s.name === 'string')
                        .map((s) => ({
                        id: s.id,
                        name: s.name,
                        artists: (s.artists ?? []).map((a) => a.name ?? '').filter((x) => x !== '').join(' / '),
                        album: s.album?.name,
                        cover: s.album?.picUrl,
                        durationMs: s.duration,
                    })),
                });
            }
            catch (err) {
                sendText(res, 502, err instanceof Error ? err.message : 'search failed');
            }
        },
    }));
    disposers.push(host.register({
        kind: 'exact',
        path: '/netease/song-url',
        handler: async (req, res) => {
            const url = new URL(req.url ?? '/netease/song-url', 'http://localhost');
            const id = url.searchParams.get('id') ?? '';
            if (id === '') {
                sendText(res, 400, 'missing id');
                return;
            }
            try {
                const apiBase = readApiBase();
                if (apiBase !== '') {
                    // remote mode: use the remote server's stream endpoint
                    const j = await remoteJson(`${apiBase}/song/url?id=${encodeURIComponent(id)}`, readCookie() !== '' ? { cookie: readCookie() } : {});
                    const first = j.data?.[0];
                    sendJson(res, 200, { url: first?.url ?? null });
                    return;
                }
                const proxy = readProxy();
                const agent = agentFor(proxy);
                const redirect = await fetch(`https://music.163.com/song/media/outer/url?id=${encodeURIComponent(id)}.mp3`, { redirect: 'manual', ...(agent !== undefined ? { agent } : {}) });
                const location = redirect.headers.get('location');
                // only hand out real CDN streams; copyright-restricted songs redirect
                // to a 404 page and must come back as null (client falls back / errors)
                const url = location !== null && location.includes('126.net') ? location : null;
                sendJson(res, 200, { url });
            }
            catch (err) {
                sendText(res, 502, err instanceof Error ? err.message : 'song url failed');
            }
        },
    }));
    disposers.push(host.register({
        kind: 'exact',
        path: '/netease/account',
        handler: async (_req, res) => {
            const cookie = readCookie();
            if (cookie === '') {
                sendJson(res, 200, { loggedIn: false });
                return;
            }
            try {
                const { json } = await weapiRequest('/weapi/w/nuser/account/get', {}, cookie);
                const profile = json
                    .profile;
                if (profile === undefined) {
                    clearCookie();
                    sendJson(res, 200, { loggedIn: false });
                    return;
                }
                sendJson(res, 200, {
                    loggedIn: true,
                    uid: profile.userId,
                    nickname: profile.nickname,
                    avatarUrl: profile.avatarUrl,
                });
            }
            catch {
                sendJson(res, 200, { loggedIn: false });
            }
        },
    }));
    disposers.push(host.register({
        kind: 'exact',
        path: '/netease/logout',
        handler: (_req, res) => {
            clearCookie();
            sendJson(res, 200, { ok: true });
        },
    }));
    disposers.push(host.register({
        kind: 'exact',
        path: '/netease/cookie',
        handler: async (req, res) => {
            if (req.method !== 'POST') {
                sendText(res, 405, 'method not allowed');
                return;
            }
            try {
                const body = JSON.parse((await readSmallBody(req)).toString('utf8'));
                const cookie = String(body.cookie ?? '').trim().slice(0, 4000);
                if (cookie === '' || !cookie.includes('=')) {
                    sendText(res, 400, 'cookie looks empty');
                    return;
                }
                writeCookie(cookie);
                const { json } = await weapiRequest('/weapi/w/nuser/account/get', {}, cookie);
                const profile = json.profile;
                if (profile === undefined) {
                    clearCookie();
                    sendJson(res, 200, { ok: false, reason: 'cookie rejected' });
                    return;
                }
                sendJson(res, 200, { ok: true, nickname: profile.nickname, uid: profile.userId });
            }
            catch (err) {
                sendText(res, 502, err instanceof Error ? err.message : 'cookie login failed');
            }
        },
    }));
    return disposers;
}
//# sourceMappingURL=netease.js.map