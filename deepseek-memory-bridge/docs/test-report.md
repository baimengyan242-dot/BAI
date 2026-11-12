# Test evidence and limitations

Release 0.2.2. Verification dates: November 11-12, 2026. Windows build environment: Node 24.22.1, pnpm 11.25.0 and TypeScript 5.9.3. Host: DSH 0.2.2-rc.1, Cordis 4.1.0, Electron 44.7.0 / Node 24.21.0 with SQLite support.

## Automated evidence

The suite has 21 tests, preceded by type checking and production build. The latest successful output is `automated-test-output.txt`; simulated import measurements are in `performance-result.json`.

| Area | Verification |
| --- | --- |
| Adapters/originals | Simulated arrays, containers, mapping branches, byte comparison, unknown fields, attachments and order |
| Incremental import | Duplicate files, retained older versions and combined evidence |
| Review/recall | Explicit confirmation, sourced bounded recall, unrelated-query exclusion and restart in a separate CLI process |
| Conflicts/revisions | No silent overwrite, conflict resolution, rollback and reopened contradictions |
| Resume | Cancel after 25 committed conversations, reopen without loss or duplicate commit |
| Input safety | Traversal, unsafe Windows names, ZIP bombs, CRC damage, incomplete/deep JSON, prototype fields and size limits |
| Evidence/privacy | Credential/instruction filters, forged nonce rejection, scope, expiry and model source quotes |
| Operations | Merge, edit, delete, purge, JSON/Markdown export, full restore and tamper rejection |
| Native transport | Ordered chunks, real Cordis/tool/context services, actual settings registry, closure-factory and owner-only route |
| Migration | Every library area, extra binary data, unfinished upload, empty backup folders, path rebasing, source removal, persisted restart and restoring an older backup |
| Failure paths | Occupied/overlapping/relative/root targets, metadata write failure, missing saved library and concurrent writers |
| Folder selection | Native-picker callback dispatch and filesystem drive/folder listings |

Fixtures are explicitly simulated. Model tests use a stub rather than a production model. Native context tests use real services with simulated agent inputs. Multilingual test inputs use Unicode escapes; the native interface and system messages are Chinese, with complete Chinese and English user guides.

## Performance and host checks

The simulated dataset is about 11.25 MB, containing 1,000 conversations / 20,000 messages. Recorded time includes import backups. Timing/RSS vary; use the JSON record. Another test imports one 3,000-message conversation and checks final-page order. No maximum-size performance guarantee is made.

The initial release was installed through the actual desktop-bundled DSH CLI into an isolated Web profile. A real browser opened native settings, uploaded the fixture, confirmed 1 conversation / 6 messages, reviewed a memory, saved recall settings, restarted the host and retrieved the same fact. Desktop/tablet/phone widths were inspected, without a real API key.

Version 0.2.0 adds integrity, migration, restart, restore and failure-path tests. Its real DSH settings page was also checked: the drive browser listed the available drives, the confirmation dialog required acknowledgement, migration changed the active folder and removed the old simulated-data folder, and History still opened the original messages. The browser reported no console errors. The installed package additionally passed import, backup, byte-preservation, review, reopen and recall checks under the actual desktop Electron runtime.

The host determines native chooser availability; drive browsing and direct path entry are alternatives. Real private-library migration is a separate local operation; private files, configuration snapshots, detailed inventories and migration reports are excluded from public artifacts.

The 0.2.1 native settings page was checked for Chinese tabs, category/status labels, storage controls, backup reasons and the complete-guide link. Invalid storage paths were rejected with a Chinese message. Validation errors are displayed inside the confirmation dialog. The installed package passed the actual desktop Electron runtime checks, and a separate private local comparison confirmed that existing history content and the selected D: location were unchanged by the localization upgrade.

The existing third-party memory plugin was also loaded in an isolated home. Data/tools/prompts stayed independent, a sentinel was unchanged and unloading Memory Bridge preserved the other prompt section. No third-party database interoperability is claimed.

## Audit and limits

Production audit output is in `dependency-audit.json`. `stream-json` was upgraded to 3.9.0 after the earlier version reported three moderate advisories; depth and packed-value bounds were added. No known advisory does not prove the absence of vulnerabilities.

- Representative official export compatibility is not established by simulated fixtures. Successful local use does not cover every variant.
- Real online extraction and a full remote-model answer using recall have not been tested.
- Keyword retrieval can miss paraphrases; local extraction and conflict rules cover limited assertions.
- Colliding account source IDs need separate libraries. Project scope uses the working-directory string.
- A library has one writer. Close an older host/plugin before offline migration; older versions do not honor the new lock.
- Data is plain text. Purge retains originals, old backups, exports and restore safety copies and cannot guarantee physical erasure.


Version 0.2.2 excludes local application screenshots and legacy release archives from its published snapshot. A publication gate audits file names, UTF-8 content, archive members and archive ownership metadata for personal paths, non-example email addresses, credentials and private data. Commit identities use a GitHub no-reply address. Public history starts at the privacy-checked snapshot.
