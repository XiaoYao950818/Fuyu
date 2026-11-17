import { useCallback, useEffect, useState } from "react";
import type { MusicIslandSettings } from "./types";
import { MUSIC_ISLAND_KEY, loadMusicIslandSettings, saveMusicIslandSettings } from "./storage";

export function useMusicIslandSettings() {
  const [settings, setSettings] = useState<MusicIslandSettings>(loadMusicIslandSettings);

  useEffect(() => {
    const syncFromOtherWindow = (event: StorageEvent) => {
      if (event.key === MUSIC_ISLAND_KEY) setSettings(loadMusicIslandSettings());
    };
    window.addEventListener("storage", syncFromOtherWindow);
    return () => window.removeEventListener("storage", syncFromOtherWindow);
  }, []);

  const update = useCallback((next: MusicIslandSettings) => {
    setSettings(next);
    saveMusicIslandSettings(next);
  }, []);

  return [settings, update] as const;
}
