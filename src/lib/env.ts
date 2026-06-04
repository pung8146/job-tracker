import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const ENV_FILE_NAMES = [".env.local", ".env"];

function readEnvFiles(): Record<string, string> {
  const values: Record<string, string> = {};

  for (const fileName of ENV_FILE_NAMES) {
    const filePath = resolve(process.cwd(), fileName);

    if (!existsSync(filePath)) {
      continue;
    }

    const lines = readFileSync(filePath, "utf8").split(/\r?\n/);

    for (const line of lines) {
      const trimmed = line.trim();

      if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) {
        continue;
      }

      const [key, ...valueParts] = trimmed.split("=");
      const value = valueParts.join("=").trim().replace(/^["']|["']$/g, "");
      values[key.trim()] = value;
    }
  }

  return values;
}

export function getEnvValue(key: string): string | undefined {
  return process.env[key] ?? readEnvFiles()[key];
}

export function requireEnvValue(key: string): string {
  const value = getEnvValue(key);

  if (!value) {
    throw new Error(`${key}가 필요합니다. 프로젝트 루트의 .env.local에 ${key}=발급받은_키 형식으로 추가하세요.`);
  }

  return value;
}
