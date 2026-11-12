// Read the installed signed ASAR without changing the installation. For local verification only.
import fs from 'node:fs';
import path from 'node:path';
const input = process.argv[2];
const output = path.resolve('environment/runtime');
if (!input) throw new Error('Pass the installed app.asar path');
fs.mkdirSync(output, { recursive: true });
const fd = fs.openSync(input, 'r');
const prefix = Buffer.alloc(16); fs.readSync(fd, prefix, 0, 16, 0);
const bytes = Buffer.alloc(prefix.readUInt32LE(12)); fs.readSync(fd, bytes, 0, bytes.length, 16);
const header = JSON.parse(bytes.toString()); const start = 8 + prefix.readUInt32LE(4);
let count = 0;
function extract(entry, rel) {
  const target = path.resolve(output, rel);
  if (!target.startsWith(output + path.sep)) throw new Error('Unsafe archive name');
  if (entry.files) { fs.mkdirSync(target, { recursive: true }); for (const [name, child] of Object.entries(entry.files)) extract(child, path.join(rel, name)); }
  else if (entry.link) { throw new Error('Unexpected ASAR link: ' + rel); }
  else {
    fs.mkdirSync(path.dirname(target), { recursive: true });
    if (entry.unpacked) fs.copyFileSync(path.join(input + '.unpacked', rel), target);
    else { const data = Buffer.alloc(entry.size); fs.readSync(fd, data, 0, data.length, start + Number(entry.offset)); fs.writeFileSync(target, data); }
    count++;
  }
}
extract(header.files.dsh, 'dsh'); fs.closeSync(fd);
console.log(JSON.stringify({ output, files: count, version: JSON.parse(fs.readFileSync(path.join(output, 'dsh/package.json'))).version }));
