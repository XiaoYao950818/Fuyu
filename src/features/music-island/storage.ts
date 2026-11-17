import { readJson, writeJson } from "../../lib/storage.ts";
import type { MusicIslandSettings } from "./types.ts";

export const MUSIC_ISLAND_KEY = "fuyu-music-island";

export const DEFAULT_MUSIC_ISLAND_SETTINGS: MusicIslandSettings = { enabled: true };

export function normalizeMusicIslandSettings(value: unknown): MusicIslandSettings {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return { ...DEFAULT_MUSIC_ISLAND_SETTINGS };
  const settings = value as Partial<MusicIslandSettings>;
  return { enabled: settings.enabled !== false };
}

export function loadMusicIslandSettings(): MusicIslandSettings {
  return normalizeMusicIslandSettings(readJson(MUSIC_ISLAND_KEY));
}

export function saveMusicIslandSettings(settings: MusicIslandSettings): boolean {
  return writeJson(MUSIC_ISLAND_KEY, settings);
}
