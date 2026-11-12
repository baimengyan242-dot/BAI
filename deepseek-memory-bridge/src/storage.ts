import { existsSync, lstatSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { access, readdir } from 'node:fs/promises';
import { homedir } from 'node:os';
import { dirname, isAbsolute, join, parse, resolve, sep } from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { BridgeError } from './types.js';
import { atomicJson, uid } from './util.js';

export function locationFile(home = process.env.DSH_HOME || join(homedir(), '.dsh')): string { return join(home, 'memory-bridge-location.json'); }
export function resolveDataDir(configured = '', file = locationFile()): string {
  if (existsSync(file)) {
    const saved = JSON.parse(readFileSync(file, 'utf8'));
    if (saved.format !== 1 || typeof saved.dataDir !== 'string' || !isAbsolute(saved.dataDir)) throw new BridgeError('INVALID_LOCATION', '已保存的存储位置无效，请修复位置配置后再打开记忆库。');
    if (configured && resolve(configured) !== resolve(saved.dataDir) && !(saved.previousDirs ?? []).includes(resolve(configured))) return absoluteDirectory(configured);
    if (!existsSync(join(saved.dataDir, 'memory.sqlite'))) throw new BridgeError('STORAGE_UNAVAILABLE', '已保存的记忆库不可用。请重新连接磁盘或修复位置配置，插件不会自动创建空库替代原库。');
    return absoluteDirectory(saved.dataDir);
  }
  if (configured) return absoluteDirectory(configured);
  const legacy = join(dirname(file), 'memory-bridge');
  // Existing libraries remain readable until the operator chooses Migrate.
  if (existsSync(join(legacy, 'memory.sqlite'))) return legacy;
  if (process.platform === 'win32') {
    if (!existsSync('D:\\')) throw new BridgeError('STORAGE_REQUIRED', '默认 D 盘不可用，请在 dataDir 配置中指定可用数据盘的专用文件夹。');
    return 'D:\\DeepSeekMemoryBridge';
  }
  return join(process.env.XDG_DATA_HOME || join(homedir(), '.local', 'share'), 'deepseek-memory-bridge');
}
export function absoluteDirectory(path: string): string {
  if (!isAbsolute(path) || /\0/.test(path) || (process.platform === 'win32' && !/^(?:[a-z]:[\\/]|\\\\[^\\]+\\[^\\]+)/i.test(path))) throw new BridgeError('INVALID_LOCATION', '请选择包含盘符的绝对文件夹路径。');
  const full = resolve(path);
  if (full === parse(full).root) throw new BridgeError('INVALID_LOCATION', '请选择专用文件夹，不能直接选择磁盘根目录。');
  for (let current = full; ; current = dirname(current)) {
    if (existsSync(current) && lstatSync(current).isSymbolicLink()) throw new BridgeError('UNSAFE_PATH', '存储路径不能经过符号链接或目录联接。');
    if (current === dirname(current)) break;
  }
  return full;
}
export function overlap(a: string, b: string): boolean {
  const fold = (p: string) => process.platform === 'win32' ? p.toLowerCase() : p;
  const left = fold(resolve(a)), right = fold(resolve(b));
  return left === right || left.startsWith(right + sep) || right.startsWith(left + sep);
}
export function acquireStorageLock(root: string): () => void {
  const path = join(root, '.bridge-lock.json'), token = uid();
  if (existsSync(path)) {
    let lock: { pid?: number };
    try { lock = JSON.parse(readFileSync(path, 'utf8')); } catch { throw new BridgeError('STORAGE_LOCKED', '无法读取记忆库锁文件。请关闭所有正在使用该库的程序后再修复。'); }
    if (!Number.isInteger(lock.pid) || lock.pid! <= 0) throw new BridgeError('STORAGE_LOCKED', '记忆库锁文件无效。请关闭所有正在使用该库的程序后再修复。');
    try { process.kill(lock.pid!, 0); throw new BridgeError('STORAGE_LOCKED', '另一个进程正在使用此记忆库，请退出该进程后重试。'); }
    catch (e) { if ((e as NodeJS.ErrnoException).code !== 'ESRCH') throw e; }
    rmSync(path);
  }
  try { writeFileSync(path, JSON.stringify({ pid: process.pid, token }), { flag: 'wx', mode: 0o600 }); }
  catch { throw new BridgeError('STORAGE_LOCKED', '另一个进程已锁定此记忆库，请稍后重试。'); }
  return () => { if (existsSync(path) && JSON.parse(readFileSync(path, 'utf8')).token === token) rmSync(path); };
}
export function saveLocation(file: string | undefined, dataDir: string, previousDir?: string): void {
  if (!file) return;
  mkdirSync(dirname(file), { recursive: true });
  let previousDirs: string[] = [];
  if (existsSync(file)) { const old = JSON.parse(readFileSync(file, 'utf8')); previousDirs = Array.isArray(old.previousDirs) ? old.previousDirs : []; }
  atomicJson(file, { format: 1, dataDir, previousDirs: [...new Set([...previousDirs, ...(previousDir ? [previousDir] : [])])], updatedAt: new Date().toISOString() });
}
export function databaseCounts(db: DatabaseSync): Record<string, number> {
  return Object.fromEntries(['imports', 'staged', 'conversations', 'conversation_versions', 'import_conversations', 'messages', 'memories', 'memory_sources', 'revisions', 'conflicts', 'actions', 'settings', 'memory_fts', 'history_fts'].map(table => [table, Number((db.prepare(`SELECT COUNT(*) n FROM ${table}`).get() as any).n)]));
}
export function validateLibrary(root: string): Record<string, number> {
  if (!existsSync(join(root, 'memory.sqlite'))) throw new BridgeError('INVALID_LIBRARY', '所选文件夹中没有 Memory Bridge 数据库，请选择包含 memory.sqlite 的记忆库目录。');
  const db = new DatabaseSync(join(root, 'memory.sqlite'), { readOnly: true });
  try {
    if ((db.prepare('PRAGMA quick_check').get() as any)?.quick_check !== 'ok' || (db.prepare('SELECT MAX(version) v FROM schema_version').get() as any)?.v !== 1) throw new BridgeError('INVALID_LIBRARY', '数据库完整性或结构版本校验失败，已停止打开。');
    const counts = databaseCounts(db);
    for (const row of db.prepare('SELECT id,status FROM imports').all() as any[]) {
      if (!/^[a-f0-9-]{36}$/.test(row.id)) throw new BridgeError('INVALID_LIBRARY', '记忆库中的原始存档标识无效。');
      const area = ['completed', 'importing'].includes(row.status) ? 'archives' : 'staging';
      if (!['failed', 'preparing'].includes(row.status) && !existsSync(join(root, area, row.id, 'source.bin'))) throw new BridgeError('INVALID_LIBRARY', '所选记忆库缺少已导入的原始存档，请检查 archives 和 staging 文件夹。');
    }
    return counts;
  } finally { db.close(); }
}
export async function browseDirectories(path?: string): Promise<{ path: string; parent: string | null; directories: string[]; truncated: boolean }> {
  if (!path && process.platform === 'win32') {
    const drives = await Promise.all(Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i) + ':\\').map(async p => { try { await access(p); return p; } catch { return null; } }));
    return { path: '', parent: null, directories: drives.filter((p): p is string => !!p), truncated: false };
  }
  const full = path ? resolve(path) : homedir();
  if (path && !isAbsolute(path)) throw new BridgeError('INVALID_LOCATION', '请输入完整的绝对文件夹路径。');
  const entries = await readdir(full, { withFileTypes: true });
  const folders = entries.filter(e => e.isDirectory() && !e.isSymbolicLink()).map(e => join(full, e.name)).sort((a, b) => a.localeCompare(b));
  return { path: full, parent: dirname(full) === full ? null : dirname(full), directories: folders.slice(0, 300), truncated: folders.length > 300 };
}
