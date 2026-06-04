import { JobDashboard } from "@/components/JobDashboard";
import { mockJobs } from "@/data/mockJobs";
import { loadCollectedJobsFromFile } from "@/lib/collectedJobs";
import { getJobsFromDatabase } from "@/lib/jobRepository";
import type { JobPosting } from "@/types/job";

export const dynamic = "force-dynamic";

function getDashboardJobs(): { jobs: JobPosting[]; dataSourceLabel: string } {
  const databaseJobs = getJobsFromDatabase();

  if (databaseJobs.length > 0) {
    return {
      jobs: databaseJobs,
      dataSourceLabel: "SQLite 데이터"
    };
  }

  const collectedJobs = loadCollectedJobsFromFile();

  if (collectedJobs.ok && collectedJobs.jobs.length > 0) {
    return {
      jobs: collectedJobs.jobs,
      dataSourceLabel: "수집 데이터"
    };
  }

  return {
    jobs: mockJobs,
    dataSourceLabel: "mock 데이터"
  };
}

export default function Home() {
  const { jobs, dataSourceLabel } = getDashboardJobs();

  return <JobDashboard dataSourceLabel={dataSourceLabel} jobs={jobs} />;
}
