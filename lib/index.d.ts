import type { IncomingMessage, ServerResponse } from 'node:http';
interface WebServerService {
    register(route: {
        kind: 'exact' | 'prefix';
        path: string;
        handler: (req: IncomingMessage, res: ServerResponse) => void | Promise<void>;
    }): () => void;
    /** Transform every index.html response (first-paint bootstrap). */
    tapIndex(transform: (html: string) => string): () => void;
}
interface HostContext {
    inject(deps: string[], callback: (ctx: HostContext & {
        webServer: WebServerService;
    }) => void): void;
    effect(fn: () => unknown | (() => void | Promise<void>), label?: string): void;
}
export interface GlassConfig {
    /** Glass surface opacity, 0.1..0.95 (higher = more solid, less transparent). */
    opacity: number;
    /** backdrop-filter blur radius in px, 4..40. */
    blur: number;
    /** Font family applied to the whole UI; '' keeps the built-in font. */
    font: string;
    /** Uploaded font file URL (/glass-ui/media/...) for a custom @font-face. */
    fontUrl: string;
    /** Background source: none | image | video. */
    bgType: 'none' | 'image' | 'video';
    /** Primary background image URL (first slide of the carousel). */
    bgImage: string;
    /** All background image URLs (carousel slides; bgImage is slide 0). */
    bgImages: string[];
    /** Live wallpaper (video) URL (/glass-ui/media/...). */
    bgVideo: string;
    /** Carousel: rotate through bgImages every N seconds. */
    bgRotate: boolean;
    /** Carousel interval in seconds, 5..300. */
    bgRotateInterval: number;
    /** Dark overlay strength over the wallpaper, 0..0.7 (readability). */
    bgMask: number;
    /** Wallpaper fit mode. */
    bgFit: 'cover' | 'contain' | 'original';
    /** Animation level: none | soft | strong. */
    animLevel: 'none' | 'soft' | 'strong';
    /** User-supplied extra CSS injected verbatim. */
    customCss: string;
    /** Lyric line position in the composer dock. */
    lyricPos: 'inline' | 'end' | 'hidden';
    /** HTTP proxy for NetEase requests (e.g. http://127.0.0.1:7890). */
    neteaseProxy: string;
    /** Remote NeteaseCloudMusicApi server base URL (public/self-hosted instance). */
    neteaseApiBase: string;
}
export declare const DEFAULT_CONFIG: GlassConfig;
export declare const name = "dsh-glass-ui";
export declare function apply(ctx: HostContext): void;
/**
 * The pre-activation CSS: root glass variables plus the fixed background
 * layer. Kept minimal — the client half takes over as soon as it activates
 * and re-applies the same values from the live config.
 */
export declare function bootstrapCss(config: GlassConfig): string;
export {};
//# sourceMappingURL=index.d.ts.map