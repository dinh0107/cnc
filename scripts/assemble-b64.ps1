param(
    [Parameter(Mandatory = $true)][string]$OutFile,
    [Parameter(Mandatory = $true)][string]$ChunkDir,
    [Parameter(Mandatory = $true)][string]$Prefix
)

$parts = Get-ChildItem -Path $ChunkDir -Filter "${Prefix}*.txt" | Sort-Object Name
if (-not $parts.Count) {
    throw "No chunks found for prefix $Prefix in $ChunkDir"
}

$sb = New-Object System.Text.StringBuilder
foreach ($f in $parts) {
    [void]$sb.Append([IO.File]::ReadAllText($f.FullName).Trim())
}

$dir = Split-Path -Parent $OutFile
if ($dir -and -not (Test-Path $dir)) {
    New-Item -ItemType Directory -Path $dir -Force | Out-Null
}

[IO.File]::WriteAllBytes($OutFile, [Convert]::FromBase64String($sb.ToString()))
Write-Host "Wrote $OutFile ($((Get-Item $OutFile).Length) bytes) from $($parts.Count) chunks"
