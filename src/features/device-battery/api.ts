import { invoke } from "@tauri-apps/api/core";
import type { DeviceBattery } from "./types";

export function getDeviceBatteries(): Promise<DeviceBattery[]> {
  return invoke<DeviceBattery[]>("get_device_batteries");
}
