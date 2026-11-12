import React from 'react';
import type { Context } from '@deepseek-ai/cordis';
export type Caller = (endpoint: string, payload?: Record<string, unknown>) => Promise<any>;
export declare function BridgeManager({ call }: {
    call: Caller;
}): React.JSX.Element;
export declare const inject: string[];
export declare function apply(ctx: Context): void;
