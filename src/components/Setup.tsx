import { useState } from "react";
import type { Profile } from "@/lib/storage";

type Props = {
  initial: Profile | null;
  onSave: (p: Profile) => void;
  onCancel?: () => void;
};

function toLocalInput(iso: string) {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function Setup({ initial, onSave, onCancel }: Props) {
  const [quitAt, setQuitAt] = useState(toLocalInput(initial?.quitAt ?? new Date().toISOString()));
  const [cigsPerDay, setCigsPerDay] = useState(String(initial?.cigsPerDay ?? 20));
  const [pricePerPack, setPricePerPack] = useState(String(initial?.pricePerPack ?? 600));
  const [cigsPerPack, setCigsPerPack] = useState(String(initial?.cigsPerPack ?? 20));
  const [goalName, setGoalName] = useState(initial?.goalName ?? "");
  const [goalPrice, setGoalPrice] = useState(initial?.goalPrice ? String(initial.goalPrice) : "");

  const valid = Number(cigsPerDay) > 0 && Number(pricePerPack) > 0 && Number(cigsPerPack) > 0 && quitAt;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid) return;
    onSave({
      quitAt: new Date(quitAt).toISOString(),
      cigsPerDay: Number(cigsPerDay),
      pricePerPack: Number(pricePerPack),
      cigsPerPack: Number(cigsPerPack),
      goalName: goalName.trim(),
      goalPrice: Number(goalPrice) || 0,
      cravings: initial?.cravings ?? [],
    });
  };

  return (
    <main className="container">
      <header className="hero">
        <div className="logo">けむりゼロ</div>
        <h1>{initial ? "設定を編集" : "吸わなかった分だけ、\n貯まっていく。"}</h1>
        {!initial && (
          <p className="muted">
            禁煙で浮いたお金と、体が回復していく様子をリアルタイムで表示します。登録不要・データはこの端末にだけ保存されます。
          </p>
        )}
      </header>

      <form className="card form" onSubmit={submit}>
        <label>
          <span>禁煙を始めた日時</span>
          <input type="datetime-local" value={quitAt} onChange={(e) => setQuitAt(e.target.value)} required />
        </label>
        <div className="row">
          <label>
            <span>1日に吸っていた本数</span>
            <div className="suffix">
              <input type="number" inputMode="numeric" min={1} value={cigsPerDay} onChange={(e) => setCigsPerDay(e.target.value)} required />
              <em>本</em>
            </div>
          </label>
          <label>
            <span>1箱の本数</span>
            <div className="suffix">
              <input type="number" inputMode="numeric" min={1} value={cigsPerPack} onChange={(e) => setCigsPerPack(e.target.value)} required />
              <em>本</em>
            </div>
          </label>
        </div>
        <label>
          <span>1箱の値段</span>
          <div className="suffix">
            <input type="number" inputMode="numeric" min={1} value={pricePerPack} onChange={(e) => setPricePerPack(e.target.value)} required />
            <em>円</em>
          </div>
        </label>

        <div className="divider">
          <span>ごほうび（任意）</span>
        </div>
        <div className="row">
          <label>
            <span>浮いたお金で買いたいもの</span>
            <input type="text" placeholder="例：ワイヤレスイヤホン" value={goalName} onChange={(e) => setGoalName(e.target.value)} />
          </label>
          <label>
            <span>値段</span>
            <div className="suffix">
              <input type="number" inputMode="numeric" min={0} placeholder="30000" value={goalPrice} onChange={(e) => setGoalPrice(e.target.value)} />
              <em>円</em>
            </div>
          </label>
        </div>

        <button className="btn primary" type="submit" disabled={!valid}>
          {initial ? "保存する" : "禁煙をスタート"}
        </button>
        {onCancel && (
          <button className="btn ghost" type="button" onClick={onCancel}>
            キャンセル
          </button>
        )}
      </form>
    </main>
  );
}
