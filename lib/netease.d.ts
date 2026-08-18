import type { IncomingMessage, ServerResponse } from 'node:http';
export interface NeteaseRoutesHost {
    register(route: {
        kind: 'exact' | 'prefix';
        path: string;
        handler: (req: IncomingMessage, res: ServerResponse) => void | Promise<void>;
    }): () => void;
}
/** Register all /netease routes; returns a disposer for each registration. */
export declare function registerNeteaseRoutes(host: NeteaseRoutesHost): Array<() => void>;
//# sourceMappingURL=netease.d.ts.map