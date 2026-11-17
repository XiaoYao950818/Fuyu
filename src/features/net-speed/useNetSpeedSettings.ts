import { useCallback, useEffect, useState } from "react";
import type { NetSpeedSettings } from "./types";
import { NET_SPEED_KEY, loadNetSpeedSettings, saveNetSpeedSettings } from "./storage";

export function useNetSpeedSettings() {
  const [settings, setSettings] = useState<NetSpeedSettings>(loadNetSpeedSettings);

  useEffect(() => {
    const syncFromOtherWindow = (event: StorageEvent) => {
      if (event.key === NET_SPEED_KEY) setSettings(loadNetSpeedSettings());
    };
    window.addEventListener("storage", syncFromOtherWindow);
    return () => window.removeEventListener("storage", syncFromOtherWindow);
  }, []);

  const update = useCallback((next: NetSpeedSettings) => {
    setSettings(next);
    saveNetSpeedSettings(next);
  }, []);

  return [settings, update] as const;
}
