import { describe, expect, it } from "vitest";

import { dedupeJobs, summarizeCollection } from "./collection";
import type { JobPosting } from "../types/job";

const baseJob: JobPosting = {
  id: "saramin-1",
  source: "Saramin",
  sourceJobId: "1",
  url: "https://example.com/jobs/1",
  title: "Frontend Engineer",
  company: "Acme",
  location: "Seoul",
  experience: "3+ years",
  employmentType: "Full-time",
  deadline: "2026-06-07",
  keywords: ["Frontend"],
  techStacks: ["React"],
  isAiRelated: false,
  isNew: true,
  collectedAt: "2026-06-04",
  firstSeenAt: "2026-06-04",
  lastSeenAt: "2026-06-04",
  status: "open"
};

describe("collection helpers", () => {
  it("dedupes jobs by source and sourceJobId first", () => {
    const jobs = dedupeJobs([
      baseJob,
      {
        ...baseJob,
        id: "saramin-duplicate",
        title: "Frontend Engineer Updated"
      }
    ]);

    expect(jobs).toHaveLength(1);
    expect(jobs[0].id).toBe("saramin-1");
  });

  it("dedupes jobs by company, title, deadline, and location when sourceJobId is missing", () => {
    const jobs = dedupeJobs([
      {
        ...baseJob,
        id: "manual-1",
        sourceJobId: undefined
      },
      {
        ...baseJob,
        id: "manual-2",
        sourceJobId: undefined,
        title: " frontend  engineer ",
        company: "ACME"
      }
    ]);

    expect(jobs).toHaveLength(1);
    expect(jobs[0].id).toBe("manual-1");
  });

  it("summarizes collection results", () => {
    const summary = summarizeCollection(
      [
        baseJob,
        {
          ...baseJob,
          id: "saramin-2",
          sourceJobId: "2",
          title: "LLM Engineer",
          isAiRelated: true,
          isNew: false,
          deadline: "2026-06-20"
        }
      ],
      "2026-06-04"
    );

    expect(summary).toEqual({
      total: 2,
      newJobs: 1,
      aiRelated: 1,
      closingSoon: 1,
      collectedAt: "2026-06-04"
    });
  });
});
