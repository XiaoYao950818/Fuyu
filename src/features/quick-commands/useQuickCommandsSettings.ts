import { useCallback, useEffect, useState } from "react";
import type { QuickCommandSettings } from "./types";
import { QUICK_COMMANDS_KEY, loadQuickCommandsSettings, saveQuickCommandsSettings } from "./storage";

export function useQuickCommandsSettings() {
  const [settings, setSettings] = useState<QuickCommandSettings>(loadQuickCommandsSettings);

  useEffect(() => {
    const syncFromOtherWindow = (event: StorageEvent) => {
      if (event.key === QUICK_COMMANDS_KEY) setSettings(loadQuickCommandsSettings());
    };
    window.addEventListener("storage", syncFromOtherWindow);
    return () => window.removeEventListener("storage", syncFromOtherWindow);
  }, []);

  const update = useCallback((next: QuickCommandSettings) => {
    setSettings(next);
    saveQuickCommandsSettings(next);
  }, []);

  return [settings, update] as const;
}
