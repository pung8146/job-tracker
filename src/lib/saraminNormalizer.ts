import type { EmploymentType, JobPosting } from "@/types/job";
import type { SaraminJob } from "@/types/saramin";

const AI_KEYWORDS = ["AI", "LLM", "ML", "Machine Learning", "Deep Learning", "MLOps", "NLP", "Prompt"];
const TECH_STACKS = [
  "TypeScript",
  "JavaScript",
  "React",
  "Next.js",
  "Vue",
  "Tailwind CSS",
  "Node.js",
  "Python",
  "Java",
  "Spring",
  "FastAPI",
  "NestJS",
  "PyTorch",
  "TensorFlow",
  "LangChain",
  "Kubernetes",
  "AWS",
  "PostgreSQL",
  "MySQL",
  "MongoDB",
  "Redis"
];

function splitKeywords(keyword?: string): string[] {
  if (!keyword) {
    return [];
  }

  return keyword
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
}

function toDateOnly(value?: string): string | undefined {
  if (!value) {
    return undefined;
  }

  return value.slice(0, 10);
}

function toEmploymentType(value?: string): EmploymentType {
  if (!value) {
    return "Full-time";
  }

  if (value.includes("인턴")) {
    return "Internship";
  }

  if (value.includes("계약") || value.includes("파견")) {
    return "Contract";
  }

  if (value.includes("프리랜서")) {
    return "Freelance";
  }

  return "Full-time";
}

function detectAiRelated(textParts: string[]): boolean {
  const target = textParts.join(" ").toLowerCase();
  return AI_KEYWORDS.some((keyword) => target.includes(keyword.toLowerCase()));
}

function extractTechStacks(textParts: string[]): string[] {
  const target = textParts.join(" ").toLowerCase();
  return TECH_STACKS.map((techStack) => ({
    techStack,
    index: target.indexOf(techStack.toLowerCase())
  }))
    .filter((item) => item.index >= 0)
    .sort((a, b) => a.index - b.index)
    .map((item) => item.techStack);
}

function getDeadline(job: SaraminJob): string {
  const closeTypeCode = String(job["close-type"]?.code ?? "");

  if (closeTypeCode === "2" || closeTypeCode === "3" || closeTypeCode === "4") {
    return "unknown";
  }

  return toDateOnly(job["expiration-date"]) ?? "unknown";
}

export function normalizeSaraminJob(job: SaraminJob, collectedAt: string): JobPosting {
  const keywords = splitKeywords(job.keyword);
  const title = job.position?.title ?? "제목 없음";
  const company = job.company?.name ?? "회사명 없음";
  const searchableText = [title, company, ...keywords];
  const active = String(job.active ?? "1") === "1";

  return {
    id: `saramin-${job.id}`,
    source: "Saramin",
    sourceJobId: job.id,
    url: job.url,
    title,
    company,
    location: job.position?.location?.name ?? "지역 미정",
    experience: job.position?.["experience-level"]?.name ?? "경력 정보 없음",
    employmentType: toEmploymentType(job.position?.["job-type"]?.name),
    deadline: getDeadline(job),
    keywords,
    techStacks: extractTechStacks(searchableText),
    isAiRelated: detectAiRelated(searchableText),
    isNew: toDateOnly(job["posting-date"]) === collectedAt,
    collectedAt,
    firstSeenAt: collectedAt,
    lastSeenAt: collectedAt,
    status: active ? "open" : "closed"
  };
}

export function normalizeSaraminJobs(jobs: SaraminJob[], collectedAt: string): JobPosting[] {
  return jobs.map((job) => normalizeSaraminJob(job, collectedAt));
}
