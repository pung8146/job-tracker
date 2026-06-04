import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

import type { EmploymentType, JobPosting, JobSource } from "../types/job";

export type LoadCollectedJobsResult = {
  ok: boolean;
  jobs: JobPosting[];
  reason?: string;
};

const JOB_SOURCES: JobSource[] = ["Saramin", "Wanted", "Programmers", "JobKorea", "LinkedIn"];
const EMPLOYMENT_TYPES: EmploymentType[] = ["Full-time", "Contract", "Internship", "Freelance"];

export const DEFAULT_COLLECTED_JOBS_PATH = resolve(
  process.cwd(),
  "data",
  "collected",
  "latest.json"
);

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function isJobPosting(value: unknown): value is JobPosting {
  if (!value || typeof value !== "object") {
    return false;
  }

  const job = value as Record<string, unknown>;

  return (
    typeof job.id === "string" &&
    typeof job.title === "string" &&
    typeof job.company === "string" &&
    typeof job.source === "string" &&
    JOB_SOURCES.includes(job.source as JobSource) &&
    typeof job.location === "string" &&
    typeof job.experience === "string" &&
    typeof job.employmentType === "string" &&
    EMPLOYMENT_TYPES.includes(job.employmentType as EmploymentType) &&
    typeof job.deadline === "string" &&
    isStringArray(job.keywords) &&
    isStringArray(job.techStacks) &&
    typeof job.isAiRelated === "boolean" &&
    typeof job.isNew === "boolean" &&
    typeof job.collectedAt === "string"
  );
}

export function loadCollectedJobsFromFile(
  filePath = DEFAULT_COLLECTED_JOBS_PATH
): LoadCollectedJobsResult {
  if (!existsSync(filePath)) {
    return {
      ok: false,
      jobs: [],
      reason: "수집 파일이 없습니다."
    };
  }

  try {
    const parsed = JSON.parse(readFileSync(filePath, "utf8")) as unknown;

    if (!Array.isArray(parsed) || !parsed.every(isJobPosting)) {
      return {
        ok: false,
        jobs: [],
        reason: "수집 파일 형식이 올바르지 않습니다."
      };
    }

    return {
      ok: true,
      jobs: parsed,
      reason: undefined
    };
  } catch {
    return {
      ok: false,
      jobs: [],
      reason: "수집 파일을 읽을 수 없습니다."
    };
  }
}
