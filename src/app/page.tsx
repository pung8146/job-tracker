import { JobDashboard } from "@/components/JobDashboard";
import { mockJobs } from "@/data/mockJobs";
import { loadCollectedJobsFromFile } from "@/lib/collectedJobs";

export default function Home() {
  const collectedJobs = loadCollectedJobsFromFile();
  const jobs = collectedJobs.ok ? collectedJobs.jobs : mockJobs;
  const dataSourceLabel = collectedJobs.ok ? "수집 데이터" : "mock 데이터";

  return <JobDashboard dataSourceLabel={dataSourceLabel} jobs={jobs} />;
}
