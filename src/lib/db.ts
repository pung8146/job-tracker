import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";

import Database from "better-sqlite3";

export const DEFAULT_DATABASE_PATH = resolve(process.cwd(), "data", "job-tracker.db");

export function initializeDatabase(dbPath = DEFAULT_DATABASE_PATH): void {
  mkdirSync(dirname(dbPath), { recursive: true });

  const db = new Database(dbPath);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");

  db.exec(`
    CREATE TABLE IF NOT EXISTS jobs (
      id TEXT PRIMARY KEY,
      source TEXT NOT NULL,
      source_job_id TEXT,
      url TEXT,
      title TEXT NOT NULL,
      company TEXT NOT NULL,
      location TEXT NOT NULL,
      experience TEXT NOT NULL,
      employment_type TEXT NOT NULL,
      deadline TEXT NOT NULL,
      keywords_json TEXT NOT NULL,
      tech_stacks_json TEXT NOT NULL,
      is_ai_related INTEGER NOT NULL DEFAULT 0,
      is_new INTEGER NOT NULL DEFAULT 0,
      collected_at TEXT NOT NULL,
      first_seen_at TEXT,
      last_seen_at TEXT,
      status TEXT NOT NULL DEFAULT 'unknown',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE UNIQUE INDEX IF NOT EXISTS idx_jobs_source_source_job_id
      ON jobs(source, source_job_id)
      WHERE source_job_id IS NOT NULL;

    CREATE INDEX IF NOT EXISTS idx_jobs_deadline ON jobs(deadline);
    CREATE INDEX IF NOT EXISTS idx_jobs_is_ai_related ON jobs(is_ai_related);
    CREATE INDEX IF NOT EXISTS idx_jobs_collected_at ON jobs(collected_at);

    CREATE TABLE IF NOT EXISTS collection_runs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      source TEXT NOT NULL,
      keyword TEXT,
      collected_at TEXT NOT NULL,
      total_jobs INTEGER NOT NULL DEFAULT 0,
      new_jobs INTEGER NOT NULL DEFAULT 0,
      ai_related INTEGER NOT NULL DEFAULT 0,
      closing_soon INTEGER NOT NULL DEFAULT 0,
      status TEXT NOT NULL,
      error_message TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS favorite_jobs (
      job_id TEXT PRIMARY KEY,
      memo TEXT,
      application_status TEXT NOT NULL DEFAULT 'saved',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE
    );
  `);

  db.close();
}
