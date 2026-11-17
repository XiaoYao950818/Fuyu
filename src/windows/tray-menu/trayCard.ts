import type { MediaState } from "../../features/media/api";

export type TrayMedia = {
  title: string | null;
  artist: string | null;
  source: string | null;
  thumbnail: string | null;
  playing: boolean;
  progress: number;
  canNext: boolean;
};

export function trayMedia(state: MediaState): TrayMedia | null {
  if (!state.available || state.playbackStatus === "unavailable") return null;
  if (!state.title && !state.artist) return null;
  return {
    title: state.title,
    artist: state.artist,
    source: state.sourceApp,
    thumbnail: state.thumbnail,
    playing: state.playbackStatus === "playing",
    progress: state.durationMs > 0 ? Math.min(1, Math.max(0, state.positionMs / state.durationMs)) : 0,
    canNext: state.canNext,
  };
}
