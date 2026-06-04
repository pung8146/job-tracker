"use client";

import { Filter, RotateCcw } from "lucide-react";

import type { JobFilterState } from "@/types/job";

type JobFilterProps = {
  filters: JobFilterState;
  keywordOptions: string[];
  resultCount: number;
  onChange: (filters: JobFilterState) => void;
};

const resetFilters: JobFilterState = {
  keyword: "All",
  aiOnly: false,
  newOnly: false,
  favoriteOnly: false
};

export function JobFilter({ filters, keywordOptions, resultCount, onChange }: JobFilterProps) {
  const updateFilter = <Key extends keyof JobFilterState>(
    key: Key,
    value: JobFilterState[Key]
  ) => {
    onChange({
      ...filters,
      [key]: value
    });
  };

  return (
    <section className="border-y border-slate-200 bg-white" aria-label="공고 필터">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
            <Filter aria-hidden="true" size={18} />
            <span>필터</span>
            <span className="rounded bg-slate-100 px-2 py-1 text-xs text-slate-600">
              {resultCount}개 표시
            </span>
          </div>
          <button
            className="inline-flex h-9 items-center gap-2 rounded border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
            onClick={() => onChange(resetFilters)}
            type="button"
          >
            <RotateCcw aria-hidden="true" size={16} />
            초기화
          </button>
        </div>

        <div className="grid gap-3 md:grid-cols-[minmax(180px,260px)_1fr] md:items-end">
          <label className="grid gap-1 text-sm font-medium text-slate-700">
            키워드
            <select
              className="h-10 rounded border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              onChange={(event) => updateFilter("keyword", event.target.value)}
              value={filters.keyword}
            >
              {keywordOptions.map((keyword) => (
                <option key={keyword} value={keyword}>
                  {keyword === "All" ? "전체" : keyword}
                </option>
              ))}
            </select>
          </label>

          <div className="flex flex-wrap gap-4">
            <label className="flex h-10 items-center gap-2 text-sm font-medium text-slate-700">
              <input
                checked={filters.aiOnly}
                className="size-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                onChange={(event) => updateFilter("aiOnly", event.target.checked)}
                type="checkbox"
              />
              AI 관련 공고만 보기
            </label>
            <label className="flex h-10 items-center gap-2 text-sm font-medium text-slate-700">
              <input
                checked={filters.newOnly}
                className="size-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                onChange={(event) => updateFilter("newOnly", event.target.checked)}
                type="checkbox"
              />
              신규 공고만 보기
            </label>
            <label className="flex h-10 items-center gap-2 text-sm font-medium text-slate-700">
              <input
                checked={filters.favoriteOnly}
                className="size-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                onChange={(event) => updateFilter("favoriteOnly", event.target.checked)}
                type="checkbox"
              />
              관심 공고만 보기
            </label>
          </div>
        </div>
      </div>
    </section>
  );
}
