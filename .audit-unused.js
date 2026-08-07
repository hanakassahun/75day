const fs = require('fs');
const path = require('path');
const root = process.cwd();
const exts = ['.ts', '.tsx', '.js', '.jsx'];
function isSource(file) {
  return exts.includes(path.extname(file));
}
function walk(dir) {
  let out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...walk(p));
    } else if (isSource(p)) {
      out.push(p);
    }
  }
  return out;
}
function walkAssets(dir) {
  let out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...walkAssets(p));
    } else if (['.png', '.svg', '.jpg', '.jpeg'].includes(path.extname(p))) {
      out.push(p);
    }
  }
  return out;
}
const srcDirs = ['app', 'components', 'hooks', 'lib'];
const srcFiles = [];
for (const d of srcDirs) {
  const full = path.join(root, d);
  if (fs.existsSync(full) && fs.statSync(full).isDirectory()) {
    srcFiles.push(...walk(full));
  }
}
const fileMap = new Map();
for (const f of srcFiles) {
  fileMap.set(f, fs.readFileSync(f, 'utf8'));
}
const importRegex = /import\s+(?:[^'"\\]+)\s+from\s+['"]([^'"]+)['"];?/g;
const relRegex = /^\.\.?\//;
const aliasRegex = /^@\/(.*)$/;
const resolveImport = (from, imp) => {
  if (relRegex.test(imp)) {
    const resolved = path.resolve(path.dirname(from), imp);
    for (const ext of exts) {
      const full = resolved + ext;
      if (fs.existsSync(full)) return full;
    }
    if (fs.existsSync(resolved)) return resolved;
  }
  const m = imp.match(aliasRegex);
  if (m) {
    const resolved = path.join(root, m[1]);
    for (const ext of exts) {
      const full = resolved + ext;
      if (fs.existsSync(full)) return full;
    }
    if (fs.existsSync(resolved)) return resolved;
  }
  return null;
};
const graph = new Map();
for (const [file, content] of fileMap) {
  const deps = [];
  let m;
  while ((m = importRegex.exec(content)) !== null) {
    const imp = m[1];
    const resolved = resolveImport(file, imp);
    if (resolved) deps.push(resolved);
  }
  graph.set(file, deps);
}
const allAppFiles = walk(path.join(root, 'app'));
const entrypoints = allAppFiles.filter((f) => {
  const name = path.basename(f);
  return ['page.tsx', 'route.ts', 'layout.tsx', 'error.tsx', 'loading.tsx'].includes(name);
});
const reachable = new Set();
const dfs = (file) => {
  if (reachable.has(file)) return;
  reachable.add(file);
  const deps = graph.get(file) || [];
  for (const d of deps) {
    if (fileMap.has(d)) dfs(d);
  }
};
for (const ep of entrypoints) {
  if (fileMap.has(ep)) dfs(ep);
}
const unreachable = [...fileMap.keys()].filter((f) => !reachable.has(f)).sort();
console.log('ENTRYPOINTS');
console.log(entrypoints.sort().join('\n'));
console.log('UNREACHABLE_SOURCE_FILES');
console.log(unreachable.join('\n'));
const publicDir = path.join(root, 'public');
const assetFiles = fs.existsSync(publicDir) ? walkAssets(publicDir) : [];
const usedAssets = new Set();
for (const asset of assetFiles) {
  const name = path.basename(asset);
  const rel = path.relative(root, asset).replace(/\\/g, '/');
  for (const content of fileMap.values()) {
    if (content.includes(name) || content.includes(rel)) {
      usedAssets.add(asset);
      break;
    }
  }
}
const unusedAssets = assetFiles.filter((a) => !usedAssets.has(a)).sort();
console.log('UNUSED_PUBLIC_ASSETS');
console.log(unusedAssets.join('\n'));
