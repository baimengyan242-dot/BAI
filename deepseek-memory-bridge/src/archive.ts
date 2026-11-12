import { createReadStream, createWriteStream } from 'node:fs';
import { mkdir, stat } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { Transform } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { crc32 } from 'node:zlib';
import yauzl from 'yauzl';
import type { Entry, ZipFile } from 'yauzl';
import { BridgeError, type Limits } from './types.js';
import { inside } from './util.js';

export function safeEntryName(name: string): string {
  if (!name || name.includes('\0') || name.includes('\\') || name.startsWith('/') || /^[a-z]:/i.test(name) || name.split('/').some(p => p === '..' || /[:<>"|?*]/.test(p) || /[ .]$/.test(p) || /^(con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\.|$)/i.test(p))) throw new BridgeError('UNSAFE_ZIP', 'ZIP 包含不安全文件名');
  return name;
}
export async function extractZip(input: string, output: string, limits: Limits, signal?: AbortSignal): Promise<string[]> {
  const archive = await stat(input);
  if (archive.size > limits.maxArchiveBytes) throw new BridgeError('SIZE_LIMIT', '压缩包超过大小限制');
  const zip: ZipFile = await new Promise((ok, fail) => yauzl.open(input, { lazyEntries: true, validateEntrySizes: true, strictFileNames: true }, (e, z) => e ? fail(e) : ok(z!)));
  const files: string[] = [], names = new Set<string>(); let total = 0, count = 0;
  return new Promise((ok, fail) => {
    let settled = false;
    const abort = () => failure(new BridgeError('CANCELLED', '导入已取消，可重新预览'));
    const failure = (e: unknown) => { if (settled) return; settled = true; signal?.removeEventListener('abort', abort); zip.close(); fail(e); };
    signal?.addEventListener('abort', abort, { once: true });
    zip.on('error', failure);
    zip.on('end', () => { if (!settled) { settled = true; signal?.removeEventListener('abort', abort); ok(files); } });
    zip.on('entry', (entry: Entry) => { void (async () => {
      signal?.throwIfAborted();
      const name = safeEntryName(entry.fileName), key = name.normalize('NFC').toLowerCase();
      if (names.has(key)) throw new BridgeError('UNSAFE_ZIP', 'ZIP 包含重复或大小写冲突的文件名'); names.add(key);
      if (++count > limits.maxEntries) throw new BridgeError('SIZE_LIMIT', 'ZIP 文件数量超过限制');
      const mode = entry.externalFileAttributes >>> 16;
      if ((mode & 0xf000) === 0xa000 || (entry.generalPurposeBitFlag & 1)) throw new BridgeError('UNSAFE_ZIP', '不支持符号链接或加密 ZIP');
      if (entry.uncompressedSize > limits.maxEntryBytes || entry.uncompressedSize / Math.max(entry.compressedSize, 1) > limits.maxCompressionRatio) throw new BridgeError('ZIP_BOMB', 'ZIP 条目大小或压缩比例超过限制');
      if (name.endsWith('/')) { await mkdir(inside(output, name), { recursive: true }); zip.readEntry(); return; }
      total += entry.uncompressedSize;
      if (total > limits.maxExpandedBytes) throw new BridgeError('ZIP_BOMB', 'ZIP 解压总量超过限制');
      const target = inside(output, name); await mkdir(dirname(target), { recursive: true });
      const stream = await new Promise<NodeJS.ReadableStream>((yes, no) => zip.openReadStream(entry, (e, s) => e ? no(e) : yes(s!)));
      let actual = 0, checksum = 0;
      const guard = new Transform({ transform(chunk: Buffer, _encoding, callback) {
        actual += chunk.length; checksum = crc32(chunk, checksum);
        if (actual > entry.uncompressedSize || actual > limits.maxEntryBytes) callback(new BridgeError('ZIP_BOMB', 'ZIP 实际解压大小超出声明')); else callback(null, chunk);
      } });
      await pipeline(stream, guard, createWriteStream(target, { flags: 'wx', mode: 0o600 }), { signal });
      if (actual !== entry.uncompressedSize || checksum !== entry.crc32) throw new BridgeError('CORRUPT_ZIP', 'ZIP 大小或 CRC 校验失败');
      files.push(name); zip.readEntry();
    })().catch(failure); });
    if (signal?.aborted) abort(); else zip.readEntry();
  });
}
export async function copyBounded(input: string, target: string, max: number, signal?: AbortSignal): Promise<void> {
  if ((await stat(input)).size > max) throw new BridgeError('SIZE_LIMIT', '文件超过大小限制');
  await mkdir(dirname(resolve(target)), { recursive: true }); let bytes = 0;
  await pipeline(createReadStream(input), new Transform({ transform(chunk: Buffer, _e, next) { bytes += chunk.length; next(bytes > max ? new BridgeError('SIZE_LIMIT', '文件增长超过限制') : null, chunk); } }), createWriteStream(target, { flags: 'wx', mode: 0o600 }), { signal });
}
