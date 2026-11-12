export declare const now: () => string;
export declare const uid: () => `${string}-${string}-${string}-${string}-${string}`;
export declare const hash: (data: string | Uint8Array) => string;
export declare function canonical(value: unknown): string;
export declare function fileHash(path: string): Promise<string>;
export declare function inside(root: string, path: string): string;
export declare function atomicJson(path: string, value: unknown): void;
export declare function record(v: unknown): Record<string, unknown> | undefined;
export declare function text(v: unknown): string;
export declare function integer(v: unknown, fallback: number, min: number, max: number): number;
export declare function date(v: unknown): string | null;
export declare function normalize(v: string): string;
export declare function assertFileExists(path: string): void;
export declare function publicError(e: unknown): {
    code: string;
    message: string;
};
export declare function recallTokens(v: string): number;
