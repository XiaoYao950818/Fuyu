import { readJson, writeJson } from "../../lib/storage.ts";
import type { QuickCommandItem, QuickCommandSettings } from "./types";

export const QUICK_COMMANDS_KEY = "fuyu-quick-commands";

export const DEFAULT_QUICK_COMMANDS_SETTINGS: QuickCommandSettings = { enabled: true, items: [] };

function normalizeItem(value: unknown): QuickCommandItem | null {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return null;
  const item = value as Partial<QuickCommandItem>;
  if (typeof item.id !== "string" || item.id === "") return null;
  if (typeof item.name !== "string" || item.name.trim() === "") return null;
  if (typeof item.command !== "string" || item.command.trim() === "") return null;
  return { id: item.id, name: item.name.trim(), command: item.command.trim() };
}

function normalizeItems(value: unknown): QuickCommandItem[] {
  if (!Array.isArray(value)) return [];
  const seen = new Set<string>();
  const items: QuickCommandItem[] = [];
  for (const entry of value) {
    const item = normalizeItem(entry);
    if (item === null || seen.has(item.id)) continue;
    seen.add(item.id);
    items.push(item);
  }
  return items;
}

export function normalizeQuickCommandsSettings(value: unknown): QuickCommandSettings {
  if (Array.isArray(value)) return { enabled: true, items: normalizeItems(value) };
  if (typeof value !== "object" || value === null) return { ...DEFAULT_QUICK_COMMANDS_SETTINGS, items: [] };
  const settings = value as Partial<QuickCommandSettings>;
  return { enabled: settings.enabled !== false, items: normalizeItems(settings.items) };
}

export function loadQuickCommandsSettings(): QuickCommandSettings {
  return normalizeQuickCommandsSettings(readJson(QUICK_COMMANDS_KEY));
}

export function saveQuickCommandsSettings(settings: QuickCommandSettings): boolean {
  return writeJson(QUICK_COMMANDS_KEY, settings);
}
