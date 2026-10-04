import { copyFileSync, mkdirSync, existsSync } from 'fs';
import { replaceInFileSync } from 'replace-in-file';
import packageJson from './package.json' with { type: 'json' };

// The Chromium/Edge stores only accept Manifest V3, so src/manifest.json is MV3.
// src/manifest.mv2.json is kept for Firefox / legacy unpacked installs:
//   node manifest-copy.js --mv2
const useMv2 = process.argv.includes('--mv2');
const source = useMv2 ? 'src/manifest.mv2.json' : 'src/manifest.json';

const options = {
  files: 'dist/manifest.json',
  from: /"version": "0.0.0"/g,
  to: `"version": "${packageJson.version}"`,
}

if(!existsSync('dist')) mkdirSync('dist');
copyFileSync(source, options.files);
replaceInFileSync(options);
console.log(`manifest: ${source} -> ${options.files} (version ${packageJson.version})`);
