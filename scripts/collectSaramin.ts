import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

import { dedupeJobs, summarizeCollection } from "../src/lib/collection";
import { requireEnvValue } from "../src/lib/env";
import { saveCollectionRun, upsertJobs } from "../src/lib/jobRepository";
import { searchSaraminJobs } from "../src/lib/saraminClient";
import { normalizeSaraminJobs } from "../src/lib/saraminNormalizer";

function todayDateOnly(): string {
  return new Date().toISOString().slice(0, 10);
}

async function main() {
  const accessKey = requireEnvValue("SARIMIN_ACCESS_KEY");
  const keyword = process.argv[2] ?? "frontend";
  const collectedAt = todayDateOnly();

  const saraminJobs = await searchSaraminJobs({
    accessKey,
    keywords: keyword,
    count: 10
  });
  const jobs = dedupeJobs(normalizeSaraminJobs(saraminJobs, collectedAt));
  const summary = summarizeCollection(jobs, collectedAt);
  const outputDirectory = resolve(process.cwd(), "data", "collected");
  const outputPath = resolve(outputDirectory, `saramin-${collectedAt}.json`);
  const latestPath = resolve(outputDirectory, "latest.json");
  const summaryPath = resolve(outputDirectory, `saramin-${collectedAt}-summary.json`);

  mkdirSync(outputDirectory, { recursive: true });
  writeFileSync(outputPath, `${JSON.stringify(jobs, null, 2)}\n`, "utf8");
  writeFileSync(latestPath, `${JSON.stringify(jobs, null, 2)}\n`, "utf8");
  writeFileSync(summaryPath, `${JSON.stringify(summary, null, 2)}\n`, "utf8");
  upsertJobs(jobs);
  saveCollectionRun({
    source: "Saramin",
    keyword,
    summary,
    status: "success"
  });

  console.log(`Saramin jobs saved: ${jobs.length}`);
  console.log(`Output: ${outputPath}`);
  console.log(`Latest: ${latestPath}`);
  console.log(`Summary: ${summaryPath}`);
  console.log("SQLite database updated");
  console.log(
    `Summary total=${summary.total}, new=${summary.newJobs}, ai=${summary.aiRelated}, closingSoon=${summary.closingSoon}`
  );
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(message);
  process.exitCode = 1;
});
