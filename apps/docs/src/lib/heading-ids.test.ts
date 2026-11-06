import { describe, expect, test } from "bun:test";
import { splitPinnedId } from "./heading-ids";

describe("splitPinnedId", () => {
  test("separe le titre et l'ancre", () => {
    expect(splitPinnedId("Jitter [#jitter_ms]")).toEqual({ text: "Jitter", id: "jitter_ms" });
  });

  test("ignore un titre ordinaire", () => {
    expect(splitPinnedId("At a glance")).toBeNull();
    expect(splitPinnedId("Arrays [like this] in a title")).toBeNull();
  });
});
