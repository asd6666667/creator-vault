import { useEffect, useState } from "react";
import {
  createPasswordWallet,
  loadStoredKeystore,
  unlockKeystore,
} from "../lib/tokenCore";
import type { WalletSession } from "../lib/tokenCore";

type Mode = "create" | "unlock";

interface WalletModalProps {
  open: boolean;
  loading: boolean;
  onClose: () => void;
  onConnected: (session: WalletSession, password: string) => void;
}

export default function WalletModal({
  open,
  loading,
  onClose,
  onConnected,
}: WalletModalProps) {
  const [mode, setMode] = useState<Mode>("create");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [mnemonic, setMnemonic] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    setPassword("");
    setConfirm("");
    setMnemonic("");
    setError("");
    setBusy(false);
    setMode(loadStoredKeystore() ? "unlock" : "create");
  }, [open]);

  if (!open) return null;

  const submit = async () => {
    setError("");
    if (password.length < 8) {
      setError("密码至少 8 位");
      return;
    }
    if (mode === "create" && password !== confirm) {
      setError("两次密码不一致");
      return;
    }

    setBusy(true);
    try {
      if (mode === "create") {
        const session = await createPasswordWallet(password, mnemonic || undefined);
        onConnected(session, password);
      } else {
        const ks = loadStoredKeystore();
        if (!ks) {
          setMode("create");
          setError("未找到本地钱包，请创建新钱包");
          return;
        }
        const session = await unlockKeystore(ks, password);
        onConnected(session, password);
      }
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "钱包操作失败");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="overlay" onClick={onClose} role="presentation">
      <div className="modal" onClick={(e) => e.stopPropagation()} role="dialog">
        <h2>{mode === "create" ? "创建创作者钱包" : "解锁钱包"}</h2>
        <p className="desc">
          由 <strong>TokenCore</strong>（tcx-wasm）在本地派生密钥与签名，助记词与私钥不出浏览器。
        </p>

        {loadStoredKeystore() && (
          <div className="wallet-mode-tabs">
            <button
              type="button"
              className={mode === "unlock" ? "active" : ""}
              onClick={() => setMode("unlock")}
            >
              解锁
            </button>
            <button
              type="button"
              className={mode === "create" ? "active" : ""}
              onClick={() => setMode("create")}
            >
              新建
            </button>
          </div>
        )}

        <div className="field">
          <label htmlFor="wallet-password">钱包密码</label>
          <input
            id="wallet-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="至少 8 位"
            autoComplete={mode === "unlock" ? "current-password" : "new-password"}
          />
        </div>

        {mode === "create" && (
          <>
            <div className="field">
              <label htmlFor="wallet-confirm">确认密码</label>
              <input
                id="wallet-confirm"
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="wallet-mnemonic">导入助记词（可选，留空则随机生成）</label>
              <textarea
                id="wallet-mnemonic"
                value={mnemonic}
                onChange={(e) => setMnemonic(e.target.value)}
                placeholder="12 或 24 个英文单词"
                rows={3}
              />
            </div>
          </>
        )}

        {loading && <p className="desc">正在加载 TokenCore WASM…</p>}
        {error && <p className="wallet-error">{error}</p>}

        <div className="modal-actions">
          <button type="button" className="btn-secondary" onClick={onClose} disabled={busy}>
            取消
          </button>
          <button
            type="button"
            className="btn-primary"
            onClick={submit}
            disabled={busy || loading}
          >
            {busy ? "处理中…" : mode === "create" ? "创建并连接" : "解锁"}
          </button>
        </div>
      </div>
    </div>
  );
}
