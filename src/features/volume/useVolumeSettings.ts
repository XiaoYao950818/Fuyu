import { useCallback, useEffect, useState } from "react";
import type { VolumeSettings } from "./types";
import { VOLUME_KEY, loadVolumeSettings, saveVolumeSettings } from "./storage";

export function useVolumeSettings() {
  const [settings, setSettings] = useState<VolumeSettings>(loadVolumeSettings);

  useEffect(() => {
    const syncFromOtherWindow = (event: StorageEvent) => {
      if (event.key === VOLUME_KEY) setSettings(loadVolumeSettings());
    };
    window.addEventListener("storage", syncFromOtherWindow);
    return () => window.removeEventListener("storage", syncFromOtherWindow);
  }, []);

  const update = useCallback((next: VolumeSettings) => {
    setSettings(next);
    saveVolumeSettings(next);
  }, []);

  return [settings, update] as const;
}
