import { existsSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import Database from "better-sqlite3";
import { afterEach, describe, expect, it } from "vitest";

import { initializeDatabase } from "./db";

let tempDirectory: string | undefined;

afterEach(() => {
  if (tempDirectory) {
    rmSync(tempDirectory, { recursive: true, force: true });
  }
});

function createTempDbPath(): string {
  tempDirectory = mkdtempSync(join(tmpdir(), "job-tracker-db-"));
  return join(tempDirectory, "job-tracker.db");
}

describe("initializeDatabase", () => {
  it("creates the SQLite database file and required tables", () => {
    const dbPath = createTempDbPath();

    initializeDatabase(dbPath);

    const db = new Database(dbPath, { readonly: true });
    const tableNames = db
      .prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%' ORDER BY name")
      .all()
      .map((row) => (row as { name: string }).name);
    db.close();

    expect(existsSync(dbPath)).toBe(true);
    expect(tableNames).toEqual(["collection_runs", "favorite_jobs", "jobs"]);
  });

  it("can run repeatedly without dropping existing data", () => {
    const dbPath = createTempDbPath();

    initializeDatabase(dbPath);
    const db = new Database(dbPath);
    db.prepare(
      `INSERT INTO jobs (
        id, source, source_job_id, title, company, location, experience,
        employment_type, deadline, keywords_json, tech_stacks_json,
        is_ai_related, is_new, collected_at, status
      ) VALUES (
        'saramin-1', 'Saramin', '1', 'Frontend Engineer', 'Acme', 'Seoul',
        '3+ years', 'Full-time', '2026-06-07', '[]', '[]', 0, 1,
        '2026-06-04', 'open'
      )`
    ).run();
    db.close();

    initializeDatabase(dbPath);

    const verifyDb = new Database(dbPath, { readonly: true });
    const count = verifyDb.prepare("SELECT COUNT(*) AS count FROM jobs").get() as { count: number };
    verifyDb.close();

    expect(count.count).toBe(1);
  });
});
