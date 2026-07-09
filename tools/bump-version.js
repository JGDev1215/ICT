#!/usr/bin/env node
'use strict';

const fs = require('fs');

const usage = 'Usage: node tools/bump-version.js v0.8.1 [cache-slug] [yyyymmdd]';
const version = process.argv[2];
const slug = (process.argv[3] || 'release').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'release';
const date = process.argv[4] || new Date().toISOString().slice(0, 10).replace(/-/g, '');

if(!/^v\d+\.\d+\.\d+(?:[-a-z0-9.]*)?$/i.test(version || '')){
  console.error(usage);
  process.exit(1);
}
if(!/^\d{8}$/.test(date)){
  console.error('Date must be yyyymmdd.');
  console.error(usage);
  process.exit(1);
}

const versionNumber = version.replace(/^v/i, '');
const cacheKey = `${versionNumber}-${slug}-${date}`;
const cacheName = `ict-sweep-tracker-v${versionNumber.replace(/\./g, '')}-${slug}-${date}`;

function update(file, replacements){
  let source = fs.readFileSync(file, 'utf8');
  for(const [pattern, replacement, label] of replacements){
    const next = source.replace(pattern, replacement);
    if(next === source){
      if(pattern.test && pattern.test(source)) continue;
      throw Error(`Could not update ${label} in ${file}`);
    }
    source = next;
  }
  fs.writeFileSync(file, source);
  console.log(`updated ${file}`);
}

update('assets/app.js', [
  [/const VERSION = 'v[^']+';/, `const VERSION = '${version}';`, 'app VERSION']
]);

update('index.html', [
  [/<title>ICT DOL Sweep Tracker v[^<]+<\/title>/, `<title>ICT DOL Sweep Tracker ${version}</title>`, 'title version'],
  [/ICT DOL Sweep Tracker v[^ ]+ · Educational (?:planning )?tool(?: only)?\. Not financial advice\./, `ICT DOL Sweep Tracker ${version} · Educational tool. Not financial advice.`, 'footer version'],
  [/(assets\/config\.js\?v=)[^"]+/, `$1${cacheKey}`, 'config cache key'],
  [/(assets\/styles\.css\?v=)[^"]+/, `$1${cacheKey}`, 'style cache key'],
  [/(assets\/app\.js\?v=)[^"]+/, `$1${cacheKey}`, 'app cache key']
]);

update('service-worker.js', [
  [/const CACHE_NAME = '[^']+';/, `const CACHE_NAME = '${cacheName}';`, 'cache name'],
  [/(assets\/config\.js\?v=)[^']+/, `$1${cacheKey}`, 'config service-worker cache key'],
  [/(assets\/styles\.css\?v=)[^']+/, `$1${cacheKey}`, 'style service-worker cache key'],
  [/(assets\/app\.js\?v=)[^']+/, `$1${cacheKey}`, 'app service-worker cache key']
]);

update('README.md', [
  [/- Current app version: v[^\n]+/, `- Current app version: ${version}`, 'README current version']
]);

update('CLAUDE.md', [
  [/- Current app version: `v[^`]+`/, `- Current app version: \`${version}\``, 'CLAUDE current version']
]);

console.log(`version=${version}`);
console.log(`cacheKey=${cacheKey}`);
