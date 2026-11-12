export declare const categories: readonly ["background", "preference", "learning", "environment", "project", "knowledge", "unverified"];
export type Category = typeof categories[number];
export declare const categoryNames: Record<Category, string>;
export type Status = 'candidate' | 'confirmed' | 'rejected' | 'superseded' | 'deleted' | 'expired';
export interface Source {
    conversationId: string;
    messageId: string;
    version: string;
    originalTime: string | null;
    quote: string;
}
export interface Memory {
    id: string;
    content: string;
    category: Category;
    scope: string;
    evidence: 'user-stated' | 'ai-inference' | 'uncertain';
    confidence: number;
    status: Status;
    key: string;
    value: string;
    sources: Source[];
    extractedAt: string;
    updatedAt: string;
    expiresAt: string | null;
    revision: number;
}
export interface ParsedMessage {
    id: string;
    role: string;
    text: string;
    time: string | null;
    position: number;
    raw: Record<string, unknown>;
    warnings: string[];
}
export interface ParsedConversation {
    id: string;
    title: string;
    time: string | null;
    messages: ParsedMessage[];
    raw: Record<string, unknown>;
    adapter: string;
    warnings: string[];
}
export interface ImportPreview {
    id: string;
    hash: string;
    fileName: string;
    bytes: number;
    conversations: number;
    messages: number;
    parseable: number;
    duplicates: number;
    updated: number;
    anomalies: number;
    warnings: string[];
    status: string;
    cursor: number;
}
export interface Limits {
    maxArchiveBytes: number;
    maxExpandedBytes: number;
    maxEntryBytes: number;
    maxEntries: number;
    maxCompressionRatio: number;
    maxConversationBytes: number;
}
export declare const defaultLimits: Limits;
export interface BridgeOptions {
    dataDir: string;
    locationFile?: string;
    autoRecall?: boolean;
    recallBudgetTokens?: number;
    recallLimit?: number;
    backupKeep?: number;
    limits?: Partial<Limits>;
}
export interface Progress {
    id: string;
    phase: string;
    completed: number;
    total: number;
}
export declare class BridgeError extends Error {
    code: string;
    constructor(code: string, message: string);
}
