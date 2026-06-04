import { writeFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";

import { requireEnvValue } from "../src/lib/env";
import { normalizeSaraminJobs } from "../src/lib/saraminNormalizer";
import { searchSaraminJobs } from "../src/lib/saraminClient";

function todayDateOnly(): string {
  return new Date().toISOString().slice(0, 10);
}

async function main() {
  const accessKey = requireEnvValue("SARIMIN_ACCESS_KEY");
  const keyword = process.argv[2] ?? "프론트엔드";
  const collectedAt = todayDateOnly();

  const saraminJobs = await searchSaraminJobs({
    accessKey,
    keywords: keyword,
    count: 10
  });
  const jobs = normalizeSaraminJobs(saraminJobs, collectedAt);
  const outputDirectory = resolve(process.cwd(), "data", "collected");
  const outputPath = resolve(outputDirectory, `saramin-${collectedAt}.json`);

  mkdirSync(outputDirectory, { recursive: true });
  writeFileSync(outputPath, `${JSON.stringify(jobs, null, 2)}\n`, "utf8");

  console.log(`사람인 공고 ${jobs.length}개 저장: ${outputPath}`);
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(message);
  process.exitCode = 1;
});
