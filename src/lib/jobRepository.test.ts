import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import Database from "better-sqlite3";
import { afterEach, describe, expect, it } from "vitest";

import type { CollectionSummary } from "./collection";
import { initializeDatabase } from "./db";
import { saveCollectionRun, upsertJobs } from "./jobRepository";
import type { JobPosting } from "../types/job";

let tempDirectory: string | undefined;

afterEach(() => {
  if (tempDirectory) {
    rmSync(tempDirectory, { recursive: true, force: true });
  }
});

function createTempDbPath(): string {
  tempDirectory = mkdtempSync(join(tmpdir(), "job-tracker-repo-"));
  return join(tempDirectory, "job-tracker.db");
}

const job: JobPosting = {
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
  keywords: ["Frontend", "React"],
  techStacks: ["React", "TypeScript"],
  isAiRelated: false,
  isNew: true,
  collectedAt: "2026-06-04",
  firstSeenAt: "2026-06-04",
  lastSeenAt: "2026-06-04",
  status: "open"
};

describe("jobRepository", () => {
  it("upserts JobPosting rows into SQLite", () => {
    const dbPath = createTempDbPath();
    initializeDatabase(dbPath);

    upsertJobs([job], dbPath);

    const db = new Database(dbPath, { readonly: true });
    const saved = db.prepare("SELECT * FROM jobs WHERE id = ?").get(job.id) as Record<string, unknown>;
    db.close();

    expect(saved.title).toBe("Frontend Engineer");
    expect(saved.source_job_id).toBe("1");
    expect(saved.keywords_json).toBe(JSON.stringify(["Frontend", "React"]));
    expect(saved.tech_stacks_json).toBe(JSON.stringify(["React", "TypeScript"]));
    expect(saved.is_ai_related).toBe(0);
    expect(saved.is_new).toBe(1);
  });

  it("updates existing jobs without changing first_seen_at", () => {
    const dbPath = createTempDbPath();
    initializeDatabase(dbPath);

    upsertJobs([job], dbPath);
    upsertJobs(
      [
        {
          ...job,
          title: "Frontend Engineer Updated",
          isNew: false,
          collectedAt: "2026-06-05",
          firstSeenAt: "2026-06-05",
          lastSeenAt: "2026-06-05"
        }
      ],
      dbPath
    );

    const db = new Database(dbPath, { readonly: true });
    const saved = db.prepare("SELECT title, is_new, first_seen_at, last_seen_at FROM jobs WHERE id = ?").get(job.id) as {
      title: string;
      is_new: number;
      first_seen_at: string;
      last_seen_at: string;
    };
    db.close();

    expect(saved).toEqual({
      title: "Frontend Engineer Updated",
      is_new: 0,
      first_seen_at: "2026-06-04",
      last_seen_at: "2026-06-05"
    });
  });

  it("saves collection run summaries", () => {
    const dbPath = createTempDbPath();
    const summary: CollectionSummary = {
      total: 3,
      newJobs: 2,
      aiRelated: 1,
      closingSoon: 1,
      collectedAt: "2026-06-04"
    };
    initializeDatabase(dbPath);

    saveCollectionRun(
      {
        source: "Saramin",
        keyword: "AI",
        summary,
        status: "success"
      },
      dbPath
    );

    const db = new Database(dbPath, { readonly: true });
    const saved = db.prepare("SELECT * FROM collection_runs").get() as Record<string, unknown>;
    db.close();

    expect(saved.source).toBe("Saramin");
    expect(saved.keyword).toBe("AI");
    expect(saved.total_jobs).toBe(3);
    expect(saved.new_jobs).toBe(2);
    expect(saved.ai_related).toBe(1);
    expect(saved.closing_soon).toBe(1);
    expect(saved.status).toBe("success");
  });
});
