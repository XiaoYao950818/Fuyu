import type { LyricLineRef, LyricWindow, MusicIslandAction, MusicIslandDecision, MusicIslandSnapshot, MusicIslandWatch } from "./types.ts";

export const MUSIC_ISLAND_POLL_MS = 1500;

export const MUSIC_ISLAND_EXIT_FALLBACK_MS = 400;

export function trackKeyOf(title: string | null, artist: string | null, durationMs: number): string | null {
  if (title === null) return null;
  return `${title}\u001f${artist ?? ""}\u001f${Math.round(durationMs / 2000)}`;
}

function cleanText(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}

function cleanDuration(value: unknown): number {
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0) return 0;
  return Math.floor(value);
}

export function normalizeMusicIslandSnapshot(value: unknown): MusicIslandSnapshot | null {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return null;
  const state = value as Record<string, unknown>;
  const title = cleanText(state.title);
  const artist = cleanText(state.artist);
  const durationMs = cleanDuration(state.durationMs);
  return {
    available: state.available === true,
    playing: state.playbackStatus === "playing",
    title,
    artist,
    durationMs,
    trackKey: trackKeyOf(title, artist, durationMs),
  };
}

export function decideMusicIsland(
  snapshot: MusicIslandSnapshot | null,
  enabled: boolean,
  watch: MusicIslandWatch,
): MusicIslandDecision {
  const playable = enabled && snapshot !== null && snapshot.available && snapshot.playing && snapshot.title !== null;
  if (!playable) {
    const action: MusicIslandAction = watch.shown ? "hide" : "none";
    return { action, watch: { shown: false, trackKey: null } };
  }
  if (!watch.shown || watch.trackKey !== snapshot.trackKey) {
    return { action: "show", watch: { shown: true, trackKey: snapshot.trackKey } };
  }
  return { action: "none", watch };
}

export function lyricWindow(lines: readonly LyricLineRef[], positionMs: number): LyricWindow {
  const at = Math.max(0, positionMs);
  const sung = lines.filter((line) => line.text.trim() !== "");
  if (sung.length === 0) return { previous: null, current: null, next: null, index: -1 };
  let low = 0;
  let high = sung.length - 1;
  let found = -1;
  while (low <= high) {
    const middle = (low + high) >> 1;
    if (sung[middle].timeMs <= at) {
      found = middle;
      low = middle + 1;
    } else {
      high = middle - 1;
    }
  }
  if (found < 0) return { previous: null, current: null, next: sung[0], index: -1 };
  return {
    previous: found > 0 ? sung[found - 1] : null,
    current: sung[found],
    next: found + 1 < sung.length ? sung[found + 1] : null,
    index: found,
  };
}
