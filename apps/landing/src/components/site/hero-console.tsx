import { cx } from "@/lib/cx";
import { STATUS_TEXT, linePath, severity, statusOf, useRoom } from "@/lib/peer-sim";

const ROW_H = 40;

/* Columns: peer_id · score · rtt · loss · [jitter] · status. Jitter and the score bar appear
   once the console itself is wide enough (container query), not the viewport. */
const COLS =
  "grid-cols-[72px_38px_minmax(0,1fr)_minmax(0,1fr)_78px] @xl:grid-cols-[100px_minmax(0,1fr)_64px_70px_76px_92px]";

/** The hero's live room: peers re-sort by quality score every 500 ms. Demo data. */
export function HeroConsole() {
  const room = useRoom();
  const order = [...room.peers].sort((a, b) => a.score - b.score).map((p) => p.id);

  return (
    <div className="@container flex flex-col overflow-hidden rounded-xs border border-stroke bg-card">
      <div className="flex min-h-11 flex-wrap items-center gap-x-3 gap-y-2 border-b border-hairline px-4 py-2 text-12">
        <span className="size-[7px] rounded-pill bg-ok-solid animate-breathe motion-reduce:animate-none" />
        <span className="sl-num text-strong">webinar-us</span>
        <span className="sl-num text-faint">eu-west-3 · 6 peers</span>
        <span className="flex-1" />
        <span className="rounded-[4px] border border-stroke px-1.5 py-0.5 text-muted">demo data</span>
      </div>

      <div
        className={cx(
          "grid gap-x-2.5 border-b border-hairline px-4 py-2.5 text-11 uppercase tracking-[0.04em] text-faint",
          COLS,
        )}
      >
        <span>peer_id</span>
        <span>score</span>
        <span className="text-right">rtt_ms</span>
        <span className="text-right">loss</span>
        <span className="hidden text-right @xl:block">jitter_ms</span>
        <span className="text-right">status</span>
      </div>

      <div className="relative" style={{ height: room.peers.length * ROW_H }}>
        {room.peers.map((p) => {
          const st = statusOf(p);
          const bad = st === "bad";
          return (
            <div
              key={p.id}
              className={cx(
                "sl-num absolute inset-x-0 top-0 grid h-10 items-center gap-x-2.5 border-b border-subtle px-4 text-13 transition-transform duration-[360ms] ease-[cubic-bezier(.2,.7,.2,1)] motion-reduce:transition-none",
                COLS,
                bad && "bg-danger-tint",
              )}
              style={{ transform: `translateY(${order.indexOf(p.id) * ROW_H}px)` }}
            >
              <span className="text-strong">{p.id}</span>
              <span className="flex items-center gap-2.5">
                <span className="w-6" style={{ color: STATUS_TEXT[st] }}>
                  {p.score}
                </span>
                <span className="hidden h-1 max-w-[140px] flex-1 overflow-hidden rounded-pill bg-active @xl:block">
                  <span className="block h-full" style={{ width: `${p.score}%`, background: STATUS_TEXT[st] }} />
                </span>
              </span>
              <span className="text-right" style={{ color: severity(p.rtt, 150, 200) }}>
                {Math.round(p.rtt)}
              </span>
              <span className="text-right" style={{ color: severity(p.loss, 1, 2) }}>
                {p.loss.toFixed(2)}%
              </span>
              <span className="hidden text-right @xl:block" style={{ color: severity(p.jit, 20, 30) }}>
                {Math.round(p.jit)}
              </span>
              <span
                className="flex items-center justify-end gap-[7px] text-12"
                style={{ color: bad ? STATUS_TEXT.bad : STATUS_TEXT.ok }}
              >
                <span
                  className={cx(
                    "size-1.5 rounded-pill",
                    !bad && room.live && "animate-breathe motion-reduce:animate-none",
                  )}
                  style={{ background: bad ? STATUS_TEXT.bad : STATUS_TEXT.ok }}
                />
                {bad ? "degraded" : "live"}
              </span>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col gap-2.5 border-t border-hairline px-4 pb-3.5 pt-4">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-12">
          <span className="flex items-center gap-1.5 text-muted">
            <span className="h-0.5 w-2.5 bg-accent" />
            jitter_ms
          </span>
          <span className="flex items-center gap-1.5 text-muted">
            <span className="h-0.5 w-2.5 bg-warn-solid" />
            packet_loss_ratio
          </span>
          <span className="flex-1" />
          <span className="text-faint">room avg · 30s · 500 ms</span>
        </div>
        <svg viewBox="0 0 760 120" preserveAspectRatio="none" className="block h-[110px] w-full" aria-hidden>
          <line
            x1="0" x2="760" y1="62" y2="62"
            stroke="var(--danger-solid)" strokeWidth="1" strokeDasharray="3 4" opacity="0.6"
            vectorEffect="non-scaling-stroke"
          />
          <path d={linePath(room.loss, 6)} fill="none" stroke="var(--warn-solid)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
          <path d={linePath(room.jit, 60)} fill="none" stroke="var(--accent)" strokeWidth="1.75" vectorEffect="non-scaling-stroke" />
        </svg>
        <div className="sl-num flex justify-between text-11 text-faint">
          <span>-30s</span>
          <span>jitter_ms &gt; 30</span>
          <span>now</span>
        </div>
      </div>
    </div>
  );
}
