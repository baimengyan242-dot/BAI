import { mkdir, readFile, readdir, rm, stat, writeFile } from 'node:fs/promises';
import { appendFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { MemoryBridge } from './bridge.js';
import { BridgeError, categories, type Progress, type Status } from './types.js';
import { atomicJson, inside, integer, record, text, uid } from './util.js';
import { browseDirectories } from './storage.js';

export class BridgeApi {
  progress: Progress | null = null;
  constructor(readonly bridge: MemoryBridge, readonly pickDirectory?: (signal?: AbortSignal) => Promise<string | null>) { bridge.on('progress', p => { this.progress = p; }); }
  async call(endpoint: string, input: unknown, signal?: AbortSignal): Promise<unknown> {
    const p = record(input) ?? {}, b = this.bridge;
    if (b.relocating) throw new BridgeError('BUSY', '正在切换存储位置，请等待操作完成。');
    switch (endpoint) {
      case 'storage-browse': return browseDirectories(text(p.path) || undefined);
      case 'storage-pick': return { path: this.pickDirectory ? await this.pickDirectory(signal) : null };
      case 'stats': return { ...b.stats(), progress: this.progress };
      case 'imports': return b.imports();
      case 'memories': return b.store.list(text(p.status) as Status || undefined, categories.includes(p.category as any) ? text(p.category) : undefined, integer(p.limit, 50, 1, 100), integer(p.offset, 0, 0, 10000000));
      case 'search': return b.search(text(p.query), text(p.scope) || 'global', integer(p.limit, 50, 1, 100), p.confirmedOnly === true);
      case 'memory': return b.store.memory(text(p.id));
      case 'history': return b.history(text(p.query), integer(p.limit, 50, 1, 100), integer(p.offset, 0, 0, 10000000));
      case 'conversation': return b.readConversation(text(p.id), text(p.version) || undefined, integer(p.offset, 0, 0, 10000000), integer(p.limit, 100, 1, 500));
      case 'raw-conversation': return b.rawConversation(text(p.id), text(p.version) || undefined);
      case 'conflicts': return b.conflicts();
      case 'revisions': return b.revisions(text(p.id));
      case 'actions': return b.actions();
      case 'backups': return b.backups();
      case 'propose': return b.propose(text(p.type), record(p.payload) ?? {}, text(p.description) || '用户请求的操作');
      case 'confirm': return b.confirm(text(p.id), text(p.nonce), signal);
      case 'cancel': return b.cancelAction(text(p.id));
      case 'upload-start': return this.startUpload(text(p.name), integer(p.bytes, 0, 1, b.limits.maxArchiveBytes));
      case 'upload-chunk': return this.uploadChunk(text(p.id), integer(p.offset, 0, 0, b.limits.maxArchiveBytes), text(p.data));
      case 'upload-finish': return this.finishUpload(text(p.id), signal);
      default: throw new BridgeError('NOT_FOUND', '接口不存在');
    }
  }
  private uploadPath(id: string): string { if (!/^[a-f0-9-]{36}$/.test(id)) throw new BridgeError('INVALID_ARGUMENT', '上传 ID 无效'); return inside(this.bridge.dataDir, join('uploads', id)); }
  private async startUpload(name: string, bytes: number) {
    const root = join(this.bridge.dataDir, 'uploads'); let pending = 0, reserved = 0;
    for (const item of await readdir(root, { withFileTypes: true })) {
      if (!item.isDirectory() || item.isSymbolicLink()) continue;
      const full = inside(root, item.name), info = await stat(full);
      if (Date.now() - info.mtimeMs > 24 * 3600000) { await rm(full, { recursive: true, force: true }); continue; }
      pending++; try { reserved += JSON.parse(await readFile(join(full, 'meta.json'), 'utf8')).bytes; } catch { reserved += this.bridge.limits.maxArchiveBytes; }
    }
    if (pending >= 3 || reserved + bytes > this.bridge.limits.maxExpandedBytes) throw new BridgeError('UPLOAD_LIMIT', '待处理上传过多，请完成已有上传或稍后重试');
    const id = uid(), path = this.uploadPath(id); await mkdir(path);
    atomicJson(join(path, 'meta.json'), { name: name.replace(/[\\/\0]/g, '_').slice(0, 200), bytes });
    await writeFile(join(path, 'data.bin'), '', { flag: 'wx', mode: 0o600 }); return { id };
  }
  private async uploadChunk(id: string, offset: number, data: string) {
    if (data.length > 90000 || !/^[A-Za-z0-9+/]*={0,2}$/.test(data)) throw new BridgeError('INVALID_ARGUMENT', '上传分块无效');
    const dir = this.uploadPath(id), meta = JSON.parse(await readFile(join(dir, 'meta.json'), 'utf8')), path = join(dir, 'data.bin');
    const bytes = Buffer.from(data, 'base64'), current = (await stat(path)).size;
    if (bytes.length > 65536 || !bytes.length || current !== offset || offset + bytes.length > meta.bytes) throw new BridgeError('UPLOAD_OFFSET', '上传偏移或分块大小不匹配，请重新选择文件');
    // No await between size check and append: concurrent duplicate chunks cannot interleave.
    if (statSync(path).size !== offset) throw new BridgeError('UPLOAD_OFFSET', '上传已前进，请重试');
    appendFileSync(path, bytes); return { received: offset + bytes.length, total: meta.bytes };
  }
  private async finishUpload(id: string, signal?: AbortSignal) {
    const dir = this.uploadPath(id), meta = JSON.parse(await readFile(join(dir, 'meta.json'), 'utf8'));
    if ((await stat(join(dir, 'data.bin'))).size !== meta.bytes) throw new BridgeError('UPLOAD_INCOMPLETE', '文件尚未上传完成');
    const preview = await this.bridge.previewFile(join(dir, 'data.bin'), signal, meta.name);
    if (preview.status === 'preview') {
      preview.fileName = meta.name; this.bridge.store.run('UPDATE imports SET file_name=?,preview_json=? WHERE id=?', meta.name, JSON.stringify(preview), preview.id);
    }
    await rm(dir, { recursive: true, force: true }); return preview;
  }
}
