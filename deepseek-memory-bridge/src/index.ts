import type { Context } from '@deepseek-ai/cordis';
import Schema from '@deepseek-ai/schemastery';
import type {} from '@deepseek-ai/dsh-agent';
import type {} from '@deepseek-ai/dsh-system-prompt';
import type {} from '@deepseek-ai/dsh-client-connection';
import { MemoryBridge } from './bridge.js';
import { BridgeApi } from './api.js';
import { registerTools } from './tools.js';
import { publicError, record, text } from './util.js';
import { locationFile, resolveDataDir } from './storage.js';

export const name = 'deepseek-memory-bridge';
export const inject = ['tools', 'systemPrompt'];
export interface Config { dataDir: string; autoRecall: boolean; recallBudgetTokens: number; recallLimit: number; backupKeep: number; maxArchiveMiB: number; maxExpandedMiB: number; maxConversationMiB: number; }
export const Config = Schema.object({
  dataDir: Schema.string().default('').description('数据目录。留空优先使用已保存的位置；已有旧库可迁移，新建 Windows 记忆库默认使用 D 盘。'),
  autoRecall: Schema.boolean().default(false).description('启用自动召回；已安装其他记忆插件时请先检查重复注入'),
  recallBudgetTokens: Schema.number().min(128).max(8000).step(1).default(800).description('每次召回的保守 Token 上限'),
  recallLimit: Schema.number().min(1).max(20).step(1).default(6),
  backupKeep: Schema.number().min(1).max(100).step(1).default(10),
  maxArchiveMiB: Schema.number().min(1).max(4096).step(1).default(512),
  maxExpandedMiB: Schema.number().min(1).max(8192).step(1).default(1024),
  maxConversationMiB: Schema.number().min(1).max(128).step(1).default(16),
});
export function apply(ctx: Context, config: Config): void {
  const bridge = new MemoryBridge({ ...config, locationFile: locationFile(), dataDir: resolveDataDir(config.dataDir), limits: { maxArchiveBytes: config.maxArchiveMiB * 1024 ** 2, maxExpandedBytes: config.maxExpandedMiB * 1024 ** 2, maxEntryBytes: config.maxArchiveMiB * 1024 ** 2, maxConversationBytes: config.maxConversationMiB * 1024 ** 2 } });
  ctx.effect(() => () => bridge.close(), 'Memory Bridge: close local database');
  registerTools(ctx, bridge); const api = new BridgeApi(bridge, async signal => {
    const picker = (ctx as any).get('directoryPicker')?.capability();
    return picker?.kind === 'native' ? picker.pick(signal ?? new AbortController().signal) : null;
  });
  const queries = new Map<string, { query: string; scope: string }>();
  ctx.on('agent/pre-step', async ({ agent, messages }, next) => {
    const decision = await next();
    if (decision.kind === 'enter') {
      const typed = decision.messages.filter(m => m.source.kind === 'user');
      if (typed.length) queries.set(String(agent.id), { query: typed.flatMap(m => m.content).filter(b => b.type === 'text').map(b => b.text).join('\n'), scope: agent.session.header.cwd || 'global' });
    }
    return decision;
  });
  ctx.on('agent/disposed', ({ agent }) => { queries.delete(String(agent.id)); });
  ctx.systemPrompt.context({ name: 'deepseek-memory-bridge:recall', order: 850, interpolate: false,
    text: context => { const q = context.agent ? queries.get(String(context.agent.id)) : undefined; return q ? bridge.recall(q.query, q.scope) : ''; } });
  // Exact Fetch routes share DSH's authenticated /api carrier. Connection itself
  // enforces owner-only admission, including desktop IPC and remote principals.
  ctx.inject(['connection'], child => {
    const remove = child.connection.fetch.register({ path: '/api/deepseek-memory-bridge', methods: ['POST'], requestBody: 'buffered',
      fetch: async request => {
        let envelope: Record<string, unknown> | undefined;
        try { envelope = record(await request.json()); } catch { return new Response('invalid JSON', { status: 400 }); }
        if (!envelope || envelope.type !== 'client-request' || typeof envelope.rpcId !== 'string' || envelope.rpcId.length > 200) return new Response('invalid RPC envelope', { status: 400 });
        const payload = record(envelope.payload) ?? {};
        let result;
        try { result = { ok: true, value: await api.call(text(payload.endpoint), payload.input, request.signal) }; }
        catch (e) { result = { ok: false, error: { ...publicError(e), details: {} } }; }
        return Response.json({ type: 'server-response', rpcId: envelope.rpcId, result });
      },
    });
    child.effect(() => remove, 'Memory Bridge: authenticated API route');
  });
  ctx.logger.info('DeepSeek Memory Bridge 已加载。原始数据保存在独立目录，卸载插件不会删除数据。');
}
