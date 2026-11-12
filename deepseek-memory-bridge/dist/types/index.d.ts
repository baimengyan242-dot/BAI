import type { Context } from '@deepseek-ai/cordis';
import Schema from '@deepseek-ai/schemastery';
export declare const name = "deepseek-memory-bridge";
export declare const inject: string[];
export interface Config {
    dataDir: string;
    autoRecall: boolean;
    recallBudgetTokens: number;
    recallLimit: number;
    backupKeep: number;
    maxArchiveMiB: number;
    maxExpandedMiB: number;
    maxConversationMiB: number;
}
export declare const Config: Schema<Schemastery.ObjectS<NoInfer<{
    dataDir: Schema<string, string, "defined">;
    autoRecall: Schema<boolean, boolean, "defined">;
    recallBudgetTokens: Schema<number, number, "defined">;
    recallLimit: Schema<number, number, "defined">;
    backupKeep: Schema<number, number, "defined">;
    maxArchiveMiB: Schema<number, number, "defined">;
    maxExpandedMiB: Schema<number, number, "defined">;
    maxConversationMiB: Schema<number, number, "defined">;
}>>, Schemastery.ObjectT<NoInfer<{
    dataDir: Schema<string, string, "defined">;
    autoRecall: Schema<boolean, boolean, "defined">;
    recallBudgetTokens: Schema<number, number, "defined">;
    recallLimit: Schema<number, number, "defined">;
    backupKeep: Schema<number, number, "defined">;
    maxArchiveMiB: Schema<number, number, "defined">;
    maxExpandedMiB: Schema<number, number, "defined">;
    maxConversationMiB: Schema<number, number, "defined">;
}>>, "plain">;
export declare function apply(ctx: Context, config: Config): void;
