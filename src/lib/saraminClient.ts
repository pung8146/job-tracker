import type { SaraminJob, SaraminJobSearchResponse } from "@/types/saramin";

const SARIMIN_JOB_SEARCH_URL = "https://oapi.saramin.co.kr/job-search";

export type SearchSaraminJobsParams = {
  accessKey: string;
  keywords: string;
  count?: number;
  start?: number;
};

function normalizeJobList(response: SaraminJobSearchResponse): SaraminJob[] {
  const job = response["job-search"]?.jobs?.job;

  if (!job) {
    return [];
  }

  return Array.isArray(job) ? job : [job];
}

export async function searchSaraminJobs({
  accessKey,
  keywords,
  count = 10,
  start = 0
}: SearchSaraminJobsParams): Promise<SaraminJob[]> {
  const searchParams = new URLSearchParams({
    "access-key": accessKey,
    keywords,
    count: String(count),
    start: String(start),
    fields: "posting-date,expiration-date,keyword-code,count"
  });

  const response = await fetch(`${SARIMIN_JOB_SEARCH_URL}?${searchParams.toString()}`, {
    headers: {
      Accept: "application/json"
    }
  });

  if (!response.ok) {
    throw new Error(`사람인 API 요청 실패: HTTP ${response.status}`);
  }

  const data = (await response.json()) as SaraminJobSearchResponse;
  return normalizeJobList(data);
}
