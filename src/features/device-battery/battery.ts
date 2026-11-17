import type { DeviceBattery } from "./types";

export type BatteryLevel = "full" | "good" | "low" | "critical";
export type BatteryState = "discharging" | "charging" | "almostFull" | "full";
export type BatteryIcon = "unknown" | "charging" | "full" | "medium" | "low";

export function levelKey(level: number | null): BatteryLevel | null {
  if (level === 8) return "full";
  if (level === 4) return "good";
  if (level === 2) return "low";
  if (level === 1) return "critical";
  return null;
}

export function stateKey(state: number | null): BatteryState | null {
  if (state === 0) return "discharging";
  if (state === 1) return "charging";
  if (state === 2) return "almostFull";
  if (state === 3) return "full";
  return null;
}

export function batteryIconKind(battery: DeviceBattery): BatteryIcon {
  if (!battery.available || battery.percent === null) return "unknown";
  if (battery.state === 1) return "charging";
  if (battery.percent >= 80) return "full";
  if (battery.percent >= 30) return "medium";
  return "low";
}

export function batteryPercentText(battery: DeviceBattery): string | null {
  if (!battery.available || battery.percent === null) return null;
  return `${battery.percent}%`;
}

function optionalByte(value: unknown): number | null {
  if (typeof value !== "number" || !Number.isInteger(value) || value < 0 || value > 255) return null;
  return value;
}

export function normalizeDeviceBattery(value: unknown): DeviceBattery | null {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return null;
  const battery = value as Partial<DeviceBattery>;
  if (typeof battery.id !== "string" || battery.id === "") return null;
  if (typeof battery.name !== "string" || battery.name === "") return null;
  const percent = optionalByte(battery.percent);
  return {
    id: battery.id,
    name: battery.name,
    available: battery.available === true,
    percent: percent !== null && percent <= 100 ? percent : null,
    level: optionalByte(battery.level),
    state: optionalByte(battery.state),
  };
}

export function normalizeDeviceBatteries(value: unknown): DeviceBattery[] {
  if (!Array.isArray(value)) return [];
  const seen = new Set<string>();
  const batteries: DeviceBattery[] = [];
  for (const entry of value) {
    const battery = normalizeDeviceBattery(entry);
    if (battery === null || seen.has(battery.id)) continue;
    seen.add(battery.id);
    batteries.push(battery);
  }
  return batteries;
}
