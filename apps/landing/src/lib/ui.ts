/**
 * Shared class strings for the home page (design "Lumyx Home v3"), used by the Astro page and
 * its islands alike. Plain strings, no @lumyx/ui import, so islands can use them too (see cx.ts).
 */
const EASE = "transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]";

const BTN_BASE = `inline-flex items-center gap-2 whitespace-nowrap rounded-sm border font-semibold no-underline hover:no-underline hover:-translate-y-0.5 active:scale-[0.98] ${EASE}`;

export const BTN_DARK = `${BTN_BASE} border-transparent bg-strong text-page hover:bg-body hover:text-page`;
export const BTN_LIGHT = `${BTN_BASE} border-stroke bg-card text-strong hover:border-faint hover:text-strong`;
export const BTN_MD = "px-3 py-2 text-16 leading-6";
export const BTN_SM = "rounded-xs px-3 py-1 text-14 leading-5";

/** Black-to-grey ink, the v3 headline treatment. Follows the theme through the tokens. */
export const GRAD = "bg-linear-to-r from-strong to-muted bg-clip-text text-transparent";

export const H2 = `m-0 text-[30px] leading-none tracking-[-0.04em] text-balance min-[640px]:text-[48px] ${GRAD}`;

export const LINK = "text-muted no-underline transition-colors duration-500 hover:text-strong hover:no-underline";

export const SECTION = "mx-auto w-full max-w-[1200px]";
export const PAD = "px-4 py-16 min-[640px]:px-6 min-[640px]:py-24";
