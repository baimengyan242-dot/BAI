import { DatabaseSync } from 'node:sqlite';
export declare function locationFile(home?: string): string;
export declare function resolveDataDir(configured?: string, file?: string): string;
export declare function absoluteDirectory(path: string): string;
export declare function overlap(a: string, b: string): boolean;
export declare function acquireStorageLock(root: string): () => void;
export declare function saveLocation(file: string | undefined, dataDir: string, previousDir?: string): void;
export declare function databaseCounts(db: DatabaseSync): Record<string, number>;
export declare function validateLibrary(root: string): Record<string, number>;
export declare function browseDirectories(path?: string): Promise<{
    path: string;
    parent: string | null;
    directories: string[];
    truncated: boolean;
}>;
