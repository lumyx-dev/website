import Link from "next/link";
import { Button, StatusDot, LumyxMark } from '@lumyx/ui';
import { DOCS_URL, FOOTER_COLS, VERSION, REPO } from "@/lib/site-data";
import { ThemeToggle } from "./theme-toggle";

function Mark({ size = 20 }: { size?: number }) {
  return <LumyxMark size={size} className="text-accent" />;
}

const NAV = [
  { href: "/#why", label: "Why Lumyx" },
  { href: "/#platform", label: "Observability" },
  // Routes desactivees (app/_pricing, app/_blog).
  // { href: "/pricing", label: "Pricing" },
  // La doc est hors origine : l'entree part vers docs.lumyx.dev, pas vers /docs.
  { href: DOCS_URL, label: "Docs" },
  // { href: "/blog", label: "Blog" },
];

export function SiteHeader() {
  return (
    <header className="relative border-b border-subtle">
      <div className="mx-auto flex h-16 max-w-[1280px] items-center gap-[30px] px-10">
        <Link href="/" className="flex flex-none items-center gap-2.5 no-underline hover:no-underline">
          <Mark />
          <span className="text-[15px] font-semibold tracking-[-0.02em] text-strong">Lumyx</span>
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          {NAV.map((n) =>
            n.href.startsWith("/") ? (
              <Link key={n.href} href={n.href} className="text-[12.5px] text-muted no-underline hover:text-strong hover:no-underline">
                {n.label}
              </Link>
            ) : (
              <a key={n.href} href={n.href} className="text-[12.5px] text-muted no-underline hover:text-strong hover:no-underline">
                {n.label}
              </a>
            )
          )}
        </nav>
        <span className="flex-1" />
        <span className="sl-num hidden text-12 text-faint sm:inline">{VERSION}</span>
        <ThemeToggle />
        <a href={REPO} className="inline-flex h-8 items-center rounded-sm border border-hairline px-3 text-[12.5px] text-body no-underline hover:bg-hover hover:no-underline">
          GitHub
        </a>
        <Button size="sm" variant="primary" asChild><a href={`${DOCS_URL}/quickstart`} className="no-underline hover:no-underline">Get started</a></Button>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-subtle">
      <div className="mx-auto grid max-w-[1280px] grid-cols-2 gap-8 px-10 pb-8 pt-12 md:grid-cols-[1.4fr_repeat(4,1fr)]">
        <div className="flex flex-col gap-3">
          <span className="flex items-center gap-2.5">
            <Mark size={18} />
            <span className="text-13 font-semibold tracking-[-0.01em] text-strong">Lumyx</span>
          </span>
          <span className="max-w-[260px] text-12 leading-relaxed text-muted text-pretty">
            Open-source WebRTC SFU with observability in the media path. Self-host it, or use Lumyx Cloud.
          </span>
        </div>
        {FOOTER_COLS.map((col) => (
          <div key={col.title} className="flex flex-col gap-2.5">
            <span className="sl-label">{col.title}</span>
            {col.links.map((l) =>
              l.href.startsWith("/") ? (
                <Link key={l.label} href={l.href} className="text-[12.5px] text-muted no-underline hover:text-strong hover:no-underline">{l.label}</Link>
              ) : (
                <a key={l.label} href={l.href} className="text-[12.5px] text-muted no-underline hover:text-strong hover:no-underline">{l.label}</a>
              )
            )}
          </div>
        ))}
      </div>
      <div className="mx-auto flex max-w-[1280px] flex-wrap items-center gap-4 px-10 pb-8">
        <span className="sl-num text-12 text-faint">MIT licensed · © 2026 Lumyx</span>
        <span className="flex-1" />
        <span className="sl-num text-12 text-faint">All systems operational</span>
        <StatusDot status="live" />
      </div>
    </footer>
  );
}

export function SectionHead({ index, label, blurb }: { index: string; label: string; blurb?: string }) {
  return (
    <div className="flex flex-col gap-2 lg:sticky lg:top-8">
      <span className="sl-num text-12 text-faint">{index}</span>
      <span className="sl-label">{label}</span>
      {blurb ? <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted text-pretty">{blurb}</p> : null}
    </div>
  );
}
