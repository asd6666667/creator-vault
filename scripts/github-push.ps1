# Push Creator Vault to GitHub
# Usage (PowerShell): cd C:\Users\86158\Desktop\4 ; .\scripts\github-push.ps1 -RepoName "creator-vault"

param(
  [string]$RepoName = "creator-vault",
  [string]$GitExe = ""
)

$projectRoot = Resolve-Path (Join-Path $PSScriptRoot "..")

function Find-Git {
  param([string]$Override)
  if ($Override -and (Test-Path $Override)) { return $Override }
  $candidates = @(
    "git",
    "D:\Git\cmd\git.exe",
    "D:\PortableGit\cmd\git.exe",
    "C:\Program Files\Git\cmd\git.exe",
    "$env:LOCALAPPDATA\Programs\Git\cmd\git.exe"
  )
  foreach ($c in $candidates) {
    if ($c -eq "git") {
      $cmd = Get-Command git -ErrorAction SilentlyContinue
      if ($cmd) { return $cmd.Source }
    } elseif (Test-Path $c) { return $c }
  }
  return $null
}

$git = Find-Git -Override $GitExe
if (-not $git) {
  Write-Host "未找到 Git。请先安装：" -ForegroundColor Red
  Write-Host '  winget install Git.Git -e --source winget --location "D:\Git"'
  Write-Host "然后重新运行本脚本。"
  exit 1
}

Write-Host "Using Git: $git" -ForegroundColor Cyan
Set-Location $projectRoot

& $git init
& $git add -A
& $git status

$hasCommit = & $git rev-parse HEAD 2>$null
if (-not $hasCommit) {
  & $git commit -m "feat: Creator Vault Web3 wallet with TokenCore tcx-wasm"
}

Write-Host ""
Write-Host "下一步：在 GitHub 创建空仓库 '$RepoName'（不要勾选 README）" -ForegroundColor Yellow
Write-Host "然后执行（把 YOUR_USERNAME 换成你的 GitHub 用户名）：" -ForegroundColor Yellow
Write-Host ""
Write-Host "  & `"$git`" remote add origin https://github.com/YOUR_USERNAME/$RepoName.git"
Write-Host "  & `"$git`" branch -M main"
Write-Host "  & `"$git`" push -u origin main"
Write-Host ""
Write-Host "若已安装 GitHub CLI (gh)，可一键创建并推送：" -ForegroundColor Cyan
Write-Host "  gh auth login"
Write-Host "  gh repo create $RepoName --public --source=. --remote=origin --push"
