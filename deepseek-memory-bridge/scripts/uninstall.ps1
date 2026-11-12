[CmdletBinding()]
param([string]$DshCommand, [string]$Profile = 'desktop')
$ErrorActionPreference = 'Stop'
if (-not $DshCommand) {
  $command = Get-Command dsh -ErrorAction SilentlyContinue
  if ($command) { $DshCommand = $command.Source }
  else { throw 'Use -DshCommand to specify resources/runtime/cli/bin/dsh.cmd from the desktop installation.' }
}
$DshCommand = (Resolve-Path -LiteralPath $DshCommand).Path
& $DshCommand plugin --profile $Profile remove dsh-deepseek-memory-bridge
if ($LASTEXITCODE -ne 0) { throw 'Uninstall failed. Close DSH completely and retry.' }
Write-Output 'Plugin uninstalled. Databases, original archives, exports and backups have been retained.'
