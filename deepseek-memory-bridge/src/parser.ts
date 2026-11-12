import { createReadStream } from 'node:fs';
import { readFile, stat } from 'node:fs/promises';
import { parserStream } from 'stream-json';
import { BridgeError, type Limits, type ParsedConversation, type ParsedMessage } from './types.js';
import { canonical, date, hash, record, text } from './util.js';

export interface Adapter { id: string; match(value: Record<string, unknown>): boolean; parse(value: Record<string, unknown>): ParsedConversation; }
const messageFields = ['messages', 'chat_messages', 'history'];
function content(value: unknown): string {
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) return value.map(content).filter(Boolean).join('\n');
  const r = record(value); if (!r) return '';
  return typeof r.text === 'string' ? r.text : typeof r.content === 'string' ? r.content : content(r.parts);
}
function normalizeMessage(raw: Record<string, unknown>, position: number, nodeId?: string): ParsedMessage {
  const author = record(raw.author);
  const role = text(raw.role ?? raw.sender ?? author?.role ?? raw.type).toLowerCase() || 'unknown';
  const normalizedRole = ['human', 'user'].includes(role) ? 'user' : ['assistant', 'ai', 'model', 'bot'].includes(role) ? 'assistant' : role;
  const result = content(raw.content ?? raw.text ?? raw.message ?? raw.fragments);
  const warnings: string[] = [];
  if (!['user', 'assistant', 'system', 'tool'].includes(normalizedRole)) warnings.push('未识别消息角色，原始字段已保留');
  if (!result) warnings.push('消息无可识别文本，附件及其他字段仍保存在原文中');
  return { id: String(raw.id ?? raw.message_id ?? nodeId ?? `generated-${hash(canonical(raw))}-${position}`), role: normalizedRole,
    text: result, time: date(raw.inserted_at ?? raw.created_at ?? raw.create_time ?? raw.timestamp), position, raw, warnings };
}
function parseConversation(raw: Record<string, unknown>, adapter: string): ParsedConversation {
  const warnings: string[] = [], messages: ParsedMessage[] = [];
  const mapping = record(raw.mapping);
  if (mapping) {
    // Keep all branches. Parent/child links and current_node remain in raw for exact reconstruction.
    for (const [nodeId, value] of Object.entries(mapping)) { const node = record(value), msg = record(node?.message); if (msg) messages.push(normalizeMessage(msg, messages.length, nodeId)); else if (node?.message != null) warnings.push('树节点无法规范化，已保留原文'); }
    warnings.push('树形对话已保留所有分支；列表顺序使用导出节点顺序，分支关系见原始字段');
  } else {
    const key = messageFields.find(k => Array.isArray(raw[k]));
    for (const value of (key ? raw[key] : []) as unknown[]) { const msg = record(value); if (msg) messages.push(normalizeMessage(msg, messages.length)); else warnings.push('非对象消息已保留在会话原始字段中'); }
  }
  const ids = new Map<string, number>();
  for (const m of messages) { const n = ids.get(m.id) ?? 0; ids.set(m.id, n + 1); if (n) { m.warnings.push('重复消息 ID，规范化 ID 添加序号；原始 ID 保留'); m.id += `#duplicate-${n}`; } }
  if (!messages.length) warnings.push('未找到可规范化消息');
  return { id: String(raw.id ?? raw.conversation_id ?? raw.chat_id ?? raw.session_id ?? `generated-${hash(canonical(raw))}`),
    title: text(raw.title ?? raw.name) || '未命名对话', time: date(raw.inserted_at ?? raw.created_at ?? raw.create_time), messages, raw, adapter, warnings };
}
export const adapters: Adapter[] = [
  { id: 'deepseek-message-array-v1', match: r => messageFields.some(k => Array.isArray(r[k])), parse: r => parseConversation(r, 'deepseek-message-array-v1') },
  { id: 'deepseek-mapping-tree-v1', match: r => !!record(r.mapping), parse: r => parseConversation(r, 'deepseek-mapping-tree-v1') },
];
export function registerAdapter(adapter: Adapter): () => void { if (adapters.some(a => a.id === adapter.id)) throw new Error('Adapter already registered'); adapters.unshift(adapter); return () => { const i = adapters.indexOf(adapter); if (i >= 0) adapters.splice(i, 1); }; }
export function adapt(value: unknown): ParsedConversation | undefined { const r = record(value); if (!r) return; const a = adapters.find(a => a.match(r)); return a?.parse(r); }
type Token = { name: string; value?: string };
type Frame = { type: 'object' | 'array'; path: string[]; key?: string; index: number; selected: boolean };
const selectedPath = (p: string[]) => p.length === 0 || /^(conversations|chats|chat_sessions|data|data\.(conversations|chats|chat_sessions)|export\.conversations)$/.test(p.join('.'));

/** Streams one conversation at a time. Unmapped fields remain in the byte-exact source archive. */
export async function* parseJsonFile(path: string, limits: Limits, signal?: AbortSignal): AsyncGenerator<ParsedConversation | undefined> {
  if ((await stat(path)).size > limits.maxEntryBytes) throw new BridgeError('SIZE_LIMIT', 'JSON 文件超过限制');
  const parser = parserStream({ streamKeys: false, packKeys: true, streamStrings: true, packStrings: false, streamNumbers: false, packNumbers: true, maxDepth: 100, maxPackedLength: limits.maxConversationBytes });
  const input = createReadStream(path); input.on('error', e => parser.destroy(e)); input.pipe(parser);
  const abort = () => { input.destroy(); parser.destroy(new BridgeError('CANCELLED', '解析已取消')); };
  signal?.addEventListener('abort', abort, { once: true });
  const frames: Frame[] = []; let captureDepth = -1, captured = false, bytes = 0;
  let root: unknown, stack: { value: Record<string, unknown> | unknown[]; key?: string }[] = [], str = '', inString = false;
  function add(value: unknown) { const top = stack.at(-1); if (!top) root = value; else if (Array.isArray(top.value)) top.value.push(value); else if (top.key !== undefined) Object.defineProperty(top.value, top.key, { value, enumerable: true, configurable: true, writable: true }); }
  try {
    for await (const raw of parser) {
      signal?.throwIfAborted(); const t = raw as Token, parent = frames.at(-1);
      const structural = t.name === 'startObject' || t.name === 'startArray';
      if (captureDepth < 0 && structural && parent?.selected) { captureDepth = frames.length; root = undefined; stack = []; bytes = 0; captured = true; }
      if (captureDepth >= 0) {
        bytes += Buffer.byteLength(String(t.value ?? t.name));
        if (bytes > limits.maxConversationBytes) throw new BridgeError('CONVERSATION_TOO_LARGE', '单个会话超出内存保护上限，可在配置中调整');
        if (structural) { const v = t.name === 'startObject' ? {} : []; add(v); stack.push({ value: v }); }
        else if (t.name === 'keyValue') { const top = stack.at(-1); if (top) top.key = t.value; }
        else if (t.name === 'startString') { inString = true; str = ''; }
        else if (t.name === 'stringChunk' && inString) str += t.value;
        else if (t.name === 'endString') { add(str); str = ''; inString = false; }
        else if (t.name === 'numberValue') add(Number(t.value));
        else if (t.name === 'nullValue') add(null);
        else if (t.name === 'trueValue') add(true);
        else if (t.name === 'falseValue') add(false);
        else if (t.name === 'endObject' || t.name === 'endArray') stack.pop();
      }
      if (t.name === 'keyValue' && parent) parent.key = t.value;
      if (structural) {
        const p = parent ? [...parent.path, parent.type === 'object' ? (parent.key ?? '') : String(parent.index)] : [];
        frames.push({ type: t.name === 'startObject' ? 'object' : 'array', path: p, index: 0, selected: t.name === 'startArray' && selectedPath(p) });
        if (frames.length > 100) throw new BridgeError('JSON_DEPTH', 'JSON 嵌套层数超过限制');
      } else if (t.name === 'endObject' || t.name === 'endArray') {
        frames.pop(); if (frames.at(-1)?.type === 'array') frames.at(-1)!.index++;
        if (captureDepth === frames.length) { captureDepth = -1; yield adapt(root); root = undefined; }
      } else if (captureDepth < 0 && parent?.selected && /^(numberValue|nullValue|trueValue|falseValue|endString)$/.test(t.name)) { captured = true; parent.index++; yield undefined; }
    }
    if (!captured) {
      if ((await stat(path)).size > limits.maxConversationBytes) throw new BridgeError('UNRECOGNIZED_FORMAT', '未识别流式会话数组。原文尚未导入，请提供脱敏结构样本');
      const whole = JSON.parse(await readFile(path, 'utf8')); const single = adapt(whole); if (single) yield single;
    }
  } catch (e) { if (e instanceof BridgeError) throw e; throw new BridgeError('INVALID_JSON', 'JSON 无法完整解析；不会提交部分预览'); }
  finally { signal?.removeEventListener('abort', abort); input.destroy(); parser.destroy(); }
}
