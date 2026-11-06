import { METRICS } from '@/lib/metrics-data';

/**
 * « At a glance » (maquette Docs v3) : une carte par metrique, qui renvoie a sa section.
 * Seuil par defaut en pastille, ce qu'elle casse, et le nom du champ.
 */
export function MetricsGlance() {
  return (
    <div className="not-content grid gap-3 sm:grid-cols-3">
      {METRICS.map((m) => (
        <a
          key={m.field}
          href={`#${m.field}`}
          className="flex flex-col gap-3 rounded-lg border border-stroke bg-card p-4 text-body no-underline transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 hover:border-faint hover:text-body hover:no-underline"
        >
          <span className="flex items-center justify-between gap-2">
            <span className="text-16 font-semibold text-strong">{m.name}</span>
            <span className="sl-num whitespace-nowrap rounded-pill bg-danger-tint px-2 py-0.5 font-mono text-12 text-danger">
              {m.threshold}
            </span>
          </span>
          <span className="text-14 text-muted">{m.breaks}</span>
          <span className="mt-auto font-mono text-12 text-faint">{m.field}</span>
        </a>
      ))}
    </div>
  );
}
