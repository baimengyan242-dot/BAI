import { createHash, randomUUID } from 'node:crypto';
import { createReadStream, existsSync, mkdirSync, renameSync, writeFileSync } from 'node:fs';
import { dirname, isAbsolute, relative, resolve, sep } from 'node:path';
import { BridgeError } from './types.js';
export const now = () => new Date().toISOString();
export const uid = () => randomUUID();
export const hash = (data: string | Uint8Array) => createHash('sha256').update(data).digest('hex');
export function canonical(value: unknown): string {
  if (Array.isArray(value)) return '[' + value.map(canonical).join(',') + ']';
  if (value && typeof value === 'object') return '{' + Object.keys(value).sort().map(k => JSON.stringify(k) + ':' + canonical((value as Record<string, unknown>)[k])).join(',') + '}';
  return JSON.stringify(value) ?? 'null';
}
export async function fileHash(path: string): Promise<string> { const h = createHash('sha256'); for await (const b of createReadStream(path)) h.update(b); return h.digest('hex'); }
export function inside(root: string, path: string): string {
  const p = resolve(root, path), rel = relative(resolve(root), p);
  if (rel.startsWith('..' + sep) || rel === '..' || isAbsolute(rel)) throw new BridgeError('UNSAFE_PATH', '路径超出数据目录');
  return p;
}
export function atomicJson(path: string, value: unknown): void { mkdirSync(dirname(path), { recursive: true }); const tmp = path + '.' + uid() + '.tmp'; writeFileSync(tmp, JSON.stringify(value, null, 2), { mode: 0o600 }); renameSync(tmp, path); }
export function record(v: unknown): Record<string, unknown> | undefined { return v && typeof v === 'object' && !Array.isArray(v) ? v as Record<string, unknown> : undefined; }
export function text(v: unknown): string { return typeof v === 'string' ? v : ''; }
export function integer(v: unknown, fallback: number, min: number, max: number): number { const n = v === undefined ? fallback : Number(v); if (!Number.isSafeInteger(n) || n < min || n > max) throw new BridgeError('INVALID_ARGUMENT', `数字必须为 ${min} and ${max}`); return n; }
export function date(v: unknown): string | null { if (v == null || v === '') return null; const n = typeof v === 'number' ? (v < 1e11 ? v * 1000 : v) : v; const d = new Date(n as string | number); return Number.isFinite(d.getTime()) ? d.toISOString() : null; }
export function normalize(v: string): string { return v.normalize('NFC').toLocaleLowerCase().replace(/[\p{P}\p{Z}\s]+/gu, '').trim(); }
export function assertFileExists(path: string): void { if (!existsSync(path)) throw new BridgeError('NOT_FOUND', '文件不存在'); }
export function publicError(e: unknown): { code: string; message: string } { return e instanceof BridgeError ? { code: e.code, message: e.message } : { code: 'INTERNAL', message: '操作失败。请检查文件格式、权限或数据库完整性；日志不包含聊天正文。' }; }
export function recallTokens(v: string): number { return Buffer.byteLength(v, 'utf8'); } // A conservative upper bound, including CJK and JSON punctuation.
