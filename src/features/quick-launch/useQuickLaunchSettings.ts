import { useCallback, useEffect, useState } from "react";
import type { QuickLaunchSettings } from "./types";
import { QUICK_LAUNCH_KEY, loadQuickLaunchSettings, saveQuickLaunchSettings } from "./storage";

export function useQuickLaunchSettings() {
  const [settings, setSettings] = useState<QuickLaunchSettings>(loadQuickLaunchSettings);

  useEffect(() => {
    const syncFromOtherWindow = (event: StorageEvent) => {
      if (event.key === QUICK_LAUNCH_KEY) setSettings(loadQuickLaunchSettings());
    };
    window.addEventListener("storage", syncFromOtherWindow);
    return () => window.removeEventListener("storage", syncFromOtherWindow);
  }, []);

  const update = useCallback((next: QuickLaunchSettings) => {
    setSettings(next);
    saveQuickLaunchSettings(next);
  }, []);

  return [settings, update] as const;
}
