import { readJson, writeJson } from "../../lib/storage.ts";
import type { DeviceBatterySettings } from "./types";

export const DEVICE_BATTERY_KEY = "fuyu-device-battery";

export const DEFAULT_DEVICE_BATTERY_SETTINGS: DeviceBatterySettings = { enabled: true };

export function normalizeDeviceBatterySettings(value: unknown): DeviceBatterySettings {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return { ...DEFAULT_DEVICE_BATTERY_SETTINGS };
  const settings = value as Partial<DeviceBatterySettings>;
  return { enabled: settings.enabled !== false };
}

export function loadDeviceBatterySettings(): DeviceBatterySettings {
  return normalizeDeviceBatterySettings(readJson(DEVICE_BATTERY_KEY));
}

export function saveDeviceBatterySettings(settings: DeviceBatterySettings): boolean {
  return writeJson(DEVICE_BATTERY_KEY, settings);
}
