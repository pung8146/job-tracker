import Database from "better-sqlite3";

import type { CollectionSummary } from "./collection";
import { DEFAULT_DATABASE_PATH, initializeDatabase } from "./db";
import type { JobPosting, JobSource } from "../types/job";

export type SaveCollectionRunInput = {
  source: JobSource;
  keyword?: string;
  summary: CollectionSummary;
  status: "success" | "failed";
  errorMessage?: string;
};

function booleanToInteger(value: boolean): number {
  return value ? 1 : 0;
}

export function upsertJobs(jobs: JobPosting[], dbPath = DEFAULT_DATABASE_PATH): void {
  initializeDatabase(dbPath);

  const db = new Database(dbPath);
  const statement = db.prepare(`
    INSERT INTO jobs (
      id,
      source,
      source_job_id,
      url,
      title,
      company,
      location,
      experience,
      employment_type,
      deadline,
      keywords_json,
      tech_stacks_json,
      is_ai_related,
      is_new,
      collected_at,
      first_seen_at,
      last_seen_at,
      status
    ) VALUES (
      @id,
      @source,
      @sourceJobId,
      @url,
      @title,
      @company,
      @location,
      @experience,
      @employmentType,
      @deadline,
      @keywordsJson,
      @techStacksJson,
      @isAiRelated,
      @isNew,
      @collectedAt,
      @firstSeenAt,
      @lastSeenAt,
      @status
    )
    ON CONFLICT(id) DO UPDATE SET
      source = excluded.source,
      source_job_id = excluded.source_job_id,
      url = excluded.url,
      title = excluded.title,
      company = excluded.company,
      location = excluded.location,
      experience = excluded.experience,
      employment_type = excluded.employment_type,
      deadline = excluded.deadline,
      keywords_json = excluded.keywords_json,
      tech_stacks_json = excluded.tech_stacks_json,
      is_ai_related = excluded.is_ai_related,
      is_new = excluded.is_new,
      collected_at = excluded.collected_at,
      first_seen_at = COALESCE(jobs.first_seen_at, excluded.first_seen_at),
      last_seen_at = excluded.last_seen_at,
      status = excluded.status,
      updated_at = CURRENT_TIMESTAMP
  `);
  const insertMany = db.transaction((items: JobPosting[]) => {
    for (const job of items) {
      statement.run({
        id: job.id,
        source: job.source,
        sourceJobId: job.sourceJobId ?? null,
        url: job.url ?? null,
        title: job.title,
        company: job.company,
        location: job.location,
        experience: job.experience,
        employmentType: job.employmentType,
        deadline: job.deadline,
        keywordsJson: JSON.stringify(job.keywords),
        techStacksJson: JSON.stringify(job.techStacks),
        isAiRelated: booleanToInteger(job.isAiRelated),
        isNew: booleanToInteger(job.isNew),
        collectedAt: job.collectedAt,
        firstSeenAt: job.firstSeenAt ?? job.collectedAt,
        lastSeenAt: job.lastSeenAt ?? job.collectedAt,
        status: job.status ?? "unknown"
      });
    }
  });

  insertMany(jobs);
  db.close();
}

export function saveCollectionRun(input: SaveCollectionRunInput, dbPath = DEFAULT_DATABASE_PATH): void {
  initializeDatabase(dbPath);

  const db = new Database(dbPath);
  db.prepare(
    `
      INSERT INTO collection_runs (
        source,
        keyword,
        collected_at,
        total_jobs,
        new_jobs,
        ai_related,
        closing_soon,
        status,
        error_message
      ) VALUES (
        @source,
        @keyword,
        @collectedAt,
        @totalJobs,
        @newJobs,
        @aiRelated,
        @closingSoon,
        @status,
        @errorMessage
      )
    `
  ).run({
    source: input.source,
    keyword: input.keyword ?? null,
    collectedAt: input.summary.collectedAt,
    totalJobs: input.summary.total,
    newJobs: input.summary.newJobs,
    aiRelated: input.summary.aiRelated,
    closingSoon: input.summary.closingSoon,
    status: input.status,
    errorMessage: input.errorMessage ?? null
  });
  db.close();
}
