import type { FileSearchStatus } from "./types";

export const FILE_SEARCH_RESULT_LIMIT = 200;

export type FileSearchEmptyState = "disabled" | "loading" | "adminRequired" | "indexing" | "error" | "hint" | "searching" | "noResults";

export function matchFileName(name: string, query: string): boolean {
  const needle = query.trim().toLowerCase();
  if (needle === "") return false;
  return name.toLowerCase().includes(needle);
}

export function limitFileResults<T>(items: readonly T[], limit: number = FILE_SEARCH_RESULT_LIMIT): T[] {
  if (!Number.isFinite(limit) || limit <= 0) return [];
  return items.slice(0, Math.floor(limit));
}

export function formatFileSize(size: number): string {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  if (size < 1024 * 1024 * 1024) return `${(size / 1024 / 1024).toFixed(1)} MB`;
  return `${(size / 1024 / 1024 / 1024).toFixed(2)} GB`;
}

export function formatFileModified(modified: number | null): string {
  if (modified === null) return "";
  return new Date(modified).toLocaleDateString();
}

export function fileSearchEmptyState(input: {
  enabled: boolean;
  status: FileSearchStatus | null;
  query: string;
  searching: boolean;
  resultCount: number;
}): FileSearchEmptyState | null {
  if (!input.enabled) return "disabled";
  if (input.status === null) return "loading";
  if (input.status.adminRequired) return "adminRequired";
  if (input.status.state === "building") return "indexing";
  if (input.status.state === "error") return "error";
  if (input.query.trim() === "") return "hint";
  if (input.searching) return "searching";
  if (input.resultCount === 0) return "noResults";
  return null;
}
