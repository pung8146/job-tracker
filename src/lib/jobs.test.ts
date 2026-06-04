import { describe, expect, it } from "vitest";

import { filterJobs, getDashboardSummary } from "./jobs";
import type { JobPosting } from "@/types/job";

const jobs: JobPosting[] = [
  {
    id: "job-1",
    title: "AI Platform Frontend Engineer",
    company: "Nova Labs",
    source: "Saramin",
    location: "Seoul",
    experience: "3+ years",
    employmentType: "Full-time",
    deadline: "2026-06-07",
    keywords: ["AI", "Frontend"],
    techStacks: ["TypeScript", "React"],
    isAiRelated: true,
    isNew: true,
    collectedAt: "2026-06-04"
  },
  {
    id: "job-2",
    title: "Backend Engineer",
    company: "Flowbit",
    source: "Wanted",
    location: "Remote",
    experience: "Junior",
    employmentType: "Full-time",
    deadline: "2026-06-20",
    keywords: ["Backend"],
    techStacks: ["Node.js", "PostgreSQL"],
    isAiRelated: false,
    isNew: false,
    collectedAt: "2026-06-03"
  }
];

describe("job dashboard helpers", () => {
  it("counts total, new, ai, and urgent jobs", () => {
    expect(getDashboardSummary(jobs, "2026-06-04")).toEqual({
      total: 2,
      newToday: 1,
      aiRelated: 1,
      closingSoon: 1
    });
  });

  it("filters jobs by keyword, ai flag, and new flag", () => {
    expect(
      filterJobs(jobs, {
        keyword: "AI",
        aiOnly: true,
        newOnly: true,
        favoriteOnly: false
      }).map((job) => job.id)
    ).toEqual(["job-1"]);
  });
});
