import { Bookmark, CalendarDays, MapPin } from "lucide-react";

import { toggleFavoriteJobAction } from "@/app/actions";
import { TechStackBadge } from "@/components/TechStackBadge";
import type { JobPosting } from "@/types/job";

type JobCardProps = {
  job: JobPosting;
  isFavorite: boolean;
};

export function JobCard({ job, isFavorite }: JobCardProps) {
  return (
    <article className="rounded border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">
              {job.source}
            </span>
            {job.isNew ? (
              <span className="rounded bg-sky-100 px-2 py-1 text-xs font-semibold text-sky-700">
                신규
              </span>
            ) : null}
            {job.isAiRelated ? (
              <span className="rounded bg-violet-100 px-2 py-1 text-xs font-semibold text-violet-700">
                AI 관련
              </span>
            ) : null}
            {isFavorite ? (
              <span className="rounded bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-700">
                관심
              </span>
            ) : null}
          </div>

          <h2 className="mt-3 text-lg font-semibold leading-snug text-slate-950">{job.title}</h2>
          <p className="mt-1 text-sm font-medium text-slate-600">{job.company}</p>
        </div>

        <form action={toggleFavoriteJobAction}>
          <input name="jobId" type="hidden" value={job.id} />
          <button
            className={`inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded border px-3 text-sm font-semibold ${
              isFavorite
                ? "border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100"
                : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
            }`}
            type="submit"
          >
            <Bookmark aria-hidden="true" fill={isFavorite ? "currentColor" : "none"} size={17} />
            {isFavorite ? "관심 해제" : "관심 등록"}
          </button>
        </form>
      </div>

      <dl className="mt-4 grid gap-3 text-sm text-slate-700 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex items-center gap-2">
          <MapPin aria-hidden="true" className="text-slate-400" size={16} />
          <div>
            <dt className="sr-only">지역</dt>
            <dd>{job.location}</dd>
          </div>
        </div>
        <div>
          <dt className="text-xs font-semibold text-slate-500">경력</dt>
          <dd className="mt-1">{job.experience}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold text-slate-500">고용형태</dt>
          <dd className="mt-1">{job.employmentType}</dd>
        </div>
        <div className="flex items-center gap-2">
          <CalendarDays aria-hidden="true" className="text-slate-400" size={16} />
          <div>
            <dt className="text-xs font-semibold text-slate-500">마감일</dt>
            <dd className="mt-1">{job.deadline}</dd>
          </div>
        </div>
      </dl>

      <div className="mt-4 flex flex-wrap gap-2">
        {job.keywords.map((keyword) => (
          <span
            className="rounded bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700"
            key={keyword}
          >
            {keyword}
          </span>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {job.techStacks.map((techStack) => (
          <TechStackBadge key={techStack} label={techStack} />
        ))}
      </div>
    </article>
  );
}
