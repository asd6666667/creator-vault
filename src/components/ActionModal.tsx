import { useEffect, useState } from "react";
import type { Action, Work } from "../types";

interface ActionModalProps {
  action: Action | null;
  works: Work[];
  tipLink: string;
  mintBusy?: boolean;
  walletAddress?: string;
  onClose: () => void;
  onMint: (title: string, supply: number, royalty: number) => void | Promise<void>;
  onCopyTip: () => void;
}

export default function ActionModal({
  action,
  works,
  tipLink,
  onClose,
  mintBusy = false,
  walletAddress,
  onMint,
  onCopyTip,
}: ActionModalProps) {
  const [title, setTitle] = useState("");
  const [supply, setSupply] = useState("50");
  const [royalty, setRoyalty] = useState("8");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!action) return;
    setTitle("");
    setSupply("50");
    setRoyalty("8");
    setCopied(false);
  }, [action]);

  if (!action) return null;

  const handleMint = async () => {
    if (!title.trim() || mintBusy) return;
    await onMint(title.trim(), Number(supply) || 1, Number(royalty) || 5);
    onClose();
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(tipLink);
    setCopied(true);
    onCopyTip();
    setTimeout(() => setCopied(false), 2000);
  };

  const totalRoyalty = works.reduce((s, w) => s + w.earned * (w.royaltyRate / 100), 0);

  return (
    <div className="overlay" onClick={onClose} role="presentation">
      <div
        className="modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="modal-title"
      >
        {action === "mint" && (
          <>
            <h2 id="modal-title">铸造作品</h2>
            <p className="desc">
              通过 TokenCore 本地签名铸造意向，不展示 Gas / 合约等链上细节。
              {walletAddress ? ` 地址 ${walletAddress.slice(0, 10)}…` : ""}
            </p>
            <div className="field">
              <label htmlFor="mint-title">作品名称</label>
              <input
                id="mint-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="给你的作品起个名字"
                autoFocus
              />
            </div>
            <div className="field">
              <label htmlFor="mint-supply">发行数量</label>
              <input
                id="mint-supply"
                type="number"
                min={1}
                value={supply}
                onChange={(e) => setSupply(e.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="mint-royalty">版税比例 (%)</label>
              <input
                id="mint-royalty"
                type="number"
                min={0}
                max={50}
                value={royalty}
                onChange={(e) => setRoyalty(e.target.value)}
              />
            </div>
            <div className="modal-actions">
              <button type="button" className="btn-secondary" onClick={onClose}>
                取消
              </button>
              <button
                type="button"
                className="btn-primary"
                disabled={!title.trim() || mintBusy}
                onClick={handleMint}
              >
                {mintBusy ? "签名中…" : "一键铸造"}
              </button>
            </div>
          </>
        )}

        {action === "royalty" && (
          <>
            <h2 id="modal-title">版税总览</h2>
            <p className="desc">
              累计预估版税{" "}
              <strong style={{ color: "var(--royalty)" }}>
                {totalRoyalty.toFixed(3)} ETH
              </strong>
            </p>
            <div className="royalty-list">
              {works.map((w) => (
                <div key={w.id} className="royalty-item">
                  <span>{w.title}</span>
                  <strong>
                    {w.royaltyRate}% · {w.earned.toFixed(2)} ETH
                  </strong>
                </div>
              ))}
            </div>
            <div className="modal-actions" style={{ marginTop: 16 }}>
              <button type="button" className="btn-primary" style={{ flex: 1 }} onClick={onClose}>
                知道了
              </button>
            </div>
          </>
        )}

        {action === "tip" && (
          <>
            <h2 id="modal-title">粉丝打赏</h2>
            <p className="desc">
              分享 TokenCore 身份链接，粉丝打赏直达你的以太坊地址。
              {walletAddress ? ` ${walletAddress}` : ""}
            </p>
            <div className="field">
              <label>专属打赏链接</label>
              <div className="tip-link-box">
                <input readOnly value={tipLink} aria-label="打赏链接" />
                <button type="button" className="copy-btn" onClick={handleCopy}>
                  {copied ? "已复制" : "复制"}
                </button>
              </div>
            </div>
            <div className="modal-actions">
              <button type="button" className="btn-secondary" onClick={onClose}>
                关闭
              </button>
              <button type="button" className="btn-primary" onClick={handleCopy}>
                分享给粉丝
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
