# 上传到 GitHub

## 前提

本机需已安装 **Git**。若未安装，在**管理员 PowerShell** 执行：

```powershell
winget install Git.Git -e --source winget --location "D:\Git" --accept-package-agreements --accept-source-agreements
```

安装后把 `D:\Git\cmd` 加入 PATH，**重启 Cursor**。

## 方式一：脚本（推荐）

```powershell
cd C:\Users\86158\Desktop\4
.\scripts\github-push.ps1 -RepoName "creator-vault"
```

按脚本提示在 GitHub 网页创建空仓库后执行 `git push`。

## 方式二：手动命令

```powershell
cd C:\Users\86158\Desktop\4
git init
git add -A
git commit -m "feat: Creator Vault wallet with TokenCore"
git branch -M main
git remote add origin https://github.com/你的用户名/creator-vault.git
git push -u origin main
```

## 方式三：GitHub 网页上传（无需 Git）

1. 打开 https://github.com/new 创建仓库 `creator-vault`
2. 进入仓库 → **Add file** → **Upload files**
3. 将 `C:\Users\86158\Desktop\4` 下所有文件拖入（可先排除 `node_modules`、`dist`）

## 说明

- `public/tcx-wasm/tcx_wasm_bg.wasm`（约 2.3MB）需一并上传，否则 TokenCore 无法在线使用
- 不要上传 `node_modules`、`.env` 等敏感文件（已在 `.gitignore` 中）
