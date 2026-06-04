import type { JobPosting } from "../types/job";
import { isClosingSoon } from "./jobs";

export type CollectionSummary = {
  total: number;
  newJobs: number;
  aiRelated: number;
  closingSoon: number;
  collectedAt: string;
};

function normalizeFingerprintValue(value: string): string {
  return value.trim().replace(/\s+/g, " ").toLowerCase();
}

function getJobDeduplicationKey(job: JobPosting): string {
  if (job.sourceJobId) {
    return `${job.source}:${job.sourceJobId}`;
  }

  return [
    job.source,
    normalizeFingerprintValue(job.company),
    normalizeFingerprintValue(job.title),
    normalizeFingerprintValue(job.deadline),
    normalizeFingerprintValue(job.location)
  ].join(":");
}

export function dedupeJobs(jobs: JobPosting[]): JobPosting[] {
  const seen = new Set<string>();

  return jobs.filter((job) => {
    const key = getJobDeduplicationKey(job);

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

export function summarizeCollection(jobs: JobPosting[], collectedAt: string): CollectionSummary {
  return {
    total: jobs.length,
    newJobs: jobs.filter((job) => job.isNew).length,
    aiRelated: jobs.filter((job) => job.isAiRelated).length,
    closingSoon: jobs.filter((job) => isClosingSoon(job, collectedAt)).length,
    collectedAt
  };
}
