import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import { createRequire } from 'node:module';
import { Context } from '@deepseek-ai/cordis';
const require = createRequire(import.meta.url);
test('native closure-factory client registers the real DSH settings.section', async () => {
  let rendererEntry;
  vm.runInNewContext(await readFile('node_modules/@deepseek-ai/dsh-client-ui-renderer/lib/client.js', 'utf8'), { window: { __ModuleLoader__: { load(e) { rendererEntry = e; } } } });
  const { SlotRegistry } = rendererEntry.factory(require);
  let entry;
  vm.runInNewContext(await readFile('dist/client.js', 'utf8'), { window: { __ModuleLoader__: { load(e) { entry = e; } } } });
  assert.equal(entry.id, 'dsh-deepseek-memory-bridge');
  const client = entry.factory(name => { assert.ok(['react', 'react/jsx-runtime'].includes(name)); return require(name); });
  assert.equal(typeof client.apply, 'function'); const ctx = new Context();
  try {
    const slots = new SlotRegistry(ctx);
    // settings.section is owned by the settings shell; declare its actual runtime contract.
    slots.register({ name: 'root', children: { 'settings.section': { kind: 'list', scope: 'root' } } }, () => null);
    ctx.provide('connection', { rpc: { async call() { return { ok: true, value: {} }; } } });
    const fiber = ctx.plugin(client); await fiber;
    assert.equal(slots.entries('settings.section').some(e => e.options.id === 'deepseek-memory-bridge'), true);
    await fiber.dispose(); assert.equal(slots.entries('settings.section').length, 0);
  } finally { await ctx.fiber.dispose(); }
});
