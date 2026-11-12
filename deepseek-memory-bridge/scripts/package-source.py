"""Package only the public project files; never include runtime homes, credentials or dependencies."""
from pathlib import Path
import hashlib
import json
import zipfile
import subprocess
import sys

root = Path(__file__).resolve().parent.parent
subprocess.run([sys.executable, str(root / 'scripts/check-publication.py'), '--source-only'], cwd=root, check=True)
release = root / 'release'
release.mkdir(exist_ok=True)
target = release / 'deepseek-memory-bridge-0.2.2-source.zip'
allowed_dirs = ['src', 'tests', 'scripts', 'dist', 'docs']
allowed_files = ['package.json', 'pnpm-lock.yaml', 'pnpm-workspace.yaml', 'tsconfig.json', 'cordis.patch.yml', 'README.md', 'CHANGELOG.md', 'LICENSE', '.gitignore']
files = [root / name for name in allowed_files]
for name in allowed_dirs:
    files.extend(p for p in (root / name).rglob('*') if p.is_file() and '__pycache__' not in p.parts and p.suffix != '.pyc')
with zipfile.ZipFile(target, 'w', zipfile.ZIP_DEFLATED) as archive:
    for path in sorted(files):
        archive.write(path, 'deepseek-memory-bridge/' + path.relative_to(root).as_posix())
artifacts = [target, release / 'dsh-deepseek-memory-bridge-0.2.2.tgz']
manifest = {'version': '0.2.2', 'artifacts': [{'file': p.name, 'bytes': p.stat().st_size, 'sha256': hashlib.sha256(p.read_bytes()).hexdigest()} for p in artifacts]}
(release / 'checksums.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print(json.dumps(manifest, ensure_ascii=False, indent=2))
