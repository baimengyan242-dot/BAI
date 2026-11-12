import assert from 'node:assert/strict';
import { mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
const packageRoot = process.argv[2];
if (!packageRoot) throw new Error('Pass an installed package directory');
const { MemoryBridge } = await import(pathToFileURL(join(resolve(packageRoot), 'dist/core.js')).href);
const dataDir = await mkdtemp(join(tmpdir(), 'dmb-installed-'));
async function confirm(b, type, payload) { const p = b.propose(type, payload, 'isolated installed-artifact verification'); const a = b.actions().find(x => x.id === p.actionId); return b.confirm(a.id, a.nonce); }
let bridge = new MemoryBridge({ dataDir, autoRecall: true, recallBudgetTokens: 1600 });
try {
  const preview = await bridge.previewFile(resolve('tests/fixtures/simulated-deepseek.json')); await confirm(bridge, 'import', { id: preview.id });
  const target = bridge.store.list().find(m => m.key === 'russian.target-level'); await confirm(bridge, 'review', { id: target.id, status: 'confirmed' });
  assert.deepEqual(await readFile(join(dataDir, 'archives', preview.id, 'source.bin')), await readFile('tests/fixtures/simulated-deepseek.json'));
  await bridge.close(); bridge = new MemoryBridge({ dataDir, autoRecall: true, recallBudgetTokens: 1600 });
  assert.match(bridge.recall('\u4fc4\u8bed\u76ee\u6807'), /B1\+/);
  const report = { passed: true, node: process.versions.node, electron: process.versions.electron, packageRoot: resolve(packageRoot), dataDir, checks: ['installed package import', 'actual runtime SQLite backup', 'raw bytes preserved', 'review', 'database reopen', 'confirmed recall'] };
  if (process.argv[3]) await writeFile(process.argv[3], JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
} finally { await bridge.close(); }
