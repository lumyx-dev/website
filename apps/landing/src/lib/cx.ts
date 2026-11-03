/**
 * Class-name join for React islands. Islands must not import from the `@lumyx/ui` barrel: it
 * re-exports a next/link wrapper whose Next.js internals read `process.env` and throw in the
 * browser, which aborts hydration. No merging needed here: the islands never pass conflicting
 * utilities.
 */
export function cx(...parts: (string | false | null | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}
