import { readJson, writeJson } from "../../lib/storage.ts";
import type { DockPinnedApp, DockScreen, DockSettings } from "./types";

export const DOCK_KEY = "fuyu-dock";

export const MAX_PINNED_APPS = 12;

export const DEFAULT_DOCK_SETTINGS: DockSettings = { enabled: false, screen: "primary", pinned: [] };

export function normalizeDockScreen(value: unknown): DockScreen {
  return value === "cursor" ? "cursor" : "primary";
}

function normalizePinned(value: unknown): DockPinnedApp[] {
  if (!Array.isArray(value)) return [];
  const seen = new Set<string>();
  const pinned: DockPinnedApp[] = [];
  for (const entry of value) {
    if (typeof entry !== "object" || entry === null || Array.isArray(entry)) continue;
    const item = entry as Partial<DockPinnedApp>;
    if (typeof item.id !== "string" || item.id === "") continue;
    if (typeof item.name !== "string" || item.name.trim() === "") continue;
    if (typeof item.target !== "string" || item.target.trim() === "") continue;
    if (seen.has(item.id)) continue;
    seen.add(item.id);
    pinned.push({ id: item.id, name: item.name.trim(), target: item.target.trim() });
    if (pinned.length >= MAX_PINNED_APPS) break;
  }
  return pinned;
}

export function normalizeDockSettings(value: unknown): DockSettings {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return { ...DEFAULT_DOCK_SETTINGS, pinned: [] };
  const settings = value as Partial<DockSettings>;
  return { enabled: settings.enabled === true, screen: normalizeDockScreen(settings.screen), pinned: normalizePinned(settings.pinned) };
}

export function loadDockSettings(): DockSettings {
  return normalizeDockSettings(readJson(DOCK_KEY));
}

export function saveDockSettings(settings: DockSettings): boolean {
  return writeJson(DOCK_KEY, settings);
}
