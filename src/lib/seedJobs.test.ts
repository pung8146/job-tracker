import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { afterEach, describe, expect, it } from "vitest";

import { mockJobs } from "../data/mockJobs";
import { getJobsFromDatabase } from "./jobRepository";
import { seedMockJobs } from "./seedJobs";

let tempDirectory: string | undefined;

afterEach(() => {
  if (tempDirectory) {
    rmSync(tempDirectory, { recursive: true, force: true });
  }
});

function createTempDbPath(): string {
  tempDirectory = mkdtempSync(join(tmpdir(), "job-tracker-seed-"));
  return join(tempDirectory, "job-tracker.db");
}

describe("seedMockJobs", () => {
  it("stores mock jobs in SQLite", () => {
    const dbPath = createTempDbPath();

    const result = seedMockJobs(dbPath);

    expect(result).toEqual({
      inserted: mockJobs.length,
      dbPath
    });
    expect(getJobsFromDatabase(dbPath)).toHaveLength(mockJobs.length);
  });

  it("can run repeatedly without duplicating jobs", () => {
    const dbPath = createTempDbPath();

    seedMockJobs(dbPath);
    seedMockJobs(dbPath);

    expect(getJobsFromDatabase(dbPath)).toHaveLength(mockJobs.length);
  });
});
