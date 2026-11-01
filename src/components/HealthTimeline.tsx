import { MILESTONES } from "@/lib/health";

export default function HealthTimeline({ elapsed }: { elapsed: number }) {
  const nextIdx = MILESTONES.findIndex((m) => m.ms > elapsed);

  return (
    <section className="card">
      <h2>体の回復タイムライン</h2>
      <ol className="timeline">
        {MILESTONES.map((m, i) => {
          const done = elapsed >= m.ms;
          const isNext = i === nextIdx;
          const prev = i === 0 ? 0 : MILESTONES[i - 1].ms;
          const pct = isNext ? Math.min(100, ((elapsed - prev) / (m.ms - prev)) * 100) : 0;
          return (
            <li key={m.label} className={done ? "done" : isNext ? "next" : ""}>
              <span className="dot">{done ? "✓" : ""}</span>
              <div className="tl-body">
                <div className="tl-label">{m.label}</div>
                <div className="tl-text">{m.text}</div>
                {isNext && (
                  <div className="bar thin">
                    <div className="bar-fill" style={{ width: `${pct}%` }} />
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
