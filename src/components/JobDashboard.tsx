"use client";

import { useMemo, useState } from "react";

import { DashboardSummary } from "@/components/DashboardSummary";
import { JobCard } from "@/components/JobCard";
import { JobFilter } from "@/components/JobFilter";
import { filterJobs, getDashboardSummary, getKeywordOptions, MOCK_TODAY } from "@/lib/jobs";
import type { JobFilterState, JobPosting } from "@/types/job";

const initialFilters: JobFilterState = {
  keyword: "All",
  aiOnly: false,
  newOnly: false,
  favoriteOnly: false
};

type JobDashboardProps = {
  jobs: JobPosting[];
  dataSourceLabel: string;
  favoriteJobIds: string[];
};

export function JobDashboard({ jobs, dataSourceLabel, favoriteJobIds }: JobDashboardProps) {
  const [filters, setFilters] = useState<JobFilterState>(initialFilters);
  const favoriteJobIdSet = useMemo(() => new Set(favoriteJobIds), [favoriteJobIds]);

  const summary = useMemo(() => getDashboardSummary(jobs, MOCK_TODAY), [jobs]);
  const keywordOptions = useMemo(() => getKeywordOptions(jobs), [jobs]);
  const filteredJobs = useMemo(() => {
    const baseJobs = filterJobs(jobs, filters);
    return filters.favoriteOnly ? baseJobs.filter((job) => favoriteJobIdSet.has(job.id)) : baseJobs;
  }, [favoriteJobIdSet, filters, jobs]);

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-6 flex flex-col gap-2">
          <p className="text-sm font-semibold text-sky-700">Job Tracker</p>
          <h1 className="text-2xl font-semibold tracking-normal text-slate-950 sm:text-3xl">
            개발자 채용공고 대시보드
          </h1>
          <p className="max-w-3xl text-sm leading-6 text-slate-600">
            {dataSourceLabel}로 신규 공고, AI 관련 공고, 기술스택, 마감 임박 공고를 한 화면에서
            확인합니다.
          </p>
        </header>

        <DashboardSummary stats={summary} />
      </div>

      <JobFilter
        filters={filters}
        keywordOptions={keywordOptions}
        onChange={setFilters}
        resultCount={filteredJobs.length}
      />

      <section className="mx-auto grid max-w-6xl gap-4 px-4 py-6 sm:px-6 lg:px-8" aria-label="공고 목록">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => (
            <JobCard isFavorite={favoriteJobIdSet.has(job.id)} job={job} key={job.id} />
          ))
        ) : (
          <div className="rounded border border-dashed border-slate-300 bg-white px-4 py-10 text-center text-sm text-slate-600">
            조건에 맞는 공고가 없습니다.
          </div>
        )}
      </section>
    </main>
  );
}
