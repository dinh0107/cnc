const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const chunkDir = path.join(__dirname, 'b64-chunks');
const outDir = path.join(root, 'images', 'certifications');

function readChunks(prefix, count) {
  let b64 = '';
  for (let i = 0; i < count; i++) {
    const file = path.join(chunkDir, `${prefix}-${i}.txt`);
    if (!fs.existsSync(file)) {
      throw new Error(`Missing chunk: ${file}`);
    }
    b64 += fs.readFileSync(file, 'utf8').trim();
  }
  return Buffer.from(b64, 'base64');
}

function readSingle(name) {
  const file = path.join(chunkDir, `${name}.txt`);
  if (!fs.existsSync(file)) {
    throw new Error(`Missing file: ${file}`);
  }
  return Buffer.from(fs.readFileSync(file, 'utf8').trim(), 'base64');
}

fs.mkdirSync(outDir, { recursive: true });

const outputs = [
  { name: 'iso-9001.png', data: () => readChunks('cert-iso-9001', 3) },
  { name: 'iso-14001.png', data: () => readChunks('cert-iso-14001', 3) },
  { name: 'leed.png', data: () => readSingle('cert-leed') },
  { name: 'iatf-16949.png', data: () => readSingle('cert-iatf-16949') },
];

for (const { name, data } of outputs) {
  const outFile = path.join(outDir, name);
  const buf = data();
  fs.writeFileSync(outFile, buf);
  console.log(`Wrote ${outFile} (${buf.length} bytes)`);
}
