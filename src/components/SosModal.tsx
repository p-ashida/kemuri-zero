import { useEffect, useState } from "react";
import { TRIGGERS, type Craving, type Trigger } from "@/lib/storage";

type Props = {
  onClose: () => void;
  onRecord: (c: Craving) => void;
};

const TOTAL = 180; // 衝動のピークはおよそ3〜5分で過ぎるとされる

// 吸って4秒・止めて2秒・吐いて6秒
const BREATH = [
  { label: "吸って", sec: 4, cls: "in" },
  { label: "止めて", sec: 2, cls: "hold" },
  { label: "吐いて", sec: 6, cls: "out" },
] as const;
const CYCLE = BREATH.reduce((a, b) => a + b.sec, 0);

const TIPS = [
  "コップ1杯の水をゆっくり飲もう",
  "歯みがきをすると、吸いたい気持ちが落ち着きやすい",
  "その場から少し離れて、歩いてみよう",
  "ガムやミントを口に入れてみよう",
  "浮いたお金で何を買うか想像してみよう",
  "肩をぐるぐる回して、体をほぐそう",
  "誰かに「今吸いたい」とメッセージを送ってみよう",
];

export default function SosModal({ onClose, onRecord }: Props) {
  const [left, setLeft] = useState(TOTAL);
  const [phase, setPhase] = useState<"guide" | "done">("guide");
  const [trigger, setTrigger] = useState<Trigger | null>(null);

  useEffect(() => {
    if (phase !== "guide") return;
    const id = setInterval(() => {
      setLeft((l) => {
        if (l <= 1) {
          setPhase("done");
          return 0;
        }
        return l - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [phase]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const passed = TOTAL - left;
  let t = passed % CYCLE;
  let step: (typeof BREATH)[number] = BREATH[0];
  for (const b of BREATH) {
    if (t < b.sec) {
      step = b;
      break;
    }
    t -= b.sec;
  }
  const tip = TIPS[Math.floor(passed / 20) % TIPS.length];
  const mm = Math.floor(left / 60);
  const ss = String(left % 60).padStart(2, "0");

  const finish = () => {
    onRecord({ at: new Date().toISOString(), trigger: trigger ?? "その他" });
    onClose();
  };

  return (
    <div className="sos-overlay" role="dialog" aria-modal="true" aria-label="吸いたい気持ちを乗り切る">
      <button className="sos-close" onClick={onClose} aria-label="閉じる">
        ×
      </button>

      {phase === "guide" ? (
        <div className="sos-content">
          <p className="sos-lead">吸いたい気持ちは、数分で必ず弱まります。</p>
          <div className={`breath ${step.cls}`}>
            <div className="breath-circle" />
            <span className="breath-label">{step.label}</span>
          </div>
          <div className="sos-timer tabular">
            {mm}:{ss}
          </div>
          <p className="sos-tip" key={tip}>
            💡 {tip}
          </p>
          <button className="btn ghost light" onClick={() => setPhase("done")}>
            もう大丈夫
          </button>
        </div>
      ) : (
        <div className="sos-content">
          <div className="sos-win">🎉</div>
          <h2>乗り越えました！</h2>
          <p className="sos-lead">きっかけは何でしたか？（次の対策に役立ちます）</p>
          <div className="chips">
            {TRIGGERS.map((tr) => (
              <button key={tr} className={`chip ${trigger === tr ? "on" : ""}`} onClick={() => setTrigger(tr)}>
                {tr}
              </button>
            ))}
          </div>
          <button className="btn primary light" onClick={finish}>
            記録して戻る
          </button>
        </div>
      )}
    </div>
  );
}
