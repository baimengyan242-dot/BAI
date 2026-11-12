# Public release policy

The repository and release packages contain plugin code, simulated fixtures and general user documentation. Private libraries, archives of real chats, DSH configuration/credentials, local verification reports and local application screenshots are excluded.

Before publication, run `python scripts/check-publication.py`. It inspects the source allowlist and the current ZIP/TGZ artifacts, including nested text, member paths and ownership metadata. A failed check blocks publication. Use the current version only; do not copy older release archives into a fresh public snapshot.

Documentation paths must be generic examples or documented defaults. Contact addresses must use example domains or GitHub no-reply identities. Credentials used in fixtures must be explicitly synthetic. Do not publish terminal output, screenshots or generated reports that contain real machine paths or account details.

Use a GitHub-provided no-reply email for both the author and committer. Inspect every reachable commit before pushing. Avoid commit tools that silently replace the no-reply identity with an account's private address. A history cleanup must not leave a public backup branch or tag pointing at old commits; backups belong outside the public repository.

Rewriting the branch history cannot retract downloads or other people's clones. Unreferenced commits or cached pages on the hosting service may require additional provider-side cleanup. Do not claim that a successful force push proves all external copies were erased.
