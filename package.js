import { existsSync, mkdirSync, readdirSync, rmSync, copyFileSync, statSync, readFileSync, writeFileSync } from 'fs';
import { deflateRawSync } from 'zlib';
import path from 'path';
import { replaceInFileSync } from 'replace-in-file';
import packageJson from './package.json' with { type: 'json' };

/**
 * Builds the upload packages:
 *   releases/<slug>-<version>-chrome-edge-mv3.zip   store upload for Chrome Web Store + Edge Add-ons (Manifest V3)
 *   releases/<slug>-<version>-firefox-mv2.zip       legacy Manifest V2 build (Firefox / unpacked dev install)
 *
 * Usage: npm run package   (builds /dist first, then zips it)
 * The zip is written directly (no external zip tool needed), sourcemaps are excluded.
 */

const slug = 'ambient-light-for-youtube-and-bilibili';
const version = packageJson.version;
const dist = path.resolve('dist');
const releases = path.resolve('releases');
const staging = path.join(releases, '.staging');
const ignoredExtensions = new Set(['.map']);

if (!existsSync(path.join(dist, 'manifest.json'))) {
  console.error('dist/manifest.json not found - run "npm run build:dist" first (npm run package does that).');
  process.exit(1);
}

/* ---------- staging ---------- */

function copyTree(from, to, manifestSource) {
  mkdirSync(to, { recursive: true });
  for (const dirent of readdirSync(from, { withFileTypes: true })) {
    const srcPath = path.join(from, dirent.name);
    const destPath = path.join(to, dirent.name);
    if (dirent.isDirectory()) copyTree(srcPath, destPath);
    else if (dirent.isFile() && !ignoredExtensions.has(path.extname(dirent.name))) copyFileSync(srcPath, destPath);
  }
  if (manifestSource) {
    copyFileSync(path.resolve(manifestSource), path.join(to, 'manifest.json'));
    replaceInFileSync({
      files: path.join(to, 'manifest.json'),
      from: /"version": "0.0.0"/g,
      to: `"version": "${version}"`,
    });
  }
}

/* ---------- minimal zip writer (deflate, forward slashes, utf-8 names) ---------- */

const crcTable = (() => {
  const table = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c;
  }
  return table;
})();

function crc32(buffer) {
  let c = -1;
  for (let i = 0; i < buffer.length; i++) c = crcTable[(c ^ buffer[i]) & 0xff] ^ (c >>> 8);
  return (c ^ -1) >>> 0;
}

function collect(dir, prefix, entries) {
  for (const dirent of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, dirent.name);
    const name = prefix ? prefix + '/' + dirent.name : dirent.name;
    if (dirent.isDirectory()) {
      entries.push({ name: name + '/', data: null });
      collect(full, name, entries);
    } else if (dirent.isFile() && !ignoredExtensions.has(path.extname(dirent.name))) {
      entries.push({ name, data: readFileSync(full) });
    }
  }
}

function zipDirectory(srcDir, zipPath) {
  const entries = [];
  collect(srcDir, '', entries);

  const now = new Date();
  const time = (now.getHours() << 11) | (now.getMinutes() << 5) | Math.floor(now.getSeconds() / 2);
  const date = ((now.getFullYear() - 1980) << 9) | ((now.getMonth() + 1) << 5) | now.getDate();

  const local = [];
  const central = [];
  let offset = 0;

  for (const entry of entries) {
    const isDir = entry.data === null;
    const data = isDir ? Buffer.alloc(0) : entry.data;
    const nameBuffer = Buffer.from(entry.name, 'utf8');
    const crc = isDir ? 0 : crc32(data);
    const deflated = isDir ? Buffer.alloc(0) : deflateRawSync(data, { level: 9 });
    const useDeflate = !isDir && deflated.length < data.length;
    const payload = useDeflate ? deflated : data;
    const method = useDeflate ? 8 : 0;

    const localHeader = Buffer.alloc(30);
    localHeader.writeUInt32LE(0x04034b50, 0);
    localHeader.writeUInt16LE(20, 4);
    localHeader.writeUInt16LE(0x0800, 6);
    localHeader.writeUInt16LE(method, 8);
    localHeader.writeUInt16LE(time, 10);
    localHeader.writeUInt16LE(date, 12);
    localHeader.writeUInt32LE(crc, 14);
    localHeader.writeUInt32LE(payload.length, 18);
    localHeader.writeUInt32LE(data.length, 22);
    localHeader.writeUInt16LE(nameBuffer.length, 26);
    localHeader.writeUInt16LE(0, 28);
    local.push(localHeader, nameBuffer, payload);

    const centralHeader = Buffer.alloc(46);
    centralHeader.writeUInt32LE(0x02014b50, 0);
    centralHeader.writeUInt16LE(0x031e, 4);
    centralHeader.writeUInt16LE(20, 6);
    centralHeader.writeUInt16LE(0x0800, 8);
    centralHeader.writeUInt16LE(method, 10);
    centralHeader.writeUInt16LE(time, 12);
    centralHeader.writeUInt16LE(date, 14);
    centralHeader.writeUInt32LE(crc, 16);
    centralHeader.writeUInt32LE(payload.length, 20);
    centralHeader.writeUInt32LE(data.length, 24);
    centralHeader.writeUInt16LE(nameBuffer.length, 28);
    centralHeader.writeUInt16LE(0, 30);
    centralHeader.writeUInt16LE(0, 32);
    centralHeader.writeUInt16LE(0, 34);
    centralHeader.writeUInt16LE(0, 36);
    centralHeader.writeUInt32LE(isDir ? 0x41ed0010 : 0x81a40000, 38);
    centralHeader.writeUInt32LE(offset, 42);
    central.push(centralHeader, nameBuffer);

    offset += localHeader.length + nameBuffer.length + payload.length;
  }

  const centralSize = central.reduce((total, buffer) => total + buffer.length, 0);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(0, 4);
  end.writeUInt16LE(0, 6);
  end.writeUInt16LE(entries.length, 8);
  end.writeUInt16LE(entries.length, 10);
  end.writeUInt32LE(centralSize, 12);
  end.writeUInt32LE(offset, 16);
  end.writeUInt16LE(0, 20);

  writeFileSync(zipPath, Buffer.concat([...local, ...central, end]));
  return entries.length;
}

/* ---------- run ---------- */

if (!existsSync(releases)) mkdirSync(releases);
rmSync(staging, { recursive: true, force: true });

const mv3Dir = path.join(staging, 'chrome-edge-mv3');
copyTree(dist, mv3Dir);
const mv3Zip = path.join(releases, `${slug}-${version}-chrome-edge-mv3.zip`);
const mv3Count = zipDirectory(mv3Dir, mv3Zip);
console.log('Manifest V3 package (Chrome Web Store / Edge Add-ons):');
console.log(`  ${path.relative(process.cwd(), mv3Zip)}`);
console.log(`  ${mv3Count} entries, ${(statSync(mv3Zip).size / 1024 / 1024).toFixed(2)} MB`);

const mv2Dir = path.join(staging, 'firefox-mv2');
copyTree(dist, mv2Dir, 'src/manifest.mv2.json');
const mv2Zip = path.join(releases, `${slug}-${version}-firefox-mv2.zip`);
const mv2Count = zipDirectory(mv2Dir, mv2Zip);
console.log('Manifest V2 package (legacy unpacked / Firefox):');
console.log(`  ${path.relative(process.cwd(), mv2Zip)}`);
console.log(`  ${mv2Count} entries, ${(statSync(mv2Zip).size / 1024 / 1024).toFixed(2)} MB`);

rmSync(staging, { recursive: true, force: true });
console.log('');
console.log('Upload checklist:');
console.log('  1. Chrome Web Store  https://chrome.google.com/webstore/devconsole  -> New item -> upload the mv3 zip');
console.log('  2. Edge Add-ons      https://partner.microsoft.com/dashboard/microsoftedge -> New extension -> upload the mv3 zip');
console.log('  3. Listing copy      STORE-LISTING.md');
console.log('  4. Screenshots       store/screenshots/*.png (1280x800)');
console.log('  5. Privacy policy    PRIVACY-POLICY.md');
