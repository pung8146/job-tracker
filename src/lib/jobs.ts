import type { DashboardSummaryStats, JobFilterState, JobPosting } from "@/types/job";

const CLOSING_SOON_DAYS = 7;

export const MOCK_TODAY = "2026-06-04";

function parseDateOnly(value: string): number {
  const [year, month, day] = value.split("-").map(Number);
  return Date.UTC(year, month - 1, day);
}

export function isClosingSoon(job: JobPosting, today = MOCK_TODAY): boolean {
  const daysLeft = (parseDateOnly(job.deadline) - parseDateOnly(today)) / 86_400_000;
  return daysLeft >= 0 && daysLeft <= CLOSING_SOON_DAYS;
}

export function isNewToday(job: JobPosting, today = MOCK_TODAY): boolean {
  return job.isNew && job.collectedAt === today;
}

export function getDashboardSummary(
  jobs: JobPosting[],
  today = MOCK_TODAY
): DashboardSummaryStats {
  return {
    total: jobs.length,
    newToday: jobs.filter((job) => isNewToday(job, today)).length,
    aiRelated: jobs.filter((job) => job.isAiRelated).length,
    closingSoon: jobs.filter((job) => isClosingSoon(job, today)).length
  };
}

export function getKeywordOptions(jobs: JobPosting[]): string[] {
  const keywords = new Set(jobs.flatMap((job) => job.keywords));
  return ["All", ...Array.from(keywords).sort((a, b) => a.localeCompare(b))];
}

export function filterJobs(jobs: JobPosting[], filters: JobFilterState): JobPosting[] {
  return jobs.filter((job) => {
    const matchesKeyword =
      filters.keyword === "All" ||
      job.keywords.includes(filters.keyword) ||
      job.techStacks.includes(filters.keyword);
    const matchesAi = !filters.aiOnly || job.isAiRelated;
    const matchesNew = !filters.newOnly || job.isNew;

    return matchesKeyword && matchesAi && matchesNew;
  });
}
