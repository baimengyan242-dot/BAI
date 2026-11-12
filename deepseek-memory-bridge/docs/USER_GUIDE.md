# DeepSeek Memory Bridge user guide

Version 0.2.2. Verified host: DSH 0.2.2-rc.1 and Cordis 4.1.0. The native DSH interface is Chinese; this guide gives the exact Chinese labels alongside English explanations. Revalidate compatibility after updating the prerelease host.

[中文完整使用说明](USER_GUIDE.zh-CN.md) · [Project overview](../README.md) · [Changes](../CHANGELOG.md) · [Test evidence](test-report.md)

## 1. What is stored

The plugin archives manually exported DeepSeek history and extracts candidate memories from explicit user statements. Original history, candidate memories and reviewed memories are distinct. Importing history does not turn every message into a durable memory. Even when extraction produces no candidates, the imported history remains searchable.

It does not recover non-exportable server-side memory, log in to DeepSeek, read browser cookies or reuse DSH credentials. Original content retains its language. Library data, backups and exports are unencrypted.

## 2. Install or upgrade

Download `dsh-deepseek-memory-bridge-0.2.2.tgz` from the repository's `release` directory. Compare `Get-FileHash -Algorithm SHA256` against `release/checksums.json` if needed. Exit DSH completely, including its tray process, before changing the desktop profile.

Use the CLI bundled with the desktop application; replace both example paths:

```powershell
$DshCommand = 'D:\Apps\DeepSeekHarness\resources\runtime\cli\bin\dsh.cmd'
$Package = 'D:\Downloads\dsh-deepseek-memory-bridge-0.2.2.tgz'
& $DshCommand plugin --profile desktop add ('file:' + $Package)
```

The same command upgrades an earlier version while retaining its data and selected location. Version 0.2.2 does not require a fresh import or migration from 0.2.0 or 0.2.1. The included `scripts/install.ps1` accepts `-DshCommand`, `-Profile` and `-Package`. Initial dependency installation may need the npm registry; normal local extraction/search works offline. A separately installed global CLI may not manage the desktop-only profile.

Reopen DSH and select **Settings > DeepSeek 记忆桥**. The **使用说明** link opens the complete Chinese manual. Both guides are also included in the source archive and installed package's `docs` directory for offline reading.

For a Web profile, use the same-version official CLI:

```powershell
dsh plugin --profile web add 'file:D:\Downloads\dsh-deepseek-memory-bridge-0.2.2.tgz'
dsh --profile web --no-open
```

With a remote DSH host, uploads, drive letters and storage folders belong to that host, not necessarily to the browser's computer.

## 3. Native navigation

| Chinese label | Function |
| --- | --- |
| 导入中心 | Import previews, confirmation and resume |
| 记忆管理 | Review, edit, categories, scopes, merge, delete and revisions |
| 历史记录 | Search and read original conversations and versions |
| 冲突审核 | Decide between conflicting recognized attributes |
| 设置与备份 | Storage selection/migration, recall, backup, restore and export |

The top counters show original conversations, current-version messages, candidates and confirmed memories. **待确认操作** lists pending proposals.

The public guide uses text instructions. Local application screenshots are excluded from published artifacts.

## 4. Import history

1. Export your history manually from the DeepSeek website and retain the downloaded original.
2. In **导入中心**, select its `.zip` or `.json` file.
3. Wait for upload, parsing and duplicate checks. A preview creates staging data without committing active history.
4. Inspect recognized conversations, messages, duplicates, new versions and warnings. Expand **格式说明与异常报告** for format details.
5. Select **核对并导入**, review the complete parameters, check the acknowledgement and confirm.
6. Read originals in **历史记录** and review candidates in **记忆管理**.

Defaults allow a 512 MiB archive and 1 GiB expanded data, with further entry/count/ratio, JSON-depth and per-conversation bounds. Encrypted ZIPs, links, unsafe paths/names, duplicate/case-conflicting entries, bad CRC and incomplete JSON are refused. Supported adapters cover arrays, nested containers and mapping trees. Mapping branches remain in original fields; list order follows export-node order. Other export variants need a sanitized structural sample for an adapter.

Identical files are deduplicated. Changed conversations become retained versions. Reimporting a known older version does not roll back the latest one. Interrupted imports resume from committed batches through **继续导入**. Failed previews do not partially commit active history.

## 5. Read original content

In **历史记录**, search using message keywords and select **查看原文**. Details offer pages of up to 50 messages, version selection, message IDs, original fields and a download of the stored conversation JSON.

Original export files remain byte-exact. Unknown fields and attachment metadata are retained; non-JSON ZIP files are archived without executing scripts, HTML or programs. The original archive is authoritative if JSON normalization cannot preserve an exact numeric literal.

## 6. Review and maintain memories

Local rules recognize only some explicit, durable user assertions. They reject common credentials, suspicious instructions and hypotheticals and do not automatically treat assistant replies as user facts. Review source quotes, original times and exact conversation versions before confirmation.

**查看证据 / 编辑** opens evidence, content, category and scope. **确认记忆** admits an eligible candidate to recall; rejecting one retains its original history. Categories cover background, preferences, learning/research, environment, projects, knowledge and unverified information.

`global` is the global scope. Project scopes use working-directory strings. Expired items are excluded from automatic recall. Edits re-enter review. Selecting multiple related memories allows a merge that retains evidence, supersedes originals and creates a new candidate. Revision rollback also requires review again and can reopen a conflict.

**删除** stops recall while retaining revisions for rollback. **永久移除记忆** removes the active memory and revisions after creating a backup. Neither removes original chats, existing backups, exports, system backups or physical-media remnants.

## 7. Resolve conflicts

Different values for a recognized attribute in the same scope appear in **冲突审核**. Compare evidence before choosing **保留旧版本** or **保留新版本**. Dates do not silently overwrite facts. Open conflicts block direct confirmation and automatic recall of affected facts. Other unresolved relationships can leave the selected item as a candidate. Detection covers limited attributes, not every semantic contradiction.

## 8. Automatic recall

In **设置与备份**, enable **自动召回已确认、相关且未过期的用户陈述**, set the count and token limits, then **保存设置** and confirm. Recall defaults to off, with at most 6 memories and a conservative 800-token limit. The estimate is not a model-specific tokenizer.

Relevant reviewed user facts are inserted with memory IDs and versioned sources. Candidates, rejected/deleted/expired items and unresolved conflicts are excluded. Historical instructions are data, not executable commands. FTS5 word tokens and CJK bigrams can miss paraphrases; try original keywords or search History. Check for duplicate injection if another memory plugin is enabled.

## 9. Optional model extraction

Expand **可选模型提取** in a conversation's details. Enter an OpenAI-compatible API base URL, an available model name and, if needed, an API-key environment variable name such as `MEMORY_EXTRACT_API_KEY`. The variable must be visible to the DSH host; do not enter the actual key into that field.

Loopback endpoints may use HTTP, for example `http://127.0.0.1:11434/v1/`. Remote services require HTTPS and explicit consent for each operation. Only eligible user messages without common credentials are sent; assistant responses are not user evidence. Returned quotes must match the source and every result still needs review. The chosen provider may charge for requests. DSH credentials are not reused.

## 10. Move storage to D: or another drive

If **当前记忆库** already shows the right folder, no further migration is needed.

1. Open **设置与备份 > 存储位置**.
2. Use **选择文件夹** for the host chooser or **浏览磁盘** to browse existing folders. A new dedicated folder can be typed into **目标文件夹**, such as `D:\DeepSeekMemoryBridge`.
3. Choose an empty destination separate from the source. A drive root, overlapping folders, links and junctions are refused.
4. Select **迁移当前记忆库**, inspect both paths and confirm.
5. Wait for copying, database/file verification and switching. Check **当前记忆库** and check again after restarting DSH.

Migration includes the database, archives, backups, exports, restore safety copies and unfinished imports/uploads. It first needs enough space for a complete copy. The original is removed only after verification and a successful switch. Failed copying/validation retains the original. If cleanup is blocked by another program, the UI reports retained old files; verify the new library before clearing the obstruction.

New Windows libraries default to `D:\DeepSeekMemoryBridge` if D: is available. Existing legacy libraries remain readable until explicitly migrated. `$DSH_HOME/memory-bridge-location.json` stores paths and a timestamp without chat content; the default DSH home is normally `.dsh` under the user's home directory. Host installation/configuration and other plugins are independent. A missing selected drive produces an error instead of creating an empty substitute on C:.

## 11. Open a library already on another drive

Choose its complete folder containing `memory.sqlite` and corresponding archives, then **打开已有记忆库** and confirm. Copy an existing library only while all writers are closed and copy the whole folder, not just SQLite files.

Opening selects that library, retains the previous folder and does not merge them. Stale pending operations in the selected library are cancelled. Read its contents in History and Memories. A DeepSeek export ZIP/JSON belongs in Import, not this folder selector.

## 12. Backups, restore and export

Imports automatically back up before and after committing. **创建备份** makes a manual full snapshot of consistent SQLite data, archives and staging with a file-hash manifest. Retention defaults to 10 snapshots; creating backups prunes older ones according to that setting. Copy important snapshots elsewhere for long-term retention.

**恢复** replaces active history and memory after checking backup paths, hashes, schema and integrity. It saves the current state first and retains a restore safety copy. Safety copies do not follow the same rotation rules as ordinary snapshots. Old backups remain usable after migration; archive paths are rebased to the active folder. Stale pending actions are cancelled on restore.

**导出 JSON** and **导出 Markdown** produce readable memory lists and show their full output path. These are not full restore backups. A CLI export can add original archives with `includeRaw:true`. Keep all private outputs out of public repositories; they are not encrypted.

## 13. Confirmation and CLI

Formal imports, review/edit/delete/merge, conflict resolution, rollback, backup/restore/export, settings and storage changes need human confirmation. Inspect **待确认操作 > 核对操作**, acknowledge the scope and confirm, or cancel the proposal. Codes expire after 24 hours. Mutation tools propose changes without receiving confirmation codes. Technical field names and IDs remain unchanged.

Close DSH, including the tray process, before using the CLI on its active library. One process can write a library. Source CLI usage needs Node 24.9+ and project dependencies; desktop users can use the native manager.

```powershell
node dist/cli.js help
node dist/cli.js stats
node dist/cli.js history 'keywords'
node dist/cli.js search 'keywords'
node dist/cli.js memories candidate
node dist/cli.js read CONVERSATION_ID
node dist/cli.js backups
```

The saved location is used by default. `--data-dir PATH` explicitly chooses a library; `--location-file PATH` selects separate metadata. Avoid obsolete explicit paths to a deleted C: library after migration.

```powershell
node dist/cli.js import 'D:\Exports\deepseek.zip'
node dist/cli.js propose import --json '{"id":"PREVIEW_ID"}'
node dist/cli.js actions
node dist/cli.js confirm ACTION_ID --nonce CONFIRMATION_CODE
```

Replace placeholders with actual output and inspect the parameters before confirmation. `actions` reveals codes; do not publish terminal screenshots. Proposal parameters are:

| Type | Payload |
| --- | --- |
| `import` | `id` (preview ID) |
| `review` | `id`, `status` (`confirmed`/`rejected`), optional `revision` |
| `update` | `id`, `content`, optional `category`, `scope`, `revision` |
| `delete` / `purge` | Memory `id`; soft deletion / active-memory-and-revision removal |
| `merge` | `ids` array and merged `content` |
| `resolve` | Conflict `id`, `keep` (`old`/`new`) |
| `rollback` | `id`, `targetRevision`, optional current `revision` |
| `backup` | `{}` |
| `restore` | `backupId` |
| `export` | `format` (`json`/`markdown`), optional `includeRaw` |
| `settings` | `autoRecall`, `recallBudgetTokens`, `recallLimit`, `backupKeep` |
| `storage` | Absolute `path`, `mode` (`migrate`/`open`) |
| `model-extract` | Conversation `id`, `endpoint`, `model`, optional `keyEnv`, remote `authorizeRemote:true` |

Windows paths inside JSON need escaped backslashes:

```powershell
node dist/cli.js propose storage --json '{"path":"D:\\DeepSeekMemoryBridge","mode":"migrate"}'
```

## 14. Troubleshooting and uninstall

- Missing section: check the profile, selected plugin and DSH version; restart after installation.
- English interface: verify plugin 0.2.2 and fully restart DSH. Repository documentation language is independent of UI language.
- Old path: inspect **当前记忆库** and location metadata. Existing data is never silently relocated.
- Occupied target: choose an empty folder, or use Open existing library for a complete existing library.
- Missing drive: reconnect it. If moved manually, close DSH, back up and repair location metadata.
- Locked library: close other writers. Do not remove a live process's lock.
- No candidates: read the originals in History; local extraction is limited. Optional model extraction can propose more candidates.
- Missing recall: check keywords, active library, review status, scope, expiry and conflicts.
- Confirmation refused: inspect conflicts, direct source evidence and changed revisions.
- Model failure: check endpoint, actual model, host environment and per-operation consent.

Preserve originals and a full library copy when troubleshooting. See [technical troubleshooting](troubleshooting.md) and [test limitations](test-report.md).

To uninstall, exit DSH and run:

```powershell
& $DshCommand plugin --profile desktop remove dsh-deepseek-memory-bridge
```

Uninstall retains libraries, archives, backups, exports and location metadata for later reinstall. It does not erase private files or physical media.
