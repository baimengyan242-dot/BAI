import { type Limits } from './types.js';
export declare function safeEntryName(name: string): string;
export declare function extractZip(input: string, output: string, limits: Limits, signal?: AbortSignal): Promise<string[]>;
export declare function copyBounded(input: string, target: string, max: number, signal?: AbortSignal): Promise<void>;
