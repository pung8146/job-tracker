import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { afterEach, describe, expect, it } from "vitest";

import { loadCollectedJobsFromFile } from "./collectedJobs";
import type { JobPosting } from "../types/job";

const validJob: JobPosting = {
  id: "saramin-1",
  source: "Saramin",
  sourceJobId: "1",
  url: "https://example.com/jobs/1",
  title: "Frontend Engineer",
  company: "Acme",
  location: "Seoul",
  experience: "3+ years",
  employmentType: "Full-time",
  deadline: "2026-06-07",
  keywords: ["Frontend"],
  techStacks: ["React"],
  isAiRelated: false,
  isNew: true,
  collectedAt: "2026-06-04"
};

let tempDirectory: string | undefined;

afterEach(() => {
  if (tempDirectory) {
    rmSync(tempDirectory, { recursive: true, force: true });
  }
});

function createTempFile(contents: string): string {
  tempDirectory = mkdtempSync(join(tmpdir(), "job-tracker-"));
  const filePath = join(tempDirectory, "latest.json");
  writeFileSync(filePath, contents, "utf8");
  return filePath;
}

describe("loadCollectedJobsFromFile", () => {
  it("loads valid collected jobs", () => {
    const filePath = createTempFile(JSON.stringify([validJob]));

    expect(loadCollectedJobsFromFile(filePath)).toEqual({
      ok: true,
      jobs: [validJob],
      reason: undefined
    });
  });

  it("returns a fallback reason when the file is missing", () => {
    expect(loadCollectedJobsFromFile("missing-latest.json")).toEqual({
      ok: false,
      jobs: [],
      reason: "수집 파일이 없습니다."
    });
  });

  it("rejects malformed collected job data", () => {
    const filePath = createTempFile(JSON.stringify([{ ...validJob, title: 123 }]));

    expect(loadCollectedJobsFromFile(filePath)).toEqual({
      ok: false,
      jobs: [],
      reason: "수집 파일 형식이 올바르지 않습니다."
    });
  });
});
