import { EventEmitter } from 'node:events';
import { Store } from './database.js';
import { type BridgeOptions, type ImportPreview, type Limits, type Memory, type Progress } from './types.js';
export declare class MemoryBridge extends EventEmitter {
    store: Store;
    dataDir: string;
    relocating: boolean;
    private releaseLock;
    readonly limits: Limits;
    private working;
    private disposed;
    private current?;
    readonly options: BridgeOptions;
    constructor(options: BridgeOptions);
    exclusive<T>(fn: () => Promise<T>): Promise<T>;
    close(): Promise<void>;
    config(): any;
    progress(p: Progress): void;
    stats(): {
        dataDir: string;
        busy: boolean;
        settings: any;
        privacy: string;
        conversations: number;
        messages: number;
        messageVersions: number;
        candidates: number;
        confirmed: number;
        conflicts: number;
        lastImport: string | null;
        schemaVersion: number;
    };
    imports(): ImportPreview[];
    preview(id: string): ImportPreview;
    previewFile(path: string, signal?: AbortSignal, displayName?: string): Promise<ImportPreview>;
    private saveConversation;
    commitImport(id: string, signal?: AbortSignal): Promise<ImportPreview>;
    search(query: string, scope?: string, limit?: number, confirmedOnly?: boolean): Memory[];
    history(query?: string, limit?: number, offset?: number): Record<string, any>[];
    readConversation(id: string, version?: string, offset?: number, limit?: number): {
        id: string;
        title: string;
        version: any;
        adapter: any;
        versions: Record<string, any>[];
        messages: Record<string, any>[];
        sourceFiles: Record<string, any>[];
    };
    rawConversation(id: string, version?: string): any;
    recall(query: string, scope?: string): string;
    propose(type: string, payload: Record<string, unknown>, description: string): {
        actionId: `${string}-${string}-${string}-${string}-${string}`;
        status: string;
        description: string;
        nextStep: string;
    };
    actions(): {
        payload: any;
    }[];
    confirm(id: string, nonce: string, signal?: AbortSignal): Promise<unknown>;
    cancelAction(id: string): {
        cancelled: string;
    };
    private perform;
    private relocate;
    validateMemory(content: string): void;
    conflicts(): {
        old: Memory;
        new: Memory;
    }[];
    revisions(id: string): {
        snapshot: any;
    }[];
    private extractWithModel;
    private walk;
    createBackup(reason: string): Promise<{
        id: string;
        files: number;
        path: string;
    }>;
    backups(): {
        id: string;
        reason: string;
        createdAt: string;
    }[];
    private restore;
    private exportData;
}
