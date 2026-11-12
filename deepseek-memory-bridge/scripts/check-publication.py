"""Fail closed on private paths, contact details and unreviewed binary media."""
from pathlib import Path, PurePosixPath
import argparse
import io
import json
import re
import subprocess
import tarfile
import zipfile

ROOT = Path(__file__).resolve().parent.parent
ROOT_FILES = ['.gitignore', 'package.json', 'pnpm-lock.yaml', 'pnpm-workspace.yaml', 'tsconfig.json', 'cordis.patch.yml', 'README.md', 'CHANGELOG.md', 'LICENSE']
SOURCE_DIRS = ['src', 'tests', 'scripts', 'docs', 'dist']
EMAIL = re.compile(r'[A-Za-z0-9][A-Za-z0-9._%+-]*@[A-Za-z0-9.-]+\.[A-Za-z]{2,}')
PERSONAL_PATH = re.compile(r'(?:[A-Za-z]:[/\\]+Users[/\\]+[^/\\\s]+|/(?:Users|home)/[^/\s]+|gpt(?:%20|[ \t])+work|storage-' + r'ui-library|install-' + r'home)', re.I)
SECRET = re.compile(r'(?:\bsk-[A-Za-z0-9_-]{12,}|\bgh[pousr]_[A-Za-z0-9]{15,}|github_pat_[A-Za-z0-9_]{15,}|[?&]token=[A-Za-z0-9_-]{12,}|-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----)')
BLOCKED_MEDIA = {'.png', '.jpg', '.jpeg', '.webp', '.gif', '.bmp', '.pdf', '.docx', '.pptx', '.xlsx'}
EXAMPLE_DOMAINS = {'example.com', 'example.org', 'example.net', 'users.noreply.github.com'}

def fail(kind, name):
    # Never echo the matching private text back into a build log.
    raise ValueError(f'{kind}: {name}')

def inspect(name, data):
    path = PurePosixPath(name)
    if path.is_absolute() or '..' in path.parts or re.match(r'^[A-Za-z]:', name): fail('Unsafe member path', name)
    if any(x in {'environment', '.test-data', 'node_modules', '.dsh', '.git'} for x in path.parts): fail('Private directory', name)
    if path.suffix.lower() in BLOCKED_MEDIA: fail('Unreviewed binary media', name)
    if re.search(r'\.(?:sqlite(?:-wal|-shm)?|db|log)$', name, re.I): fail('Private data file', name)
    try: text = data.decode('utf-8')
    except UnicodeDecodeError: fail('Unrecognized binary file', name)
    if PERSONAL_PATH.search(text): fail('Personal machine path', name)
    if re.search(r'[\u0400-\u052f]', text): fail('Unexpected Cyrillic text', name)
    for hit in EMAIL.finditer(text):
        domain = hit.group().split('@')[-1].lower()
        if domain not in EXAMPLE_DOMAINS: fail('Personal contact address', name)
    for hit in SECRET.finditer(text):
        if not hit.group().startswith('sk-synthetic'): fail('Potential credential', name)

def public_sources():
    files = [ROOT / name for name in ROOT_FILES]
    for folder in SOURCE_DIRS:
        files.extend(p for p in (ROOT / folder).rglob('*') if p.is_file() and '__pycache__' not in p.parts and p.suffix != '.pyc')
    for path in sorted(files):
        if path.is_symlink(): fail('Symbolic link', path.relative_to(ROOT).as_posix())
        inspect(path.relative_to(ROOT).as_posix(), path.read_bytes())
    return files

def inspect_artifacts(version):
    tgz = ROOT / 'release' / f'dsh-deepseek-memory-bridge-{version}.tgz'
    source = ROOT / 'release' / f'deepseek-memory-bridge-{version}-source.zip'
    count = 0
    with tarfile.open(tgz) as archive:
        for member in archive.getmembers():
            if member.issym() or member.islnk() or member.uname or member.gname or member.uid or member.gid: fail('Archive identity/link metadata', member.name)
            if member.isfile(): inspect(member.name, archive.extractfile(member).read()); count += 1
    with zipfile.ZipFile(source) as archive:
        if archive.comment: fail('Unexpected archive comment', source.name)
        for member in archive.infolist():
            if not member.is_dir(): inspect(member.filename, archive.read(member)); count += 1
    return count

def inspect_history(repo):
    commits = subprocess.check_output(['git', '-C', repo, 'rev-list', '--all'], text=True).splitlines()
    for commit in commits:
        fields = subprocess.check_output(['git', '-C', repo, 'show', '-s', '--format=%ae%n%ce%n%B', commit], text=True)
        inspect('commit-metadata', fields.encode('utf-8'))
        identities = fields.splitlines()[:2]
        if len(identities) != 2 or any(not x.lower().endswith('@users.noreply.github.com') for x in identities): fail('Commit must use GitHub no-reply', commit)
    return len(commits)

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--source-only', action='store_true')
    parser.add_argument('--git-repo')
    args = parser.parse_args()
    version = json.loads((ROOT / 'package.json').read_text(encoding='utf-8'))['version']
    source_count = len(public_sources())
    artifact_count = 0 if args.source_only else inspect_artifacts(version)
    history_count = inspect_history(args.git_repo) if args.git_repo else 0
    print(json.dumps({'passed': True, 'version': version, 'sourceFiles': source_count, 'artifactMembers': artifact_count, 'checkedCommits': history_count}))
