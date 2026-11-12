#!/usr/bin/env node
import { MemoryBridge } from './bridge.js';
import { publicError } from './util.js';
import { locationFile, resolveDataDir } from './storage.js';

const input = process.argv.slice(2), flags: Record<string, string> = {}, args: string[] = [];
for (let i = 0; i < input.length; i++) { if (input[i].startsWith('--')) flags[input[i].slice(2)] = input[++i] ?? ''; else args.push(input[i]); }
const [command = 'help', ...pos] = args;
if (command === 'help') {
  console.log("DeepSeek Memory Bridge 0.2.2\n\nUsage: deepseek-memory-bridge <command> [arguments] [--data-dir PATH]\n\n  stats                         Library statistics and settings\n  import <export-file>          Preview JSON or ZIP; does not confirm import\n  propose <type> --json <JSON>   Propose an operation\n  actions                       Inspect pending parameters and confirmation codes\n  confirm <id> --nonce <code>   Confirm a specific reviewed operation\n  cancel <id>                   Cancel a proposal\n  search <keywords>             Search confirmed memories\n  memories [status]             Browse memories\n  history [keywords]            Search original conversations\n  read <conversation-id>        Read original messages\n  conflicts                     List unresolved conflicts\n  revisions <memory-id>         Read revision history\n  backups                       List backups\n\nOperation types: import, review, update, delete, purge, merge, resolve, rollback,\nbackup, restore, export, settings, model-extract, storage.\n\nStorage proposal: propose storage --json '{\"path\":\"D:\\\\DeepSeekMemoryBridge\",\"mode\":\"migrate\"}'\nUse mode \"open\" to read an existing library without merging or deleting the old one.\nThe saved location is shared with the native manager. --location-file overrides\nthe location metadata file. Close DSH before using the CLI on its active library.\nInspect actions before confirming. Remote extraction needs authorizeRemote:true\nand explicit confirmation for each operation.\n");
} else {
  const bridge = new MemoryBridge({ dataDir: flags['data-dir'] || resolveDataDir(), locationFile: flags['location-file'] || locationFile() });
  bridge.on('progress', p => process.stderr.write(JSON.stringify(p) + '\n'));
  try {
    let result: unknown;
    switch (command) {
      case 'stats': result = bridge.stats(); break;
      case 'import': result = await bridge.previewFile(pos[0]); break;
      case 'propose': result = bridge.propose(pos[0], JSON.parse(flags.json || '{}'), flags.description || 'CLI 用户请求的操作'); break;
      case 'actions': result = bridge.actions(); break;
      case 'confirm': result = await bridge.confirm(pos[0], flags.nonce); break;
      case 'cancel': result = bridge.cancelAction(pos[0]); break;
      case 'search': result = bridge.search(pos.join(' '), flags.scope, 20, true); break;
      case 'memories': result = bridge.store.list(pos[0] as any); break;
      case 'history': result = bridge.history(pos.join(' ')); break;
      case 'read': result = bridge.readConversation(pos[0]); break;
      case 'conflicts': result = bridge.conflicts(); break;
      case 'revisions': result = bridge.revisions(pos[0]); break;
      case 'backups': result = bridge.backups(); break;
      default: throw new Error('Unknown command');
    }
    console.log(JSON.stringify(result, null, 2));
  } catch (e) { console.error(JSON.stringify(publicError(e))); process.exitCode = 1; }
  finally { await bridge.close(); }
}
