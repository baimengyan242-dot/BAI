[CmdletBinding()]
param(
  [string]$DshCommand,
  [string]$Profile = 'desktop',
  [string]$Package
)
$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $PSScriptRoot
if (-not $Package) {
  $candidate = Get-ChildItem -LiteralPath (Join-Path $projectRoot 'release') -Filter '*.tgz' | Sort-Object LastWriteTime -Descending | Select-Object -First 1
  if (-not $candidate) { throw 'Package not found. Run pnpm run build and pnpm pack --pack-destination release first.' }
  $Package = $candidate.FullName
}
$Package = (Resolve-Path -LiteralPath $Package).Path
if (-not $DshCommand) {
  $command = Get-Command dsh -ErrorAction SilentlyContinue
  if ($command) { $DshCommand = $command.Source }
  else { throw 'Use -DshCommand to specify resources/runtime/cli/bin/dsh.cmd from the desktop installation. Close DSH completely before managing its desktop profile.' }
}
$DshCommand = (Resolve-Path -LiteralPath $DshCommand).Path
& $DshCommand plugin --profile $Profile add ('file:' + $Package)
if ($LASTEXITCODE -ne 0) { throw 'The official DSH install command failed. Check the version, network and whether DSH is fully closed.' }
Write-Output 'Plugin installed. Reopen DSH and select DeepSeek Memory Bridge in Settings. Automatic recall is off by default.'
