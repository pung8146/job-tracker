import type { SaraminJob, SaraminJobSearchResponse } from "@/types/saramin";

const SARIMIN_JOB_SEARCH_URL = "https://oapi.saramin.co.kr/job-search";

export type SearchSaraminJobsParams = {
  accessKey: string;
  keywords: string;
  count?: number;
  start?: number;
};

function buildSaraminSearchUrl({ accessKey, keywords, count = 10, start = 0 }: SearchSaraminJobsParams): string {
  const searchParams = new URLSearchParams({
    "access-key": accessKey,
    keywords,
    count: String(count),
    start: String(start),
    fields: "posting-date,expiration-date,keyword-code,count"
  });

  return `${SARIMIN_JOB_SEARCH_URL}?${searchParams.toString()}`;
}

function normalizeJobList(response: SaraminJobSearchResponse): SaraminJob[] {
  const job = response["job-search"]?.jobs?.job;

  if (!job) {
    return [];
  }

  return Array.isArray(job) ? job : [job];
}

export async function searchSaraminJobs(params: SearchSaraminJobsParams): Promise<SaraminJob[]> {
  const data = (await searchSaraminJobsRaw(params)) as SaraminJobSearchResponse;
  return normalizeJobList(data);
}

export async function searchSaraminJobsRaw(params: SearchSaraminJobsParams): Promise<unknown> {
  const response = await fetch(buildSaraminSearchUrl(params), {
    headers: {
      Accept: "application/json"
    }
  });

  if (!response.ok) {
    throw new Error(`Saramin API request failed: HTTP ${response.status}`);
  }

  return response.json();
}
