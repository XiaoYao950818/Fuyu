import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useMediaState } from "../../features/media/useMediaState";
import { usePlayingLyrics } from "../../features/media/lyrics/usePlayingLyrics";
import { listenMusicIslandClose, setMusicIslandVisible } from "../../features/music-island/api";
import { MUSIC_ISLAND_EXIT_FALLBACK_MS, trackKeyOf } from "../../features/music-island/musicIsland";
import { useMusicIslandSettings } from "../../features/music-island/useMusicIslandSettings";
import { loadSettings, STORAGE_KEY } from "../../lib/settings/storage";
import { useSystemDark } from "../../lib/theme/useResolvedTheme";
import { useWindowAccent } from "../../lib/theme/useWindowAccent";
import { MusicIslandPanel } from "./MusicIslandPanel";
import "./MusicIslandWindow.css";

type Phase = "open" | "leaving" | "hidden";

function loadIslandLyricsSettings() {
  const settings = loadSettings();
  return {
    lyricsFolder: settings.lyricsFolder,
    lyricsOnline: settings.lyricsOnline,
    lyricsChinese: settings.lyricsChinese,
    lyricsOffsetMs: settings.lyricsOffsetMs,
  };
}

export function MusicIslandWindow() {
  const light = !useSystemDark();
  useWindowAccent();
  const [settings] = useMusicIslandSettings();
  const { mediaState, isMediaTrackChanging, mediaCommandError, runMediaCommand } = useMediaState(true);
  const [lyricsSettings, setLyricsSettings] = useState(loadIslandLyricsSettings);
  const { lines, notFound, offsetMs } = usePlayingLyrics(mediaState, lyricsSettings);
  const [phase, setPhase] = useState<Phase>("open");
  const dismissedKey = useRef<string | null>(null);
  const hideCalled = useRef(false);

  const trackKey = useMemo(
    () => trackKeyOf(mediaState.title, mediaState.artist, mediaState.durationMs),
    [mediaState.title, mediaState.artist, mediaState.durationMs],
  );
  const shouldHide = !settings.enabled || mediaState.playbackStatus !== "playing" || mediaState.title === null;

  useEffect(() => {
    document.documentElement.classList.toggle("island-light", light);
  }, [light]);

  useEffect(() => {
    const reload = () => setLyricsSettings(loadIslandLyricsSettings());
    const syncFromOtherWindow = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) reload();
    };
    window.addEventListener("storage", syncFromOtherWindow);
    return () => window.removeEventListener("storage", syncFromOtherWindow);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const unlistenPromise = listenMusicIslandClose(() => {
      if (!cancelled) setPhase("leaving");
    });
    return () => {
      cancelled = true;
      void unlistenPromise.then((unlisten) => unlisten());
    };
  }, []);

  const finishHide = useCallback(() => {
    if (hideCalled.current) return;
    hideCalled.current = true;
    void setMusicIslandVisible(false)
      .catch((error: unknown) => console.error("Failed to hide the music island", error))
      .finally(() => {
        hideCalled.current = false;
        setPhase("hidden");
      });
  }, []);

  useEffect(() => {
    if (trackKey !== dismissedKey.current) dismissedKey.current = null;
    if (shouldHide) {
      if (phase !== "hidden") setPhase("leaving");
      return;
    }
    if (phase === "leaving") {
      if (trackKey !== dismissedKey.current) setPhase("open");
      return;
    }
    if (phase === "hidden" && trackKey !== dismissedKey.current) {
      setPhase("open");
      void setMusicIslandVisible(true).catch((error: unknown) => console.error("Failed to show the music island", error));
    }
  }, [shouldHide, trackKey, phase]);

  useEffect(() => {
    if (phase !== "leaving") return;
    const timer = window.setTimeout(finishHide, MUSIC_ISLAND_EXIT_FALLBACK_MS);
    return () => window.clearTimeout(timer);
  }, [phase, finishHide]);

  const onClose = useCallback(() => {
    dismissedKey.current = trackKey;
    setPhase("leaving");
  }, [trackKey]);

  return (
    <div className="music-island-window">
      {phase !== "hidden" && (
        <MusicIslandPanel
          mediaState={mediaState}
          lines={lines}
          offsetMs={offsetMs}
          notFound={notFound}
          isTrackChanging={isMediaTrackChanging}
          commandError={mediaCommandError}
          phase={phase}
          onExitAnimationEnd={finishHide}
          onClose={onClose}
          onPlayPause={() => void runMediaCommand("media_play_pause")}
          onNext={() => void runMediaCommand("media_next")}
          onPrevious={() => void runMediaCommand("media_previous")}
        />
      )}
    </div>
  );
}
