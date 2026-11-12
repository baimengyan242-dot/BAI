import assert from 'node:assert/strict';
import { Context } from '@deepseek-ai/cordis';
import SystemPrompt from '@deepseek-ai/dsh-system-prompt';
import Tools from '@deepseek-ai/dsh-tools';
import * as NativeExecutor from '@deepseek-ai/dsh-tool-executor-native';
import { mkdtemp, mkdir, writeFile, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import * as bridgePlugin from '../dist/index.js';
import { MemoryBridge } from '../dist/core.js';
const target = process.argv[2]; if (!target) throw new Error('Pass the installed third-party lib/index.js path');
const root = await mkdtemp(join(tmpdir(), 'dmb-compat-')), originalEnv = process.env.DSH_HOME; process.env.DSH_HOME = root;
const previousDir = join(root, 'memory-migration'); await mkdir(previousDir); const sentinel = join(previousDir, 'sentinel.txt'); await writeFile(sentinel, 'synthetic existing plugin data');
const ctx = new Context();
try {
  await ctx.plugin(SystemPrompt); await ctx.plugin(Tools); await ctx.plugin(NativeExecutor);
  const existing = await import(pathToFileURL(resolve(target)).href), oldFiber = ctx.plugin(existing); await oldFiber;
  let ready = false;
  for (let n = 0; n < 100; n++) { const a = await ctx.systemPrompt.assemble(); if (a.sections.some(s => s.name === 'plugin:memory-migration')) { ready = true; break; } await new Promise(r => setTimeout(r, 10)); }
  assert.equal(ready, true);
  const dataDir = join(root, 'memory-bridge'); const newFiber = ctx.plugin(bridgePlugin, { dataDir, autoRecall: false, recallBudgetTokens: 800, recallLimit: 6, backupKeep: 10, maxArchiveMiB: 512, maxExpandedMiB: 1024, maxConversationMiB: 16 }); await newFiber;
  const b = new MemoryBridge({ dataDir }); const preview = await b.previewFile(resolve('tests/fixtures/simulated-deepseek.json')); const p = b.propose('import', { id: preview.id }, 'synthetic compatibility test'); const a = b.actions().find(x => x.id === p.actionId); await b.confirm(a.id, a.nonce); await b.close();
  assert.equal(ctx.tools.schemas().filter(t => t.name.startsWith('deepseek_memory_')).length, 8);
  assert.equal((await readFile(sentinel, 'utf8')), 'synthetic existing plugin data');
  await newFiber.dispose(); assert.ok((await ctx.systemPrompt.assemble()).sections.some(s => s.name === 'plugin:memory-migration'));
  await oldFiber.dispose();
  console.log(JSON.stringify({ passed: true, thirdParty: '@tieveto666-code/dsh-memory-migration 0.1.2', isolatedHome: root, originalUserDataAccessed: false, assertions: ['both plugins load', '8 unique tools', 'separate storage', 'existing sentinel unchanged', 'unload new plugin retains old prompt section'] }, null, 2));
} finally { await ctx.fiber.dispose(); if (originalEnv === undefined) delete process.env.DSH_HOME; else process.env.DSH_HOME = originalEnv; }
