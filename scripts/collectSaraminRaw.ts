import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

import { requireEnvValue } from "../src/lib/env";
import { buildSaraminRawFileName } from "../src/lib/rawFiles";
import { searchSaraminJobsRaw } from "../src/lib/saraminClient";

function todayDateOnly(): string {
  return new Date().toISOString().slice(0, 10);
}

async function main() {
  const accessKey = requireEnvValue("SARIMIN_ACCESS_KEY");
  const keyword = process.argv[2] ?? "frontend";
  const collectedAt = todayDateOnly();
  const rawResponse = await searchSaraminJobsRaw({
    accessKey,
    keywords: keyword,
    count: 10
  });
  const outputDirectory = resolve(process.cwd(), "data", "raw");
  const outputPath = resolve(outputDirectory, buildSaraminRawFileName(collectedAt, keyword));

  mkdirSync(outputDirectory, { recursive: true });
  writeFileSync(outputPath, `${JSON.stringify(rawResponse, null, 2)}\n`, "utf8");

  console.log(`Saramin raw response saved: ${outputPath}`);
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(message);
  process.exitCode = 1;
});
