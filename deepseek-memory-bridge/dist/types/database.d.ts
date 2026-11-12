import { DatabaseSync } from 'node:sqlite';
import { type Memory, type Source, type Status } from './types.js';
export declare function terms(input: string): string[];
export declare function indexText(input: string): string;
export declare function conversationKey(sourceId: string): string;
export declare class Store {
    path: string;
    db: DatabaseSync;
    constructor(path: string);
    one(sql: string, ...args: (string | number | null)[]): Record<string, any> | undefined;
    all(sql: string, ...args: (string | number | null)[]): Record<string, any>[];
    run(sql: string, ...args: (string | number | null)[]): import("node:sqlite").StatementResultingChanges;
    transaction<T>(fn: () => T): T;
    close(): void;
    sources(id: string): Source[];
    memory(id: string): Memory;
    saveMemory(m: Memory, reason: string): void;
    change(id: string, changes: Partial<Memory>, reason: string, expected?: number): Memory;
    candidates(m: Memory): {
        id: string;
        duplicate: boolean;
    };
    list(status?: Status, category?: string, limit?: number, offset?: number): Memory[];
    search(query: string, options?: {
        confirmedOnly?: boolean;
        scope?: string;
        limit?: number;
    }): Memory[];
    stats(): {
        conversations: number;
        messages: number;
        messageVersions: number;
        candidates: number;
        confirmed: number;
        conflicts: number;
        lastImport: string | null;
        schemaVersion: number;
    };
}
