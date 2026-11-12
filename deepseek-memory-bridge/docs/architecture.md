# Architecture and integration

Verified host: DSH 0.2.2-rc.1, Cordis 4.1.0, Electron 44.7.0 and Node 24.21.0. Build environment: Node 24.22.1, pnpm 11.25.0 and TypeScript 5.9.3. The desktop ASAR identifies commit `c59d10aff167ad7eefead4b3a9082fb57c8fbfe8`. Published rc.1 types and actual services take precedence over the separately consulted rc.2 source snapshot.

| Capability | Native integration |
| --- | --- |
| Tools | `ctx.tools.register(defineTool(...))` with explicit output schema and renderer |
| Recall | `agent/pre-step` and `systemPrompt.context`, with `interpolate:false` |
| Settings | `settings.section` through `ctx.slots.inject/register` |
| Client loading | DSH closure-factory wrapper with external React |
| Transport | Exact authenticated Fetch route `/api/deepseek-memory-bridge`; client `connection.rpc.call('/api', ...)` |
| Folder choice | Native composed `directoryPicker` when available, plus owner-only filesystem browsing |
| Installation | `dsh.bundle.patch`, `dsh.client.inject` and official profile-aware CLI |

The manager has no separate unauthenticated port. DSH Connection owns admission and rejects non-owner principals. Registrations, event handlers, routes and database lifetime follow Cordis disposal.

## Modules and data

- `archive.ts`: bounded streaming ZIP extraction, path, size, ratio, count and CRC checks.
- `parser.ts`: per-conversation streaming JSON adapters, all mapping branches and unknown-field preservation.
- `database.ts`: schema, raw versions, FTS5, evidence, revisions and conflicts.
- `extractor.ts`: local rules, optional compatible model, credentials/instruction filtering and source validation.
- `bridge.ts`: preview, batched import, confirmation, review, recall, backups, restore, exports and relocation.
- `storage.ts`: persisted paths, process locks, folder browsing and library validation.
- `api.ts`: pagination, ordered chunks and operation dispatch.
- `index.ts` / `tools.ts`: native host registration and lifecycle.
- `client.tsx` / `cli.ts`: Chinese native settings and the management CLI using the active database.

Original SHA-256 identifies each import. Source conversation IDs identify histories; normalized content hashes distinguish their versions. Known older reimports never roll the active version back. Evidence includes conversation ID, message ID, version, timestamp and quote. Original files remain the byte-exact authority.

Import commits 25 conversations, candidates and the resume cursor in a transaction. History is untrusted data. Mutation tools return proposals without confirmation nonces. Human confirmation codes are random and expire in 24 hours. Backups use SQLite's consistent backup API plus archive hashes; restore validates paths, hashes, schema and integrity and retains a safety copy.

## Relocation

Relocation excludes other import, extraction, backup and confirmation jobs, and blocks API mutations during the switch. A PID/token lock excludes another process; only a dead process's stale lock is reclaimed automatically.

Migration needs an empty dedicated absolute folder outside the DSH configuration root, without links/junctions or source/target overlap. A temporary sibling on the destination drive receives a SQLite snapshot and every other file except live WAL/SHM and lock files. Source/destination hashes, a second source scan, database integrity and table counts are checked. Empty directories are copied because restore needs empty staging/archive folders too.

The verified copy becomes the destination. Active archive paths are rebased and location metadata is written atomically. The store switches before source removal; blocked cleanup is reported. Opening an existing library validates it, keeps the previous source and cancels stale pending operations in the selected library. Libraries are never implicitly merged.

`$DSH_HOME/memory-bridge-location.json` contains paths and a timestamp, without chat content. Former configured roots redirect after migration; unrelated explicit `dataDir` paths remain independent. A missing saved library fails closed rather than creating an empty substitute.

## Coexistence and limits

The existing `@tieveto666-code/dsh-memory-migration` 0.1.2 plugin retains independent data, tools and prompt sections. Memory Bridge does not write its data or configuration; recall defaults to off. No third-party interoperability adapter is claimed.

Keyword recall can miss paraphrases. Local extraction/conflict rules cover limited attributes. Accounts with colliding source IDs need separate libraries. Data is plain text. Purge does not guarantee physical erasure. Older plugin versions do not honor the new process lock, so close DSH before offline migration.
