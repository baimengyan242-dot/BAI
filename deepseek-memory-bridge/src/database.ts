import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { BridgeError, type Memory, type Source, type Status } from './types.js';
import { canonical, hash, normalize, now, uid } from './util.js';

const migration1 = `
CREATE TABLE IF NOT EXISTS schema_version(version INTEGER PRIMARY KEY);
CREATE TABLE imports(id TEXT PRIMARY KEY, hash TEXT NOT NULL UNIQUE, file_name TEXT NOT NULL, bytes INTEGER NOT NULL, status TEXT NOT NULL, cursor INTEGER NOT NULL DEFAULT 0, preview_json TEXT NOT NULL, directory TEXT NOT NULL, created_at TEXT NOT NULL, completed_at TEXT);
CREATE TABLE staged(import_id TEXT NOT NULL REFERENCES imports(id) ON DELETE CASCADE, ordinal INTEGER NOT NULL, conversation_id TEXT NOT NULL, content_hash TEXT NOT NULL, json TEXT NOT NULL, PRIMARY KEY(import_id, ordinal));
CREATE TABLE conversations(id TEXT PRIMARY KEY, source_id TEXT NOT NULL, title TEXT NOT NULL, original_time TEXT, latest_hash TEXT NOT NULL, imported_at TEXT NOT NULL);
CREATE TABLE conversation_versions(conversation_id TEXT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE, content_hash TEXT NOT NULL, raw_json TEXT NOT NULL, adapter TEXT NOT NULL, PRIMARY KEY(conversation_id, content_hash));
CREATE TABLE import_conversations(import_id TEXT NOT NULL REFERENCES imports(id), conversation_id TEXT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE, content_hash TEXT NOT NULL, ordinal INTEGER NOT NULL, PRIMARY KEY(import_id, ordinal));
CREATE TABLE messages(conversation_id TEXT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE, id TEXT NOT NULL, version TEXT NOT NULL, role TEXT NOT NULL, text TEXT NOT NULL, position INTEGER NOT NULL, original_time TEXT, raw_json TEXT NOT NULL, warnings_json TEXT NOT NULL, PRIMARY KEY(conversation_id, id, version));
CREATE INDEX messages_order ON messages(conversation_id, version, position);
CREATE TABLE memories(id TEXT PRIMARY KEY, content TEXT NOT NULL, category TEXT NOT NULL, scope TEXT NOT NULL, evidence TEXT NOT NULL, confidence REAL NOT NULL, status TEXT NOT NULL, semantic_key TEXT NOT NULL, semantic_value TEXT NOT NULL, fingerprint TEXT NOT NULL, extracted_at TEXT NOT NULL, updated_at TEXT NOT NULL, expires_at TEXT, revision INTEGER NOT NULL DEFAULT 1);
CREATE INDEX memories_identity ON memories(fingerprint, scope);
CREATE INDEX memories_key ON memories(semantic_key, scope, status);
CREATE TABLE memory_sources(memory_id TEXT NOT NULL REFERENCES memories(id) ON DELETE CASCADE, conversation_id TEXT NOT NULL, message_id TEXT NOT NULL, version TEXT NOT NULL, original_time TEXT, quote TEXT NOT NULL, PRIMARY KEY(memory_id, conversation_id, message_id, version, quote));
CREATE TABLE revisions(id TEXT PRIMARY KEY, memory_id TEXT NOT NULL REFERENCES memories(id) ON DELETE CASCADE, revision INTEGER NOT NULL, snapshot TEXT NOT NULL, reason TEXT NOT NULL, time TEXT NOT NULL, UNIQUE(memory_id, revision));
CREATE TABLE conflicts(id TEXT PRIMARY KEY, old_id TEXT NOT NULL REFERENCES memories(id) ON DELETE CASCADE, new_id TEXT NOT NULL REFERENCES memories(id) ON DELETE CASCADE, status TEXT NOT NULL DEFAULT 'open', created_at TEXT NOT NULL, resolved_at TEXT, resolution TEXT, UNIQUE(old_id, new_id));
CREATE TABLE actions(id TEXT PRIMARY KEY, type TEXT NOT NULL, payload TEXT NOT NULL, description TEXT NOT NULL, nonce TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'pending', created_at TEXT NOT NULL, result TEXT);
CREATE TABLE settings(key TEXT PRIMARY KEY, value TEXT NOT NULL);
CREATE VIRTUAL TABLE memory_fts USING fts5(id UNINDEXED, terms, tokenize='unicode61');
CREATE VIRTUAL TABLE history_fts USING fts5(conversation_id UNINDEXED, message_id UNINDEXED, version UNINDEXED, terms, tokenize='unicode61');
INSERT INTO schema_version VALUES(1);`;

const ignored = new Set(['\u6211\u4e4b', '\u4e4b\u524d', '\u524d\u7684', '\u6211\u7684', '\u662f\u4ec0\u4e48', '\u4ec0\u4e48', '\u8bb0\u5f97', '\u73b0\u5728', '\u8bf7\u95ee', 'the', 'what', 'was', 'and', 'about', 'with', 'that', 'this', 'have', 'your', 'you']);
export function terms(input: string): string[] {
  const out = new Set<string>();
  for (const m of input.toLowerCase().matchAll(/[\p{L}\p{N}]+/gu)) {
    const v = m[0];
    if (/\p{Script=Han}/u.test(v)) { for (let i = 0; i < v.length - 1; i++) { const part = v.slice(i, i + 2); if (!ignored.has(part)) out.add(part); } }
    else if (v.length >= 2 && !ignored.has(v)) { out.add(v); if (/[\u0430-\u044f\u0451]/i.test(v) && v.length > 5) out.add(v.slice(0, -2)); }
  }
  return [...out].slice(0, 1000);
}
export function indexText(input: string): string { return terms(input).join(' '); }
export function conversationKey(sourceId: string): string { return 'ds-' + hash(sourceId).slice(0, 32); }
export class Store {
  db: DatabaseSync;
  constructor(public path: string) {
    mkdirSync(dirname(path), { recursive: true }); this.db = new DatabaseSync(path);
    this.db.exec('PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON; PRAGMA busy_timeout=5000; PRAGMA secure_delete=ON;');
    const table = this.one("SELECT name FROM sqlite_master WHERE name='schema_version'");
    if (!table) this.transaction(() => this.db.exec(migration1));
    const version = this.one('SELECT MAX(version) AS v FROM schema_version')?.v;
    if (version !== 1) { this.db.close(); throw new BridgeError('SCHEMA_VERSION', '数据库版本不兼容，已停止写入'); }
  }
  one(sql: string, ...args: (string | number | null)[]): Record<string, any> | undefined { return this.db.prepare(sql).get(...args) as Record<string, any> | undefined; }
  all(sql: string, ...args: (string | number | null)[]): Record<string, any>[] { return this.db.prepare(sql).all(...args) as Record<string, any>[]; }
  run(sql: string, ...args: (string | number | null)[]) { return this.db.prepare(sql).run(...args); }
  transaction<T>(fn: () => T): T { this.db.exec('BEGIN IMMEDIATE'); try { const result = fn(); this.db.exec('COMMIT'); return result; } catch (e) { this.db.exec('ROLLBACK'); throw e; } }
  close(): void { this.db.exec('PRAGMA wal_checkpoint(TRUNCATE)'); this.db.close(); }
  sources(id: string): Source[] { return this.all('SELECT conversation_id AS conversationId,message_id AS messageId,version,original_time AS originalTime,quote FROM memory_sources WHERE memory_id=? ORDER BY rowid', id) as Source[]; }
  memory(id: string): Memory {
    const r = this.one('SELECT * FROM memories WHERE id=?', id);
    if (!r) throw new BridgeError('NOT_FOUND', '记忆不存在');
    return { id: r.id, content: r.content, category: r.category, scope: r.scope, evidence: r.evidence, confidence: r.confidence, status: r.status, key: r.semantic_key, value: r.semantic_value, sources: this.sources(id), extractedAt: r.extracted_at, updatedAt: r.updated_at, expiresAt: r.expires_at, revision: r.revision };
  }
  saveMemory(m: Memory, reason: string): void {
    this.run(`INSERT INTO memories VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET content=excluded.content,category=excluded.category,scope=excluded.scope,evidence=excluded.evidence,confidence=excluded.confidence,status=excluded.status,semantic_key=excluded.semantic_key,semantic_value=excluded.semantic_value,fingerprint=excluded.fingerprint,updated_at=excluded.updated_at,expires_at=excluded.expires_at,revision=excluded.revision`,
      m.id, m.content, m.category, m.scope, m.evidence, m.confidence, m.status, m.key, m.value, hash(normalize(m.content)), m.extractedAt, m.updatedAt, m.expiresAt, m.revision);
    for (const s of m.sources) this.run('INSERT OR IGNORE INTO memory_sources VALUES(?,?,?,?,?,?)', m.id, s.conversationId, s.messageId, s.version, s.originalTime, s.quote);
    this.run('INSERT INTO revisions VALUES(?,?,?,?,?,?)', uid(), m.id, m.revision, canonical(m), reason, now());
    this.run('DELETE FROM memory_fts WHERE id=?', m.id);
    if (m.status !== 'deleted') this.run('INSERT INTO memory_fts VALUES(?,?)', m.id, indexText(m.content + ' ' + m.key + ' ' + m.value));
    if (!['candidate', 'confirmed'].includes(m.status)) {
      this.run("UPDATE conflicts SET status='resolved',resolved_at=?,resolution='memory-inactive' WHERE status='open' AND (old_id=? OR new_id=?)", now(), m.id, m.id);
    } else {
      for (const conflict of this.all("SELECT * FROM conflicts WHERE status='open' AND (old_id=? OR new_id=?)", m.id, m.id)) {
        const other = this.memory(conflict.old_id === m.id ? conflict.new_id : conflict.old_id);
        if (!m.key || m.key !== other.key || m.scope !== other.scope || normalize(m.value) === normalize(other.value)) this.run("UPDATE conflicts SET status='resolved',resolved_at=?,resolution='attribute-changed' WHERE id=?", now(), conflict.id);
      }
      if (!m.key || !m.value) return;
      for (const old of this.all("SELECT id,semantic_value FROM memories WHERE semantic_key=? AND scope=? AND status IN ('candidate','confirmed') AND id<>?", m.key, m.scope, m.id)) {
        if (normalize(old.semantic_value) !== normalize(m.value)) {
          const pair = this.one('SELECT id,status FROM conflicts WHERE (old_id=? AND new_id=?) OR (old_id=? AND new_id=?)', old.id, m.id, m.id, old.id);
          if (!pair) this.run('INSERT INTO conflicts(id,old_id,new_id,created_at) VALUES(?,?,?,?)', uid(), old.id, m.id, now());
          else if (pair.status !== 'open') this.run("UPDATE conflicts SET status='open',resolved_at=NULL,resolution=NULL WHERE id=?", pair.id);
        }
      }
    }
  }
  change(id: string, changes: Partial<Memory>, reason: string, expected?: number): Memory {
    const old = this.memory(id); if (expected !== undefined && expected !== old.revision) throw new BridgeError('STALE_REVISION', '记忆已被修改，请刷新后重新审核');
    const m = { ...old, ...changes, id, revision: old.revision + 1, updatedAt: now() }; this.saveMemory(m, reason); return m;
  }
  candidates(m: Memory): { id: string; duplicate: boolean } {
    const fp = hash(normalize(m.content));
    const same = this.one("SELECT id FROM memories WHERE fingerprint=? AND scope=? AND status NOT IN ('deleted','rejected')", fp, m.scope);
    if (same) { const old = this.memory(same.id); const merged = [...old.sources]; for (const s of m.sources) if (!merged.some(x => x.conversationId === s.conversationId && x.messageId === s.messageId && x.quote === s.quote)) merged.push(s);
      if (merged.length !== old.sources.length) this.change(old.id, { sources: merged }, '重复记忆补充证据'); return { id: old.id, duplicate: true }; }
    this.saveMemory(m, '提取候选记忆');
    return { id: m.id, duplicate: false };
  }
  list(status?: Status, category?: string, limit = 100, offset = 0): Memory[] {
    return this.all("SELECT id FROM memories WHERE (? IS NULL OR status=?) AND (? IS NULL OR category=?) ORDER BY updated_at DESC,id LIMIT ? OFFSET ?", status ?? null, status ?? null, category ?? null, category ?? null, limit, offset).map(r => this.memory(r.id));
  }
  search(query: string, options: { confirmedOnly?: boolean; scope?: string; limit?: number } = {}): Memory[] {
    const q = query.trim().slice(0, 4000), words = terms(q).slice(0, 48); if (!q || !words.length) return [];
    const match = words.map(x => '"' + x.replaceAll('"', '""') + '"').join(' OR ');
    const rows = this.all(`SELECT m.id,bm25(memory_fts) AS rank FROM memory_fts JOIN memories m ON m.id=memory_fts.id WHERE memory_fts MATCH ? AND m.status IN (${options.confirmedOnly ? "'confirmed'" : "'candidate','confirmed','expired'"}) AND (m.scope='global' OR m.scope=?) AND (m.expires_at IS NULL OR m.expires_at>?) ORDER BY rank LIMIT ?`, match, options.scope ?? 'global', now(), options.limit ?? 20);
    return rows.map(r => this.memory(r.id));
  }
  stats() {
    return { conversations: this.one('SELECT COUNT(*) n FROM conversations')!.n as number,
      messages: this.one('SELECT COUNT(*) n FROM messages m JOIN conversations c ON c.id=m.conversation_id AND c.latest_hash=m.version')!.n as number,
      messageVersions: this.one('SELECT COUNT(*) n FROM messages')!.n as number,
      candidates: this.one("SELECT COUNT(*) n FROM memories WHERE status='candidate'")!.n as number,
      confirmed: this.one("SELECT COUNT(*) n FROM memories WHERE status='confirmed'")!.n as number,
      conflicts: this.one("SELECT COUNT(*) n FROM conflicts WHERE status='open'")!.n as number,
      lastImport: this.one('SELECT MAX(completed_at) t FROM imports')!.t as string | null,
      schemaVersion: 1 };
  }
}
