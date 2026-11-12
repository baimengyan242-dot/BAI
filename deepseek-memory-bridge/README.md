# DeepSeek Memory Bridge

A native Cordis plugin for DeepSeek Harness (DSH). Archive manually exported chat history, extract candidate memories from user statements, review their evidence, and recall confirmed facts across sessions.

Version **0.2.2** provides a Chinese native DSH interface, selectable storage drives and verified library migration. Repository overview and technical documentation remain available in English. Tested against **DSH 0.2.2-rc.1**, **Cordis 4.1.0** and **Node.js 24**. Revalidate compatibility after upgrading the prerelease host.

## Complete user guides

- [中文完整使用说明](docs/USER_GUIDE.zh-CN.md)
- [Complete English user guide](docs/USER_GUIDE.md)

The guides cover installation and upgrades, every native page, imports and review, original history, conflicts, recall, model extraction, storage migration, existing libraries, backups, restore, exports, CLI confirmation, troubleshooting and uninstall. The native **使用说明** link opens the Chinese guide.

## Installation

1. Exit DSH completely, including its tray process.
2. Use the desktop installation's `resources/runtime/cli/bin/dsh.cmd` to install the release package.
3. Reopen DSH and open **Settings > DeepSeek 记忆桥**.

```powershell
& 'D:\DeepSeekHarness\resources\runtime\cli\bin\dsh.cmd' plugin --profile desktop add 'file:D:\Downloads\dsh-deepseek-memory-bridge-0.2.2.tgz'
```

Replace these example paths with your installation and downloaded package. A globally installed `dsh` may not manage the desktop-only profile. First installation may need the npm registry; default extraction and library access work offline. The included `scripts/install.ps1` accepts `-DshCommand`, `-Profile` and `-Package`. Uninstall with `scripts/uninstall.ps1`; data is retained. Web hosts use the same-version official CLI with `--profile web` and `dsh web --no-open`.

## Select a drive or migrate from C:

Open **设置与备份 > 存储位置**.

1. Click **选择文件夹** for the host's native chooser, or **浏览磁盘** to select a drive and folder in the manager. You can also enter a new absolute path such as `D:\DeepSeekMemoryBridge`.
2. Choose **迁移当前记忆库** to move your database, original archives, backups, exports, unfinished imports/uploads and other files. The destination must be empty and separate from the source.
3. Review the source, destination and operation parameters, then confirm.

Migration uses SQLite's consistent backup API, verifies database integrity and table counts, checks file SHA-256 values, preserves empty backup directories and rebases active archive paths. It saves the new location and switches libraries before removing the original folder. A copying or validation failure leaves the original library active. If another program blocks source cleanup, the manager reports the retained old files.

To read a Memory Bridge library already on another drive, select its folder containing `memory.sqlite` and `archives`, then choose **打开已有记忆库**. It validates and opens that library, retains the previous folder, and does not merge them. To import a DeepSeek ZIP or JSON export, use **导入中心** instead.

New Windows libraries default to `D:\DeepSeekMemoryBridge` when D: is available. Existing legacy libraries remain readable until explicitly migrated. A small metadata file, `$DSH_HOME/memory-bridge-location.json`, remembers the selected folder. DSH's own profile/configuration can remain in its original home; imported chats, the active database, archives, backups and exports use the selected data folder. A missing saved drive produces a storage error instead of silently creating an empty replacement on C:.

The plugin's `dataDir` setting can specify a separate initial library. Saved migrations redirect that library's former path on restart; unrelated explicit paths remain independent. Non-Windows defaults use `$XDG_DATA_HOME/deepseek-memory-bridge` or `~/.local/share/deepseek-memory-bridge`.

## Import, review and read history

Manually export history from the DeepSeek website, then select its JSON or ZIP in **导入中心**. The plugin does not log in, read browser cookies or reuse DSH credentials. Files go to the current DSH host; a remote host receives them on its computer.

The workflow is **select file > inspect preview > confirm import > archive originals and extract candidates > review memories**. Selecting a file creates staging data; committing it to the active library needs confirmation. **记忆管理** supports evidence, categories, scope, editing, merging, deletion and revisions. Edits, merges and rollback require review again. Recognized contradictory attributes require an explicit decision in **冲突审核**, without silent date-based overwrite.

**历史记录** searches original messages, pages through conversations, opens older versions and downloads original fields. Export files are preserved byte for byte. Unknown fields remain in raw records; ZIP attachments are retained without executing HTML, scripts or programs. Original files remain authoritative where JSON normalization cannot preserve an exact numeric literal.

## Extraction and recall

Default extraction uses conservative local multilingual statement rules. Categories cover background, preferences, learning/research, technical environment, projects, knowledge and unverified information. Assistant guesses, hypotheticals, common credentials and suspicious instructions cannot automatically become confirmed user facts. Imported private content retains its original language.

The rules can miss complex statements; all unrecognized content remains in History. Normalized duplicates combine evidence. Known attributes support conflict detection, while complex semantic relationships need manual review or merging.

Conversation details offer optional extraction through an OpenAI-compatible `chat/completions` API. Select the model and base URL. Remote endpoints require HTTPS and consent for each operation; loopback may use HTTP. Supply an API key **environment variable name**, rather than the key itself. Eligible user messages are sent, without assistant replies. Results still need source-quote validation and review.

Automatic recall is **off by default** to reduce duplicate injection alongside other memory plugins. When enabled, it uses reviewed, relevant, unexpired user statements without unresolved conflicts. Recall includes memory IDs and versioned evidence within count and conservative token limits. Search uses SQLite FTS5, word tokens and CJK bigrams, without embedding dependencies; paraphrases can be missed.

## Backups and privacy

Imports create backups before and after committing. Manual backups contain a consistent database snapshot, archives and staging with a hash manifest. Restore validates them and retains a safety copy of the current state. Retention is configurable. Migration also carries backups, exports and restore safety copies to the selected drive.

JSON and Markdown exports are readable memory lists, not full restore backups. Data is **not encrypted**. Originals may contain sensitive text entered in earlier chats. Purging a memory removes its active database entry and revisions, but does not erase original chats, existing backups, exports or physical media. Uninstalling retains data.

The manager uses DSH's owner-only authenticated connection. Mutation tools propose operations; a human confirms in the manager or CLI using a random code that expires after 24 hours. A process lock excludes concurrent writers. Close DSH before using the CLI on its active library. Use separate folders for accounts with potentially colliding conversation IDs.

## CLI

```powershell
node dist/cli.js stats
node dist/cli.js import 'D:\Exports\deepseek.zip'
node dist/cli.js actions
node dist/cli.js propose storage --json '{"path":"D:\\DeepSeekMemoryBridge","mode":"migrate"}'
node dist/cli.js confirm ACTION_ID --nonce CONFIRMATION_CODE
```

Use `--data-dir PATH` for an explicit library and `--location-file PATH` for separate location metadata. The CLI and manager share the saved location. Run `node dist/cli.js help` for every command. Inspect the complete proposal before confirming it.

## Build and test

```powershell
pnpm install --frozen-lockfile
pnpm run check
pnpm pack --pack-destination release
python scripts/package-source.py
```

The 21-test suite covers adapters, raw bytes, incremental import, review, conflicts, recall, restart, malicious archives, bounds, backups, native DSH services and storage migration. Fixtures are simulated. Multilingual rules and test data use Unicode escapes in public source; the native UI and system messages are Chinese. English and Chinese user guides are included, and technical identifiers retain their original values.

See [architecture](docs/architecture.md), [test evidence](docs/test-report.md), [troubleshooting](docs/troubleshooting.md) and [changes](CHANGELOG.md). Published artifacts exclude private histories, credentials, runtime homes, local migration reports and dependencies. Release hashes are listed in `release/checksums.json`.

This plugin does not recover DeepSeek's non-exportable server-side internal memory and does not modify DSH core source.
