export type SaraminCodeName = {
  code?: string | number;
  name?: string;
};

export type SaraminJob = {
  id: string;
  url: string;
  active?: 0 | 1 | "0" | "1";
  company?: {
    name?: string;
  };
  position?: {
    title?: string;
    location?: SaraminCodeName;
    "job-type"?: SaraminCodeName;
    "experience-level"?: SaraminCodeName & {
      min?: number;
      max?: number;
    };
  };
  keyword?: string;
  "posting-timestamp"?: string;
  "posting-date"?: string;
  "modification-timestamp"?: string;
  "opening-timestamp"?: string;
  "expiration-timestamp"?: string;
  "expiration-date"?: string;
  "close-type"?: SaraminCodeName;
};

export type SaraminJobSearchResponse = {
  "job-search"?: {
    jobs?: {
      count?: number;
      start?: number;
      total?: number;
      job?: SaraminJob | SaraminJob[];
    };
  };
};
