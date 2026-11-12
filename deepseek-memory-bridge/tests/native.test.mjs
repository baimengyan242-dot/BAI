import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import * as NativeExecutor from '@deepseek-ai/dsh-tool-executor-native';
import { Context } from '@deepseek-ai/cordis';
import SystemPrompt from '@deepseek-ai/dsh-system-prompt';
import ToolRuntime from '@deepseek-ai/dsh-tools';
import { createUserMessage } from '@deepseek-ai/dsh-llm';
import { agentEvents } from '@deepseek-ai/dsh-agent';
import { HostConnectionService } from '@deepseek-ai/dsh-client-connection';
import * as plugin from '../dist/index.js';
import { MemoryBridge } from '../dist/core.js';

const defaultConfig = { autoRecall: true, recallBudgetTokens: 1600, recallLimit: 6, backupKeep: 10, maxArchiveMiB: 512, maxExpandedMiB: 1024, maxConversationMiB: 16 };
async function confirm(b, type, payload) { const p = b.propose(type, payload, '\u6a21\u62df\u7528\u6237\u786e\u8ba4'); const a = b.actions().find(a => a.id === p.actionId); return b.confirm(a.id, a.nonce); }
async function fixture() {
  const ctx = new Context(); await ctx.plugin(SystemPrompt); await ctx.plugin(ToolRuntime);
  await ctx.plugin(NativeExecutor);
  return ctx;
}
test('real Cordis 4.1.0 and DSH rc.1 register, execute and unload eight tools', async () => {
  const ctx = await fixture(), dataDir = await mkdtemp(join(tmpdir(), 'dmb-native-'));
  const fiber = ctx.plugin(plugin, { ...defaultConfig, dataDir }); await fiber;
  try {
    assert.equal(ctx.tools.schemas().filter(t => t.name.startsWith('deepseek_memory_')).length, 8);
    const result = await ctx.tools.execute({ signal: new AbortController().signal, calls: [{ type: 'tool-call', id: 'native-stats', name: 'deepseek_memory_stats', arguments: '{}' }] });
    assert.equal(result.results[0].result.isError, false); assert.equal(result.results[0].result.value.conversations, 0);
    await fiber.dispose(); assert.equal(ctx.tools.schemas().filter(t => t.name.startsWith('deepseek_memory_')).length, 0);
    const b = new MemoryBridge({ dataDir }); assert.equal(b.stats().schemaVersion, 1); await b.close();
  } finally { await ctx.fiber.dispose(); }
});
test('real dynamic contexts recall sourced facts across sessions and skip unrelated queries', async () => {
  const ctx = await fixture(), dataDir = await mkdtemp(join(tmpdir(), 'dmb-native-'));
  let b = new MemoryBridge({ dataDir }); const p = await b.previewFile(resolve('tests/fixtures/simulated-deepseek.json')); await confirm(b, 'import', { id: p.id });
  const target = b.store.list().find(m => m.key === 'russian.target-level'); await confirm(b, 'review', { id: target.id, status: 'confirmed' }); await b.close();
  ctx.systemPrompt.section({ name: 'existing-memory-plugin:sentinel', order: 20, text: '\u5df2\u6709\u8bb0\u5fc6\u63d2\u4ef6\u5185\u5bb9\u4fdd\u6301\u72ec\u7acb' });
  const fiber = ctx.plugin(plugin, { ...defaultConfig, dataDir }); await fiber;
  try {
    for (const id of ['session-A', 'session-B']) {
      const agent = { id, session: { header: { cwd: 'D:/synthetic-project' } } }, message = createUserMessage({ content: [{ type: 'text', text: '\u6211\u4e4b\u524d\u7684\u4fc4\u8bed\u5b66\u4e60\u76ee\u6807\u662f\u4ec0\u4e48？' }], source: { kind: 'user' } });
      await agentEvents(ctx, agent).waterfall('agent/pre-step', { messages: [message], turn: 1, step: 1, signal: new AbortController().signal, modelSelection: { provider: 'test', model: 'test' } }, async () => ({ kind: 'enter', messages: [message] }));
      const assembly = await ctx.systemPrompt.assemble({ agent }); const recall = assembly.contexts.find(c => c.name === 'deepseek-memory-bridge:recall');
      assert.match(recall.text, /B1\+/); assert.match(recall.text, /sim-u1/); assert.ok(assembly.sections.some(s => s.name === 'existing-memory-plugin:sentinel'));
    }
    const agent = { id: 'session-C', session: { header: {} } }, message = createUserMessage({ content: [{ type: 'text', text: '\u8ba1\u7b97 2+2' }], source: { kind: 'user' } });
    await agentEvents(ctx, agent).waterfall('agent/pre-step', { messages: [message], turn: 1, step: 1, signal: new AbortController().signal, modelSelection: { provider: 'test', model: 'test' } }, async () => ({ kind: 'enter', messages: [message] }));
    const assembly = await ctx.systemPrompt.assemble({ agent }); assert.ok(!assembly.contexts.some(c => c.name === 'deepseek-memory-bridge:recall' && c.text));
    await fiber.dispose(); const reinstalled = ctx.plugin(plugin, { ...defaultConfig, dataDir }); await reinstalled;
    const m = ctx.tools.get('deepseek_memory_search'); const result = await m.execute({ query: '\u4fc4\u8bed\u76ee\u6807' }, { signal: new AbortController().signal }); assert.ok(result.some(m => m.id === target.id)); await reinstalled.dispose();
  } finally { await ctx.fiber.dispose(); }
});
test('native RPC rejects non-owners and removes its route on unload', async () => {
  const ctx = await fixture(), dataDir = await mkdtemp(join(tmpdir(), 'dmb-native-'));
  await ctx.plugin({ apply(inner) { new HostConnectionService(inner, [], {}); } });
  const fiber = ctx.plugin(plugin, { ...defaultConfig, dataDir }); await fiber;
  try {
    const handler = ctx.get('connection').createSharedFetchHandler('/api');
    const request = () => new Request('http://127.0.0.1/api/deepseek-memory-bridge', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ type: 'client-request', rpcId: 'test-1', method: 'deepseek-memory-bridge', payload: { endpoint: 'stats', input: {} } }) });
    const denied = await handler.fetch(request(), { principal: { kind: 'api' } }); assert.equal(denied.status, 403);
    const allowed = await handler.fetch(request(), { principal: { kind: 'owner' } }); assert.equal((await allowed.json()).result.ok, true);
    await fiber.dispose(); assert.equal((await handler.fetch(request(), { principal: { kind: 'owner' } })).status, 404);
  } finally { await fiber.dispose(); await ctx.fiber.dispose(); }
});
