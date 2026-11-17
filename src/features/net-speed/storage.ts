import { readJson, writeJson } from "../../lib/storage.ts";
import type { NetSpeedSettings } from "./types";

export const NET_SPEED_KEY = "fuyu-net-speed";

export const DEFAULT_NET_SPEED_SETTINGS: NetSpeedSettings = { enabled: true };

export function normalizeNetSpeedSettings(value: unknown): NetSpeedSettings {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return { ...DEFAULT_NET_SPEED_SETTINGS };
  const settings = value as Partial<NetSpeedSettings>;
  return { enabled: settings.enabled !== false };
}

export function loadNetSpeedSettings(): NetSpeedSettings {
  return normalizeNetSpeedSettings(readJson(NET_SPEED_KEY));
}

export function saveNetSpeedSettings(settings: NetSpeedSettings): boolean {
  return writeJson(NET_SPEED_KEY, settings);
}
