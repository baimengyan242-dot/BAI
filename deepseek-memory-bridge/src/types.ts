export const categories = ['background', 'preference', 'learning', 'environment', 'project', 'knowledge', 'unverified'] as const;
export type Category = typeof categories[number];
export const categoryNames: Record<Category, string> = { background: '个人背景', preference: '用户偏好', learning: '学习和研究', environment: '技术环境', project: '项目记忆', knowledge: '重要知识', unverified: '待验证信息' };
export type Status = 'candidate' | 'confirmed' | 'rejected' | 'superseded' | 'deleted' | 'expired';
export interface Source { conversationId: string; messageId: string; version: string; originalTime: string | null; quote: string; }
export interface Memory {
  id: string; content: string; category: Category; scope: string;
  evidence: 'user-stated' | 'ai-inference' | 'uncertain'; confidence: number;
  status: Status; key: string; value: string; sources: Source[];
  extractedAt: string; updatedAt: string; expiresAt: string | null; revision: number;
}
export interface ParsedMessage {
  id: string; role: string; text: string; time: string | null; position: number;
  raw: Record<string, unknown>; warnings: string[];
}
export interface ParsedConversation {
  id: string; title: string; time: string | null; messages: ParsedMessage[];
  raw: Record<string, unknown>; adapter: string; warnings: string[];
}
export interface ImportPreview {
  id: string; hash: string; fileName: string; bytes: number; conversations: number;
  messages: number; parseable: number; duplicates: number; updated: number;
  anomalies: number; warnings: string[]; status: string; cursor: number;
}
export interface Limits { maxArchiveBytes: number; maxExpandedBytes: number; maxEntryBytes: number; maxEntries: number; maxCompressionRatio: number; maxConversationBytes: number; }
export const defaultLimits: Limits = { maxArchiveBytes: 512 * 1024 ** 2, maxExpandedBytes: 1024 ** 3, maxEntryBytes: 512 * 1024 ** 2, maxEntries: 5000, maxCompressionRatio: 200, maxConversationBytes: 16 * 1024 ** 2 };
export interface BridgeOptions { dataDir: string; locationFile?: string; autoRecall?: boolean; recallBudgetTokens?: number; recallLimit?: number; backupKeep?: number; limits?: Partial<Limits>; }
export interface Progress { id: string; phase: string; completed: number; total: number; }
export class BridgeError extends Error {
  constructor(public code: string, message: string) { super(message); this.name = 'BridgeError'; }
}
