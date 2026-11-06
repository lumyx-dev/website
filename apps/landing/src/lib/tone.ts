import type { Tone } from "./home-data";

/** Status tone → design-system utilities. One place, so dots, text and pills agree. */
export const DOT: Record<Tone, string> = {
  ok: "bg-ok-solid",
  warn: "bg-warn-solid",
  bad: "bg-danger-solid",
  accent: "bg-accent",
  idle: "bg-stroke",
};

export const INK: Record<Tone, string> = {
  ok: "text-ok",
  warn: "text-warn",
  bad: "text-danger",
  accent: "text-accent-text",
  idle: "text-faint",
};

export const STROKE: Record<Tone, string> = {
  ok: "stroke-ok-solid",
  warn: "stroke-warn-solid",
  bad: "stroke-danger-solid",
  accent: "stroke-accent",
  idle: "stroke-stroke",
};

export const FILL: Record<Tone, string> = {
  ok: "fill-ok-solid",
  warn: "fill-warn-solid",
  bad: "fill-danger-solid",
  accent: "fill-accent",
  idle: "fill-stroke",
};
