export type JobSource = "Saramin" | "Wanted" | "Programmers" | "JobKorea" | "LinkedIn";

export type EmploymentType = "Full-time" | "Contract" | "Internship" | "Freelance";

export type JobPosting = {
  id: string;
  title: string;
  company: string;
  source: JobSource;
  sourceJobId?: string;
  url?: string;
  location: string;
  experience: string;
  employmentType: EmploymentType;
  deadline: string;
  keywords: string[];
  techStacks: string[];
  isAiRelated: boolean;
  isNew: boolean;
  collectedAt: string;
  firstSeenAt?: string;
  lastSeenAt?: string;
  status?: "open" | "closed" | "expired" | "unknown";
};

export type JobFilterState = {
  keyword: string;
  aiOnly: boolean;
  newOnly: boolean;
  favoriteOnly: boolean;
};

export type DashboardSummaryStats = {
  total: number;
  newToday: number;
  aiRelated: number;
  closingSoon: number;
};
