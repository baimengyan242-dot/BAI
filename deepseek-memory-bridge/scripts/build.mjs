import { build } from 'esbuild';
import { mkdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
mkdirSync('dist', { recursive: true });
const base = { bundle: true, format: 'esm', platform: 'node', target: 'node24', sourcemap: true,
  external: ['@deepseek-ai/*', 'react', 'react/*', 'yauzl', 'stream-json', 'stream-json/*'] };
await build({ ...base, entryPoints: ['src/index.ts', 'src/core.ts', 'src/cli.ts'], outdir: 'dist' });
await build({ bundle: true, format: 'cjs', platform: 'browser', target: 'es2022', jsx: 'automatic',
  entryPoints: ['src/client.tsx'], outdir: 'dist', external: ['@deepseek-ai/*', 'react', 'react/*'], sourcemap: true,
  banner: { js: 'window.__ModuleLoader__.load({ id: "dsh-deepseek-memory-bridge", factory: (require) => { var module = { exports: {} }; var exports = module.exports;' },
  footer: { js: 'return module.exports; } });' }, define: { 'process.env.NODE_ENV': '"production"' } });
execFileSync(process.execPath, ['node_modules/typescript/bin/tsc', '--emitDeclarationOnly'], { stdio: 'inherit' });
