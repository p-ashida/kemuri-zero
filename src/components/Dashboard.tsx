import { useEffect, useState } from "react";
import type { Craving, Profile } from "@/lib/storage";
import HealthTimeline from "./HealthTimeline";
import SosModal from "./SosModal";

type Props = {
  profile: Profile;
  onUpdate: (p: Profile) => void;
  onEdit: () => void;
  onReset: () => void;
};

const DAY = 24 * 60 * 60 * 1000;
// 1本あたり寿命が約11分縮むとされる（英国の研究による目安）
const MINUTES_PER_CIG = 11;

const yen = new Intl.NumberFormat("ja-JP", { style: "currency", currency: "JPY", maximumFractionDigits: 0 });

function useNow(intervalMs = 1000) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}

function formatElapsed(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  const days = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return { days, clock: `${pad(h)}:${pad(m)}:${pad(sec)}` };
}

function formatLife(minutes: number) {
  const d = Math.floor(minutes / (60 * 24));
  const h = Math.floor((minutes % (60 * 24)) / 60);
  const m = Math.floor(minutes % 60);
  if (d > 0) return `${d}日 ${h}時間`;
  if (h > 0) return `${h}時間 ${m}分`;
  return `${m}分`;
}

export default function Dashboard({ profile, onUpdate, onEdit, onReset }: Props) {
  const now = useNow();
  const [sosOpen, setSosOpen] = useState(false);

  const elapsed = Math.max(0, now - new Date(profile.quitAt).getTime());
  const { days, clock } = formatElapsed(elapsed);
  const notSmoked = (elapsed / DAY) * profile.cigsPerDay;
  const saved = notSmoked * (profile.pricePerPack / profile.cigsPerPack);
  const goalPct = profile.goalPrice > 0 ? Math.min(100, (saved / profile.goalPrice) * 100) : 0;
  const yearly = profile.cigsPerDay * 365 * (profile.pricePerPack / profile.cigsPerPack);

  const recordCraving = (c: Craving) => {
    onUpdate({ ...profile, cravings: [...profile.cravings, c] });
  };

  return (
    <main className="container">
      <header className="topbar">
        <div className="logo">けむりゼロ</div>
        <button className="btn link" onClick={onEdit}>
          設定
        </button>
      </header>

      <section className="card streak">
        <p className="muted small">禁煙して</p>
        <div className="streak-days">
          <strong>{days}</strong>
          <span>日</span>
        </div>
        <div className="streak-clock tabular">{clock}</div>
      </section>

      <section className="card savings">
        <p className="muted small">吸わなかったことで浮いたお金</p>
        <div className="money tabular">{yen.format(Math.floor(saved))}</div>
        <p className="muted small">このまま続けると1年で {yen.format(Math.round(yearly))}</p>

        {profile.goalPrice > 0 && (
          <div className="goal">
            <div className="goal-head">
              <span>🎁 {profile.goalName || "ごほうび"}</span>
              <span className="tabular">{goalPct.toFixed(0)}%</span>
            </div>
            <div className="bar">
              <div className="bar-fill" style={{ width: `${goalPct}%` }} />
            </div>
            <p className="muted small">
              {goalPct >= 100
                ? "達成！自分にごほうびをあげましょう 🎉"
                : `あと ${yen.format(Math.ceil(profile.goalPrice - saved))}`}
            </p>
          </div>
        )}
      </section>

      <section className="stats">
        <div className="card stat">
          <p className="muted small">吸わなかった本数</p>
          <div className="stat-value tabular">
            {Math.floor(notSmoked).toLocaleString()}
            <span>本</span>
          </div>
        </div>
        <div className="card stat">
          <p className="muted small">取り戻した時間</p>
          <div className="stat-value tabular">{formatLife(notSmoked * MINUTES_PER_CIG)}</div>
        </div>
        <div className="card stat">
          <p className="muted small">衝動に勝った回数</p>
          <div className="stat-value tabular">
            {profile.cravings.length}
            <span>回</span>
          </div>
        </div>
      </section>

      <HealthTimeline elapsed={elapsed} />

      <footer className="footer">
        <p className="muted small">
          表示している体の変化は一般的な目安で、個人差があります。体調に不安がある場合や禁煙がつらい場合は、医師や禁煙外来に相談してください。
        </p>
        <button
          className="btn link danger"
          onClick={() => {
            if (confirm("記録をすべて消して最初からやり直しますか？")) onReset();
          }}
        >
          記録をリセット
        </button>
      </footer>

      <button className="sos-fab" onClick={() => setSosOpen(true)} aria-label="吸いたくなったら押す">
        <span className="sos-label">SOS</span>
        <span className="sos-sub">吸いたい</span>
      </button>

      {sosOpen && <SosModal onClose={() => setSosOpen(false)} onRecord={recordCraving} />}
    </main>
  );
}
