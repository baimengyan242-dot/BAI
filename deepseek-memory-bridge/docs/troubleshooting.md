[Complete English user guide](USER_GUIDE.md) | [中文完整使用说明](USER_GUIDE.zh-CN.md)

# Troubleshooting

## Move data off C:

Open Settings > DeepSeek Memory Bridge > Settings and backups > Storage location. Choose an empty dedicated folder on D: or another drive, then Migrate current library. Review the paths and confirm. Restart and check Current library. Legacy data remains readable until explicitly migrated.

DSH's own host configuration and the small location metadata file can remain in its original home. Imported chats, the active database, archives, backups and exports use the selected folder. This plugin does not move unrelated host files or another plugin's data.

## Open existing data

Select the folder containing `memory.sqlite` and `archives`, then Open existing library. It retains the previous folder without merging. A DeepSeek JSON/ZIP export is an import file; select it in Import instead.

## Migration refused or interrupted

Choose an empty dedicated absolute folder. Source/target overlap, drive roots, relative paths, symbolic links and junctions are refused. Check free disk space and permissions. A copying/validation failure leaves the old library active. A verified copy can remain if a later metadata write fails; inspect it before retrying.

A cleanup warning means the new library is active but old files remain because another process blocked removal. Close that program, check the active library and its path, then remove the old folder. Never delete an unverified source copy.

## Missing saved drive

Reconnect the drive. No empty library is created on C:. If deliberately moved outside the manager, close DSH, back up `memory-bridge-location.json`, and update its absolute `dataDir` to a valid library. Keep `format: 1` and valid JSON.

## Library already open

Close DSH completely, including the tray process, before using the CLI on its active data. Only one writer is supported. A stale process lock is reclaimed only if its PID is dead. Do not remove a running process's lock.

## Settings missing or installation fails

Use DSH 0.2.2-rc.1 and its desktop-bundled CLI for the desktop profile. Ensure the plugin is selected in that profile and restart the host. First installation may require npm registry access. The manager appears in native DSH Settings, not a standalone server.

## Import unrecognized or interrupted

Adapters accept arrays, nested containers and mapping trees. Other structures need a sanitized structural sample. Failed previews do not partially commit active history. Interrupted imports resume from committed batches, and identical exports are deduplicated.

Defaults allow a 512 MiB archive and 1 GiB expanded data, with entry/count/ratio and single-conversation bounds. Unsafe paths/names, encryption, symbolic links, ZIP bombs, bad CRC and deep/incomplete JSON are refused. Adjust limits only with sufficient disk and memory.

## No extracted or recalled memories

Rules intentionally recognize only some explicit durable statements. Other content stays in History. Review candidates, resolve conflicts, check expiry/scope and enable recall if desired. Recall defaults to off. Try original keywords if paraphrased search fails. Optional model extraction still requires source evidence and review.

## Restore, deletion and model extraction

Full backups restore databases and original archives; memory-list exports do not. Restore checks hashes/schema and retains a safety copy. Purge cannot erase originals, old backups or exports. Uninstall retains all data.

For model extraction, use a compatible API base, model name and API-key environment variable name. Remote endpoints need HTTPS and consent for each operation; loopback may use HTTP. DSH credentials are not reused. Fabricated source quotes and assistant assumptions cannot automatically become user facts.
