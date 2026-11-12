import { MemoryBridge } from './bridge.js';
import { type Progress } from './types.js';
export declare class BridgeApi {
    readonly bridge: MemoryBridge;
    readonly pickDirectory?: ((signal?: AbortSignal) => Promise<string | null>) | undefined;
    progress: Progress | null;
    constructor(bridge: MemoryBridge, pickDirectory?: ((signal?: AbortSignal) => Promise<string | null>) | undefined);
    call(endpoint: string, input: unknown, signal?: AbortSignal): Promise<unknown>;
    private uploadPath;
    private startUpload;
    private uploadChunk;
    private finishUpload;
}
