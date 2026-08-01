const fs = require('fs');
const path = require('path');

const PUBLIC_DIR = path.join(__dirname, '../public');

const files = fs.readdirSync(PUBLIC_DIR);
let totalOriginal = 0;
let totalWebp = 0;
let totalAvif = 0;

console.log('--- Image Optimization Audit ---');

const originals = files.filter(f => f.endsWith('.png') || f.endsWith('.jpg') || f.endsWith('.jpeg'));

for (const orig of originals) {
  const origPath = path.join(PUBLIC_DIR, orig);
  const origStats = fs.statSync(origPath);
  totalOriginal += origStats.size;

  const ext = path.extname(orig);
  const base = path.basename(orig, ext);
  
  const webpPath = path.join(PUBLIC_DIR, `${base}.webp`);
  const avifPath = path.join(PUBLIC_DIR, `${base}.avif`);

  const webpSize = fs.existsSync(webpPath) ? fs.statSync(webpPath).size : 0;
  const avifSize = fs.existsSync(avifPath) ? fs.statSync(avifPath).size : 0;

  totalWebp += webpSize;
  totalAvif += avifSize;

  console.log(`Original: ${orig} (${(origStats.size / 1024).toFixed(2)} KB)`);
  if (webpSize) console.log(`  WebP: ${(webpSize / 1024).toFixed(2)} KB (-${((1 - webpSize/origStats.size)*100).toFixed(1)}%)`);
  if (avifSize) console.log(`  AVIF: ${(avifSize / 1024).toFixed(2)} KB (-${((1 - avifSize/origStats.size)*100).toFixed(1)}%)`);
}

console.log('--------------------------------');
console.log(`Total Original Size: ${(totalOriginal / 1024).toFixed(2)} KB`);
console.log(`Total WebP Size: ${(totalWebp / 1024).toFixed(2)} KB`);
console.log(`Total AVIF Size: ${(totalAvif / 1024).toFixed(2)} KB`);
console.log(`Max Reduction (using AVIF): -${((1 - totalAvif/totalOriginal)*100).toFixed(1)}%`);
