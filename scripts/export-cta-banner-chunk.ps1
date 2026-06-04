# Export CTA banner (Figma node 78:1519) via use_figma chunks.
# Usage: run use_figma for each index 0..N-1, save JSON chunk to scripts/b64-chunks/cta-banner-{i}.txt
# Then: .\scripts\assemble-b64.ps1 -OutFile images\cta-banner-bg.jpg -ChunkDir scripts\b64-chunks -Prefix cta-banner-

param(
    [int]$Index = 0,
    [int]$ChunkSize = 12000,
    [int]$Width = 1200
)

Write-Host "Run this in Figma MCP use_figma (index $Index):"
Write-Host @"
const node = await figma.getNodeByIdAsync('78:1519');
const bytes = await node.exportAsync({ format: 'JPG', constraint: { type: 'WIDTH', value: $Width } });
const b64 = figma.base64Encode(bytes);
const size = $ChunkSize;
const i = $Index;
return { chunk: b64.slice(i * size, (i + 1) * size), index: i, total: b64.length };
"@
