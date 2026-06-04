import { describe, expect, it } from "vitest";

import { normalizeSaraminJob } from "./saraminNormalizer";
import type { SaraminJob } from "../types/saramin";

const saraminJob: SaraminJob = {
  id: "49280001",
  url: "https://www.saramin.co.kr/zf_user/jobs/relay/view?rec_idx=49280001",
  active: 1,
  company: {
    name: "Next Career"
  },
  position: {
    title: "AI Service Frontend Engineer",
    location: {
      code: "101010",
      name: "Seoul > Gangnam"
    },
    "job-type": {
      code: "1",
      name: "Full-time"
    },
    "experience-level": {
      code: 2,
      min: 2,
      max: 5,
      name: "2-5 years"
    }
  },
  keyword: "React,TypeScript,LLM,Frontend",
  "posting-date": "2026-06-04T09:10:11+0900",
  "posting-timestamp": "1780528211",
  "expiration-date": "2026-06-30T23:59:59+0900",
  "expiration-timestamp": "1782831599",
  "close-type": {
    code: "1",
    name: "Deadline"
  }
};

describe("normalizeSaraminJob", () => {
  it("converts a Saramin job into the dashboard job type", () => {
    expect(normalizeSaraminJob(saraminJob, "2026-06-04")).toEqual({
      id: "saramin-49280001",
      source: "Saramin",
      sourceJobId: "49280001",
      url: "https://www.saramin.co.kr/zf_user/jobs/relay/view?rec_idx=49280001",
      title: "AI Service Frontend Engineer",
      company: "Next Career",
      location: "Seoul > Gangnam",
      experience: "2-5 years",
      employmentType: "Full-time",
      deadline: "2026-06-30",
      keywords: ["React", "TypeScript", "LLM", "Frontend"],
      techStacks: ["React", "TypeScript"],
      isAiRelated: true,
      isNew: true,
      collectedAt: "2026-06-04",
      firstSeenAt: "2026-06-04",
      lastSeenAt: "2026-06-04",
      status: "open"
    });
  });

  it("uses unknown deadline for always-open jobs without expiration date", () => {
    expect(
      normalizeSaraminJob(
        {
          ...saraminJob,
          "expiration-date": undefined,
          "expiration-timestamp": undefined,
          "close-type": {
            code: "3",
            name: "Always open"
          }
        },
        "2026-06-04"
      ).deadline
    ).toBe("unknown");
  });
});
