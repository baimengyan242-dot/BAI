import { type Memory, type ParsedConversation } from './types.js';
export declare function containsSecret(value: string): boolean;
export declare function unsafeInstruction(value: string): boolean;
export declare function localExtract(conversation: ParsedConversation, scope?: string): Memory[];
export interface ModelConfig {
    endpoint: string;
    model: string;
    keyEnv?: string;
}
export declare function validateEndpoint(endpoint: string): {
    url: URL;
    remote: boolean;
};
/** Optional OpenAI-compatible extraction. It never reads DSH credentials or browser data. */
export declare function modelExtract(c: ParsedConversation, config: ModelConfig, authorizedRemote: boolean, scope?: string, signal?: AbortSignal): Promise<Memory[]>;
