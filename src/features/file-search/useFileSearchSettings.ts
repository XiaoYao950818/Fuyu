import { useCallback, useEffect, useState } from "react";
import type { FileSearchSettings } from "./types";
import { FILE_SEARCH_KEY, loadFileSearchSettings, saveFileSearchSettings } from "./storage";

export function useFileSearchSettings() {
  const [settings, setSettings] = useState<FileSearchSettings>(loadFileSearchSettings);

  useEffect(() => {
    const syncFromOtherWindow = (event: StorageEvent) => {
      if (event.key === FILE_SEARCH_KEY) setSettings(loadFileSearchSettings());
    };
    window.addEventListener("storage", syncFromOtherWindow);
    return () => window.removeEventListener("storage", syncFromOtherWindow);
  }, []);

  const update = useCallback((next: FileSearchSettings) => {
    setSettings(next);
    saveFileSearchSettings(next);
  }, []);

  return [settings, update] as const;
}
