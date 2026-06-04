import { describe, expect, it } from "vitest";

import { buildSaraminRawFileName, sanitizeFileNamePart } from "./rawFiles";

describe("raw file helpers", () => {
  it("sanitizes keyword values for file names", () => {
    expect(sanitizeFileNamePart("AI/LLM 프론트엔드")).toBe("AI-LLM-프론트엔드");
  });

  it("builds a dated Saramin raw response file name", () => {
    expect(buildSaraminRawFileName("2026-06-04", "AI/LLM")).toBe("saramin-2026-06-04-AI-LLM.json");
  });
});
