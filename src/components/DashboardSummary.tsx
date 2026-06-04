import { BriefcaseBusiness, Clock3, Sparkles, Sun } from "lucide-react";

import type { DashboardSummaryStats } from "@/types/job";

type DashboardSummaryProps = {
  stats: DashboardSummaryStats;
};

const summaryItems = [
  {
    key: "total",
    label: "전체 공고 수",
    icon: BriefcaseBusiness,
    tone: "text-slate-700 bg-slate-100"
  },
  {
    key: "newToday",
    label: "오늘 신규 공고 수",
    icon: Sun,
    tone: "text-sky-700 bg-sky-100"
  },
  {
    key: "aiRelated",
    label: "AI 관련 공고 수",
    icon: Sparkles,
    tone: "text-violet-700 bg-violet-100"
  },
  {
    key: "closingSoon",
    label: "마감 임박 공고 수",
    icon: Clock3,
    tone: "text-rose-700 bg-rose-100"
  }
] as const;

export function DashboardSummary({ stats }: DashboardSummaryProps) {
  return (
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label="공고 요약">
      {summaryItems.map((item) => {
        const Icon = item.icon;

        return (
          <article
            className="min-h-28 rounded border border-slate-200 bg-white p-4 shadow-sm"
            key={item.key}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-slate-500">{item.label}</p>
                <p className="mt-3 text-3xl font-semibold text-slate-950">
                  {stats[item.key].toLocaleString()}
                </p>
              </div>
              <span className={`flex size-10 items-center justify-center rounded ${item.tone}`}>
                <Icon aria-hidden="true" size={20} />
              </span>
            </div>
          </article>
        );
      })}
    </section>
  );
}
