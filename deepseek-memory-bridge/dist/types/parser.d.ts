import { type Limits, type ParsedConversation } from './types.js';
export interface Adapter {
    id: string;
    match(value: Record<string, unknown>): boolean;
    parse(value: Record<string, unknown>): ParsedConversation;
}
export declare const adapters: Adapter[];
export declare function registerAdapter(adapter: Adapter): () => void;
export declare function adapt(value: unknown): ParsedConversation | undefined;
/** Streams one conversation at a time. Unmapped fields remain in the byte-exact source archive. */
export declare function parseJsonFile(path: string, limits: Limits, signal?: AbortSignal): AsyncGenerator<ParsedConversation | undefined>;
