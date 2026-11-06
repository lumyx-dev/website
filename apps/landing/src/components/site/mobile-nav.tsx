import * as React from "react";
import { createPortal } from "react-dom";
import { cx } from "@/lib/cx";

const noop = () => () => {};

const EASE = "transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]";

/** Burger and full-screen link overlay, shown below 960px. */
export function MobileNav({
  links,
}: {
  links: { href: string; label: string }[];
}) {
  const [open, setOpen] = React.useState(false);
  // false on the server and during hydration, true once mounted: the portal needs document.body.
  const mounted = React.useSyncExternalStore(noop, () => true, () => false);

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="min-[960px]:hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls="mobile-menu"
        className="relative block size-10 cursor-pointer rounded-sm border border-stroke bg-card"
      >
        <span
          className={cx(
            "absolute left-[11px] h-0.5 w-4 rounded-[2px] bg-strong",
            EASE,
            open ? "top-[18px] rotate-45" : "top-[14px]",
          )}
        />
        <span
          className={cx(
            "absolute left-[11px] h-0.5 w-4 rounded-[2px] bg-strong",
            EASE,
            open ? "top-[18px] -rotate-45" : "top-[22px]",
          )}
        />
      </button>
      {mounted &&
        createPortal(
          <div
            id="mobile-menu"
            inert={!open}
            className={cx(
              "fixed inset-x-0 bottom-0 top-16 z-[45] min-[960px]:hidden flex flex-col gap-6 bg-page/80 px-6 py-12 backdrop-blur-[64px]",
              EASE,
              open ? "opacity-100" : "pointer-events-none opacity-0",
            )}
          >
            {links.map((l, i) => (
              <div key={l.href} className="overflow-hidden">
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  style={{ transitionDelay: `${100 + i * 50}ms` }}
                  className={cx(
                    "block text-[36px] font-semibold leading-10 tracking-[-0.03em] text-strong no-underline hover:text-strong hover:no-underline",
                    EASE,
                    open
                      ? "translate-y-0 opacity-100"
                      : "translate-y-12 opacity-0",
                  )}
                >
                  {l.label}
                </a>
              </div>
            ))}
          </div>,
          document.body,
        )}
    </div>
  );
}
