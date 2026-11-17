import { useCallback, useEffect, useState } from "react";
import type { DockSettings } from "./types";
import { DOCK_KEY, loadDockSettings, saveDockSettings } from "./storage";

export function useDockSettings() {
  const [settings, setSettings] = useState<DockSettings>(loadDockSettings);

  useEffect(() => {
    const syncFromOtherWindow = (event: StorageEvent) => {
      if (event.key === DOCK_KEY) setSettings(loadDockSettings());
    };
    window.addEventListener("storage", syncFromOtherWindow);
    return () => window.removeEventListener("storage", syncFromOtherWindow);
  }, []);

  const update = useCallback((next: DockSettings) => {
    setSettings(next);
    saveDockSettings(next);
  }, []);

  return [settings, update] as const;
}
