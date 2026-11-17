import { readJson, writeJson } from "../../lib/storage.ts";
import type { VolumeSettings } from "./types";

export const VOLUME_KEY = "fuyu-volume";

export const DEFAULT_VOLUME_SETTINGS: VolumeSettings = { enabled: true };

export function normalizeVolumeSettings(value: unknown): VolumeSettings {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return { ...DEFAULT_VOLUME_SETTINGS };
  const settings = value as Partial<VolumeSettings>;
  return { enabled: settings.enabled !== false };
}

export function loadVolumeSettings(): VolumeSettings {
  return normalizeVolumeSettings(readJson(VOLUME_KEY));
}

export function saveVolumeSettings(settings: VolumeSettings): boolean {
  return writeJson(VOLUME_KEY, settings);
}
