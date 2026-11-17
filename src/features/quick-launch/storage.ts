import { readJson, writeJson } from "../../lib/storage.ts";
import type { QuickLaunchItem, QuickLaunchKind, QuickLaunchSettings } from "./types";

export const QUICK_LAUNCH_KEY = "fuyu-quick-launch";

export const DEFAULT_QUICK_LAUNCH_SETTINGS: QuickLaunchSettings = { enabled: true, items: [] };

const KINDS: readonly QuickLaunchKind[] = ["app", "folder", "url"];

function normalizeItem(value: unknown): QuickLaunchItem | null {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return null;
  const item = value as Partial<QuickLaunchItem>;
  if (typeof item.id !== "string" || item.id === "") return null;
  if (typeof item.name !== "string" || item.name.trim() === "") return null;
  if (typeof item.target !== "string" || item.target.trim() === "") return null;
  if (typeof item.kind !== "string" || !KINDS.includes(item.kind as QuickLaunchKind)) return null;
  return { id: item.id, name: item.name.trim(), target: item.target.trim(), kind: item.kind as QuickLaunchKind };
}

function normalizeItems(value: unknown): QuickLaunchItem[] {
  if (!Array.isArray(value)) return [];
  const seen = new Set<string>();
  const items: QuickLaunchItem[] = [];
  for (const entry of value) {
    const item = normalizeItem(entry);
    if (item === null || seen.has(item.id)) continue;
    seen.add(item.id);
    items.push(item);
  }
  return items;
}

export function normalizeQuickLaunchSettings(value: unknown): QuickLaunchSettings {
  if (Array.isArray(value)) return { enabled: true, items: normalizeItems(value) };
  if (typeof value !== "object" || value === null) return { ...DEFAULT_QUICK_LAUNCH_SETTINGS, items: [] };
  const settings = value as Partial<QuickLaunchSettings>;
  return { enabled: settings.enabled !== false, items: normalizeItems(settings.items) };
}

export function loadQuickLaunchSettings(): QuickLaunchSettings {
  return normalizeQuickLaunchSettings(readJson(QUICK_LAUNCH_KEY));
}

export function saveQuickLaunchSettings(settings: QuickLaunchSettings): boolean {
  return writeJson(QUICK_LAUNCH_KEY, settings);
}
