import { readJson, writeJson } from "../../lib/storage.ts";
import type { FileSearchSettings } from "./types";

export const FILE_SEARCH_KEY = "fuyu-file-search";

export const DEFAULT_FILE_SEARCH_SETTINGS: FileSearchSettings = { enabled: true };

export function normalizeFileSearchSettings(value: unknown): FileSearchSettings {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return { ...DEFAULT_FILE_SEARCH_SETTINGS };
  const settings = value as Partial<FileSearchSettings>;
  return { enabled: settings.enabled !== false };
}

export function loadFileSearchSettings(): FileSearchSettings {
  return normalizeFileSearchSettings(readJson(FILE_SEARCH_KEY));
}

export function saveFileSearchSettings(settings: FileSearchSettings): boolean {
  return writeJson(FILE_SEARCH_KEY, settings);
}
