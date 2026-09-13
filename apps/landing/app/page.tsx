import Link from "next/link";
import { Button, Card, LumyxMark } from '@lumyx/ui';
import { ThemeToggle } from "@/components/site/theme-toggle";
import { CodePanel } from "@/components/site/code-panel";
import { PlatformBento } from "@/components/site/platform-bento";
// TIERS revient avec la section Pricing, plus bas, quand on la reaffiche.
import { CONFIG_STEPS, FEATURE_GROUPS, NO_LIST } from "@/lib/platform-data";
import { REPO } from "@/lib/site-data";
import { organizationJsonLd, softwareApplicationJsonLd } from "@/lib/schema";

const NAV = [
  { href: "/", label: "Product" },
  { href: "/#platform", label: "Observability" },
  { href: "/docs", label: "Docs" },
  // Routes desactivees (app/_blog, app/_pricing, app/_changelog).
  // { href: "/blog", label: "Blog" },
  // { href: "/pricing", label: "Pricing" },
  // { href: "/changelog", label: "Changelog" },
];

/**
 * The landing page — "Platform".
 * Dense, product-first, many entry points.
 */
export default function HomePage() {
  return (
    <div className="min-h-dvh bg-page text-body">
      <script type="application/ld+json">
        {JSON.stringify([organizationJsonLd(), softwareApplicationJsonLd()]).replace(/</g, "\\u003c")}
      </script>
      <header className="border-b border-subtle px-8">
        <div className="mx-auto flex h-15 w-full max-w-7xl items-center gap-6.5">
          <Link href="/" className="flex items-center gap-2.5 no-underline hover:no-underline">
            <LumyxMark size={18} className="text-accent" />
            <span className="text-[15px] font-semibold tracking-[-0.02em] text-strong">Lumyx</span>
          </Link>
          <nav className="hidden items-center gap-5 md:flex">
            {NAV.map((n) => (
              <Link key={n.label} href={n.href} className="text-[12.5px] text-muted no-underline hover:text-strong hover:no-underline">
                {n.label}
              </Link>
            ))}
          </nav>
          <span className="flex-1" />
          <ThemeToggle />
          <Button size="sm" variant="primary" asChild>
            <Link href="/docs/quickstart" className="no-underline hover:no-underline">Get started</Link>
          </Button>
        </div>
      </header>

      {/* Hero — one idea, centred, with the announcement pill above it. */}
      <section className="flex flex-col items-center gap-5.5 border-b border-subtle px-8 pb-14 pt-18 text-center">
        <a
          href={`${REPO}#project-status`}
          className="inline-flex h-7 items-center gap-2 rounded-pill border border-hairline bg-card p-0.75 pr-2 text-[12.5px] text-muted no-underline hover:no-underline"
        >
          <span className="inline-flex h-4.5 items-center rounded-pill bg-accent px-2 text-11 font-semibold tracking-[0.04em] text-on-accent">
            Alpha
          </span>
          ICE, DTLS, SRTP and RTP forwarding work end to end — the rest is planned
          <span className="text-faint">→</span>
        </a>

        <h1 className="max-w-220 text-[66px] font-semibold leading-[1.02] tracking-[-0.04em] text-strong text-balance">
          Ship real-time video you can actually debug
        </h1>
        <p className="max-w-155 text-[17px] leading-relaxed text-muted text-pretty">
          Lumyx is an open-source WebRTC SFU written in Rust. Selective forwarding, with jitter, packet loss,
          RTT, NACK and freeze measured inside the media path — per peer, per room, every 500ms.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
          <Button size="lg" variant="primary" asChild>
            <Link href="/docs/quickstart" className="no-underline hover:no-underline">Start building now</Link>
          </Button>
          <a
            href={REPO}
            className="inline-flex h-10.5 items-center rounded-sm border border-stroke px-3.5 text-[13.5px] text-strong no-underline hover:no-underline"
          >
            Open source
          </a>
        </div>
      </section>

      {/* Configuration — the tabbed code panel drives the whole story. */}
      <section id="platform" className="border-b border-subtle px-8 py-14">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-start gap-8 lg:grid-cols-[1.25fr_1fr]">
          <CodePanel />

          <div className="flex flex-col gap-4 pt-3">
            <h2 className="text-[28px] font-semibold leading-[1.12] tracking-[-0.028em] text-strong text-pretty">
              Configure it once, then stop thinking about it
            </h2>
            <p className="text-16 leading-relaxed text-muted text-pretty">
              Thresholds, remediation and destinations live in one file. The same six metrics reach your dashboard,
              your Prometheus, your webhook and your client SDK — no exporter to write, no collector to run.
            </p>

            <div className="flex flex-col pt-0.5">
              {CONFIG_STEPS.map((s, i) => (
                <div
                  key={s.index}
                  className={`flex gap-3 border-t border-subtle py-3 ${i === CONFIG_STEPS.length - 1 ? "border-b" : ""}`}
                >
                  <span className="sl-num w-4.5 flex-none text-12 text-faint">{s.index}</span>
                  <span className="text-[13.5px] leading-relaxed text-muted">
                    <strong className="font-semibold text-strong">{s.title}</strong> — {s.body}
                  </span>
                </div>
              ))}
            </div>

            <Link href="/docs" className="text-[13.5px] font-medium">Read the configuration reference</Link>
          </div>
        </div>
      </section>

      {/* The platform, in three shown promises. */}
      <section id="why" className="px-8 pb-2 pt-16">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-2">
          <span className="sl-label text-accent-text">The platform</span>
          <h2 className="max-w-155 text-[40px] font-semibold leading-[1.06] tracking-[-0.035em] text-strong text-balance">
            Three things, each one you&rsquo;d otherwise build yourself
          </h2>
        </div>
      </section>

      <div className="px-8 py-8">
        <div className="mx-auto w-full max-w-7xl">
          <PlatformBento />
        </div>
      </div>

      {/* One hairline band instead of three floating columns. */}
      <div className="px-8 pb-14">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-px overflow-hidden rounded-lg border border-hairline bg-subtle md:grid-cols-3">
          {NO_LIST.map((n) => (
            <div key={n.title} className="flex flex-col gap-2 bg-card p-6">
              <span className="text-[19px] font-semibold tracking-[-0.02em] text-strong">{n.title}</span>
              <span className="text-[13.5px] leading-relaxed text-muted text-pretty">{n.body}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Feature index — sticky rail, grouped pills. */}
      <section className="border-y border-subtle px-8 py-14">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-start gap-10 lg:grid-cols-[260px_1fr]">
          <div className="flex flex-col gap-3 lg:sticky lg:top-6">
            <h2 className="text-[30px] font-semibold leading-[1.1] tracking-[-0.03em] text-strong">
              Everything else that ships with it
            </h2>
            <Link href="/docs" className="text-[13.5px] font-medium">View all features</Link>
          </div>

          <div className="flex flex-col">
            {FEATURE_GROUPS.map((g, i) => (
              <div
                key={g.group}
                className={`flex flex-col gap-3 border-t border-subtle py-5 ${i === FEATURE_GROUPS.length - 1 ? "border-b" : ""}`}
              >
                <span className="sl-label text-faint">{g.group}</span>
                <div className="flex flex-wrap gap-2">
                  {g.items.map((item) => (
                    <Link
                      key={item}
                      href="/docs"
                      className="inline-flex min-h-7.5 flex-none items-center whitespace-nowrap rounded-pill border border-hairline bg-card px-3 py-1.5 text-13 text-body no-underline hover:border-stroke hover:text-strong hover:no-underline"
                    >
                      {item}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Pricing masquee — la page /pricing reste en ligne et le lien nav y mene. Retirer ce commentaire pour la reafficher.
       Pricing — self-hosting is free; Cloud is metered per participant-minute. 
      <section className="border-b border-subtle px-8 py-14">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-5.5">
          <div className="flex flex-wrap items-baseline gap-4">
            <h2 className="text-34 font-semibold tracking-[-0.03em] text-strong">Pricing</h2>
            <span className="text-14 text-muted">
              Self-hosting is free and unmetered. Cloud bills per participant-minute, with a spend cap on every plan.
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {TIERS.map((t) => (
              <Card
                key={t.name}
                className={`flex flex-col gap-3 p-5 ${t.featured ? "border-accent bg-accent-tint" : ""}`}
              >
                <span className={`sl-label ${t.featured ? "text-accent-text" : ""}`}>{t.name}</span>
                <span className="sl-num text-34 font-medium tracking-[-0.03em] text-strong">
                  {t.price}
                  {t.per ? <span className="text-16 font-normal text-muted">{t.per}</span> : null}
                </span>
                <span className="sl-num text-13 text-body">{t.quota}</span>
                <span className={`text-13 leading-relaxed ${t.featured ? "text-body" : "text-muted"}`}>{t.body}</span>
                <span className="flex-1" />
                {t.featured ? (
                  <Button variant="primary" asChild>
                    <Link href="/docs/quickstart" className="no-underline hover:no-underline">{t.cta}</Link>
                  </Button>
                ) : (
                  <Button variant="secondary" asChild>
                    <Link href="/docs/quickstart" className="no-underline hover:no-underline">{t.cta}</Link>
                  </Button>
                )}
              </Card>
            ))}
          </div>

          <span className="sl-num text-[12.5px] text-faint">
            A participant-minute = one minute of one peer in a room. Inbound is never billed. Annual billing takes 20%
            off Starter and Scale.
          </span>
        </div>
      </section>
      */}

      {/* Three doors out. */}
      <section className="px-8 py-14">
        {/* Deux colonnes tant que la carte Pricing est masquee — remettre [1fr_300px_300px] avec elle. */}
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-end gap-6 lg:grid-cols-[1fr_300px]">
          <div className="flex flex-col gap-3.5">
            <h2 className="max-w-110 text-[40px] font-semibold leading-[1.05] tracking-[-0.035em] text-strong text-balance">
              Next time video gets bad, you&rsquo;ll know why.
            </h2>
            <div className="flex flex-wrap items-center gap-3">
              <Button size="lg" variant="primary" asChild>
                <Link href="/docs/quickstart" className="no-underline hover:no-underline">Get started</Link>
              </Button>
              <Link href="/docs" className="text-[13.5px] text-muted no-underline hover:text-strong hover:no-underline">
                Read the docs
              </Link>
            </div>
          </div>

          {/* Carte Pricing masquee avec la route app/_pricing.
          <Card className="flex flex-col gap-2 p-5">
            <span className="text-[15px] font-semibold text-strong">Simple pricing</span>
            <span className="text-13 leading-relaxed text-muted">
              Pay per participant-minute, cap the spend, never get a surprise invoice.
            </span>
            <Link href="/pricing" className="text-13 font-medium">Explore pricing</Link>
          </Card>
          */}

          <Card className="flex flex-col gap-2 p-5">
            <span className="text-[15px] font-semibold text-strong">Self-host</span>
            <span className="text-13 leading-relaxed text-muted">
              MIT licensed, one binary, no metering and no account required.
            </span>
            <a href={REPO} className="text-13 font-medium">Self-hosting docs</a>
          </Card>
        </div>
      </section>
    </div>
  );
}
