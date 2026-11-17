import { useCallback, useEffect, useState } from "react";
import type { DeviceBatterySettings } from "./types";
import { DEVICE_BATTERY_KEY, loadDeviceBatterySettings, saveDeviceBatterySettings } from "./storage";

export function useDeviceBatterySettings() {
  const [settings, setSettings] = useState<DeviceBatterySettings>(loadDeviceBatterySettings);

  useEffect(() => {
    const syncFromOtherWindow = (event: StorageEvent) => {
      if (event.key === DEVICE_BATTERY_KEY) setSettings(loadDeviceBatterySettings());
    };
    window.addEventListener("storage", syncFromOtherWindow);
    return () => window.removeEventListener("storage", syncFromOtherWindow);
  }, []);

  const update = useCallback((next: DeviceBatterySettings) => {
    setSettings(next);
    saveDeviceBatterySettings(next);
  }, []);

  return [settings, update] as const;
}
