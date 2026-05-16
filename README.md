# Creator Vault + TokenCore

Web3 创作者极简网页钱包，已接入 imToken **[token-core](https://github.com/consenlabs/token-core-monorepo)** 的浏览器 WASM 包 **`@consenlabs/tcx-wasm`**。

## TokenCore 能力（已接入）

| 功能 | tcx-wasm API |
|------|----------------|
| 创建 / 解锁钱包 | `create_keystore` + `derive_accounts` |
| 以太坊收款地址 | `ETHEREUM` / `m/44'/60'/0'/0/0` |
| 铸造作品签名 | `sign_message`（PersonalSign 铸造意向） |
| 打赏身份链接 | `sign_message` + 本地链接 |

助记词与私钥在浏览器内由 WASM 处理，不上传服务器。Keystore JSON 保存在 `localStorage`（`creator-vault-keystore`），密码仅驻留内存。

## 快速启动（无需 npm）

已内置 `public/tcx-wasm/`（v0.9.1），只需 Node：

```bash
node server.mjs
```

浏览器打开 **http://localhost:5173**

## 完整开发（需 Node.js + npm）

```bash
npm install
npm run dev
```

`postinstall` 会自动下载 WASM 到 `public/tcx-wasm/`。

## 目录

```
public/tcx-wasm/     # @consenlabs/tcx-wasm 浏览器包
public/js/
  tcxBridge.js       # TokenCore 封装（standalone）
  creatorApp.js      # standalone 主应用
src/lib/
  tcxWasm.ts         # Vite/React 侧 WASM 初始化
  tokenCore.ts       # 钱包会话、签名
src/components/
  WalletModal.tsx    # 创建 / 解锁钱包
```

## 说明

- **铸造 NFT**：当前为 TokenCore 链下签名（铸造意向），非链上合约铸造；可后续对接 ERC-721 交易构建 + `sign_tx`。
- **资金流水 / 版税汇总**：仍为演示数据，便于保持「只展示作品与资金」的极简 UI。
- 参考文档：[tcx-wasm README](https://github.com/consenlabs/token-core-monorepo/tree/tenth-anniversary/token-core/tcx-wasm)

## License

Apache-2.0
