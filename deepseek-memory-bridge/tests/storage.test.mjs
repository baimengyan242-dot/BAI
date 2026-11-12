import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, readFile, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, parse, resolve } from 'node:path';
import { MemoryBridge, BridgeApi, resolveDataDir, validateLibrary } from '../dist/core.js';

async function fixture() {
  const root = await mkdtemp(join(tmpdir(), 'dmb-storage-'));
  const source = join(root, 'source'), target = join(root, 'target'), locationFile = join(root, 'profile', 'memory-bridge-location.json');
  return { root, source, target, locationFile, bridge: new MemoryBridge({ dataDir: source, locationFile }) };
}
async function confirm(b, type, payload) {
  const p = b.propose(type, payload, 'Explicit operator confirmation for storage test');
  const a = b.actions().find(a => a.id === p.actionId); return b.confirm(a.id, a.nonce);
}

test('migration preserves every library area, rebases paths, removes the source and persists across restart', async t => {
  const f = await fixture(); let b = f.bridge; t.after(() => b.close());
  const input = resolve('tests/fixtures/simulated-deepseek.json');
  const p = await b.previewFile(input); await confirm(b, 'import', { id: p.id });
  const count = b.stats(), raw = b.rawConversation('sim-russian-learning'), memories = b.store.list();
  const exportResult = await confirm(b, 'export', { format: 'json', includeRaw: true });
  await mkdir(join(b.dataDir, 'custom')); await writeFile(join(b.dataDir, 'custom', 'extra.bin'), Buffer.from([0, 255, 17]));
  const api = new BridgeApi(b), upload = await api.call('upload-start', { name: 'unfinished.json', bytes: 3 });
  await api.call('upload-chunk', { id: upload.id, offset: 0, data: 'e30=' });
  const backups = b.backups();
  const result = await confirm(b, 'storage', { path: f.target, mode: 'migrate' });
  assert.equal(result.sourceRemoved, true); assert.equal(existsSync(f.source), false);
  assert.equal(b.dataDir, f.target); assert.equal(b.stats().messages, count.messages);
  assert.deepEqual(b.rawConversation('sim-russian-learning'), raw);
  assert.deepEqual(b.store.list(), memories); assert.deepEqual(b.backups(), backups);
  assert.deepEqual(await readFile(join(f.target, 'archives', p.id, 'source.bin')), await readFile(input));
  assert.deepEqual(await readFile(join(f.target, 'custom', 'extra.bin')), Buffer.from([0, 255, 17]));
  assert.equal((await stat(exportResult.path.replace(f.source, f.target))).size > 0, true);
  assert.equal((await readFile(join(f.target, 'uploads', upload.id, 'data.bin'), 'utf8')), '{}');
  assert.ok(b.store.all('SELECT directory FROM imports').every(r => r.directory.startsWith(f.target)));
  assert.equal(resolveDataDir('', f.locationFile), f.target);
  await b.close(); b = new MemoryBridge({ dataDir: resolveDataDir('', f.locationFile), locationFile: f.locationFile });
  assert.equal(b.history().length, count.conversations);
  assert.deepEqual(b.rawConversation('sim-russian-learning'), raw);
  // Existing backup manifests and databases still restore after changing drives.
  await confirm(b, 'restore', { backupId: backups[0].id });
  assert.equal(b.stats().messages, count.messages);
  assert.ok(b.store.all('SELECT directory FROM imports').every(r => r.directory.startsWith(f.target)));
});

test('migration refuses unsafe or occupied destinations and keeps the source readable on failure', async t => {
  const f = await fixture(), b = f.bridge; t.after(() => b.close());
  await mkdir(f.target); await writeFile(join(f.target, 'sentinel.txt'), 'keep');
  for (const path of [f.source, join(f.source, 'nested'), f.root, 'relative-folder', parse(resolve(f.source)).root]) {
    await assert.rejects(() => confirm(b, 'storage', { path, mode: 'migrate' }));
  }
  await assert.rejects(() => confirm(b, 'storage', { path: f.target, mode: 'migrate' }), e => e.code === 'DESTINATION_NOT_EMPTY');
  assert.equal(await readFile(join(f.target, 'sentinel.txt'), 'utf8'), 'keep');
  assert.equal(b.dataDir, f.source); assert.equal(b.stats().conversations, 0); assert.equal(existsSync(f.locationFile), false);
  const badPointer = join(f.root, 'blocked'); await writeFile(badPointer, 'not a directory'); b.options.locationFile = join(badPointer, 'location.json');
  await assert.rejects(() => confirm(b, 'storage', { path: join(f.root, 'copy'), mode: 'migrate' }));
  assert.equal(b.dataDir, f.source); assert.equal(existsSync(join(f.source, 'memory.sqlite')), true);
  assert.equal(b.stats().messages, 0);
});

test('open existing library validates archives, retains the old library and rejects a second writer', async t => {
  const f = await fixture(), b = f.bridge; t.after(() => b.close());
  let other = new MemoryBridge({ dataDir: f.target });
  const p = await other.previewFile(resolve('tests/fixtures/simulated-deepseek.json')); await confirm(other, 'import', { id: p.id });
  await assert.rejects(() => confirm(b, 'storage', { path: f.target, mode: 'open' }), e => e.code === 'STORAGE_LOCKED');
  assert.throws(() => new MemoryBridge({ dataDir: f.source }), e => e.code === 'STORAGE_LOCKED');
  await other.close();
  await confirm(b, 'storage', { path: f.target, mode: 'open' });
  assert.equal(b.stats().conversations, 1); assert.equal(existsSync(join(f.source, 'memory.sqlite')), true);
  assert.equal(resolveDataDir('', f.locationFile), f.target);
  assert.ok(validateLibrary(f.target).messages > 0);
});

test('folder selection lists drives and directories; a missing saved drive never creates an empty library', async t => {
  const f = await fixture(), b = f.bridge; t.after(() => b.close());
  const api = new BridgeApi(b, async () => f.target);
  assert.equal((await api.call('storage-pick')).path, f.target);
  const listing = await api.call('storage-browse', { path: f.root });
  assert.ok(listing.directories.includes(f.source));
  const top = await api.call('storage-browse'); assert.ok(Array.isArray(top.directories));
  await mkdir(join(f.root, 'profile')); await writeFile(f.locationFile, JSON.stringify({ format: 1, dataDir: join(f.root, 'missing') }));
  assert.throws(() => resolveDataDir('', f.locationFile), e => e.code === 'STORAGE_UNAVAILABLE');
  assert.equal(existsSync(join(f.root, 'missing')), false);
});
