export function sanitizeFileNamePart(value: string): string {
  const sanitized = value
    .trim()
    .replace(/[\\/:*?"<>|]+/g, "-")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return sanitized || "keyword";
}

export function buildSaraminRawFileName(date: string, keyword: string): string {
  return `saramin-${date}-${sanitizeFileNamePart(keyword)}.json`;
}
