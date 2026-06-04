import { mockJobs } from "../data/mockJobs";
import { DEFAULT_DATABASE_PATH } from "./db";
import { upsertJobs } from "./jobRepository";

export type SeedMockJobsResult = {
  inserted: number;
  dbPath: string;
};

export function seedMockJobs(dbPath = DEFAULT_DATABASE_PATH): SeedMockJobsResult {
  upsertJobs(mockJobs, dbPath);

  return {
    inserted: mockJobs.length,
    dbPath
  };
}
