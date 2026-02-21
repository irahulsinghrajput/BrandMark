#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const workspaceRoot = path.resolve(__dirname, '..');
const htmlFiles = [];
const findings = [];
const references = [];
const graph = new Map();

const ignoreSegments = new Set([
  '.git',
  'node_modules',
  '.vscode',
  '.history',
]);

function shouldIgnore(fullPath) {
  const rel = path.relative(workspaceRoot, fullPath).replace(/\\/g, '/');
  return rel.split('/').some(segment => ignoreSegments.has(segment));
}

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (shouldIgnore(fullPath)) continue;
    if (entry.isDirectory()) {
      walk(fullPath);
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith('.html')) {
      htmlFiles.push(fullPath);
    }
  }
}

function normalizeTarget(raw) {
  if (!raw) return null;
  let cleaned = raw.trim();
  if (!cleaned || cleaned === '#' || cleaned.toLowerCase().startsWith('javascript:')) {
    return null;
  }
  if (/^(https?:)?\/\//i.test(cleaned) || /^(mailto:|tel:)/i.test(cleaned)) {
    return null;
  }
  const hashIndex = cleaned.indexOf('#');
  if (hashIndex !== -1) cleaned = cleaned.slice(0, hashIndex);
  const queryIndex = cleaned.indexOf('?');
  if (queryIndex !== -1) cleaned = cleaned.slice(0, queryIndex);
  return cleaned || null;
}

function recordMissing(fromFile, target, type) {
  findings.push({
    type,
    from: fromFile,
    target,
  });
}

function addReference(fromFile, targetPath, type) {
  references.push({ from: fromFile, target: targetPath, type });
}

function ensureGraphNode(relPath) {
  if (!graph.has(relPath)) graph.set(relPath, new Set());
}

walk(workspaceRoot);

htmlFiles.sort();

for (const file of htmlFiles) {
  const relFile = path.relative(workspaceRoot, file).replace(/\\/g, '/');
  ensureGraphNode(relFile);
  const content = fs.readFileSync(file, 'utf8');

  const patterns = [
    { type: 'anchor', regex: /<a\s+[^>]*href=["']([^"']+)["']/gi },
    { type: 'link', regex: /<link\s+[^>]*href=["']([^"']+)["']/gi },
    { type: 'script', regex: /<script\s+[^>]*src=["']([^"']+)["']/gi },
    { type: 'img', regex: /<(?:img|source|video|audio)\s+[^>]*src(?:set)?=["']([^"']+)["']/gi },
  ];

  for (const { type, regex } of patterns) {
    let match;
    while ((match = regex.exec(content)) !== null) {
      const normalized = normalizeTarget(match[1]);
      if (!normalized) continue;

      let absolute;
      if (normalized.startsWith('/')) {
        absolute = path.join(workspaceRoot, normalized);
      } else {
        absolute = path.resolve(path.dirname(file), normalized);
      }
      absolute = path.normalize(absolute);

      if (!absolute.startsWith(workspaceRoot)) {
        recordMissing(relFile, normalized, `${type}:out-of-root`);
        continue;
      }

      const targetExists = fs.existsSync(absolute);
      const relTarget = path.relative(workspaceRoot, absolute).replace(/\\/g, '/');

      addReference(relFile, relTarget, type);

      if (!targetExists) {
        recordMissing(relFile, normalized, `${type}:missing`);
        continue;
      }

      if (path.extname(relTarget).toLowerCase() === '.html') {
        ensureGraphNode(relTarget);
        graph.get(relFile).add(relTarget);
      }
    }
  }
}

const visited = new Set();
const start = htmlFiles.find(f => path.basename(f).toLowerCase() === 'index.html');
if (start) {
  const relStart = path.relative(workspaceRoot, start).replace(/\\/g, '/');
  const queue = [relStart];
  while (queue.length) {
    const current = queue.shift();
    if (visited.has(current)) continue;
    visited.add(current);
    const neighbors = graph.get(current);
    if (!neighbors) continue;
    for (const next of neighbors) {
      if (!visited.has(next)) queue.push(next);
    }
  }
}

const unreachable = [];
for (const node of graph.keys()) {
  if (!visited.has(node)) unreachable.push(node);
}

const summary = {
  scannedFiles: htmlFiles.length,
  missingReferences: findings.length,
  unreachablePages: unreachable.length,
};

function formatFinding(finding) {
  return `${finding.type} -> ${finding.from} => ${finding.target}`;
}

console.log('BrandMark Site Diagnostics');
console.log('===========================');
console.log(`HTML files scanned: ${summary.scannedFiles}`);
console.log(`Missing references : ${summary.missingReferences}`);
console.log(`Unreachable pages  : ${summary.unreachablePages}`);

if (findings.length) {
  console.log('\nMissing / broken references');
  for (const finding of findings) {
    console.log('-', formatFinding(finding));
  }
}

if (unreachable.length) {
  console.log('\nUnreachable HTML files from index.html');
  for (const page of unreachable) {
    console.log('-', page);
  }
}

const orphaned = [];
for (const [node] of graph.entries()) {
  let inbound = 0;
  for (const [source, targets] of graph.entries()) {
    if (source === node) continue;
    if (targets.has(node)) inbound += 1;
  }
  if (inbound === 0 && node !== (start ? path.relative(workspaceRoot, start).replace(/\\/g, '/') : node)) {
    orphaned.push(node);
  }
}

if (orphaned.length) {
  console.log('\nPages with no inbound internal links');
  for (const page of orphaned) {
    console.log('-', page);
  }
}

if (!findings.length && !unreachable.length) {
  console.log('\nNo issues detected.');
}
