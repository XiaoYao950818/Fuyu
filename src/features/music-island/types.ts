export type MusicIslandSettings = {
  enabled: boolean;
};

export type MusicIslandSnapshot = {
  available: boolean;
  playing: boolean;
  title: string | null;
  artist: string | null;
  durationMs: number;
  trackKey: string | null;
};

export type MusicIslandWatch = {
  shown: boolean;
  trackKey: string | null;
};

export type MusicIslandAction = "show" | "hide" | "none";

export type MusicIslandDecision = {
  action: MusicIslandAction;
  watch: MusicIslandWatch;
};

export type LyricLineRef = {
  timeMs: number;
  text: string;
};

export type LyricWindow = {
  previous: LyricLineRef | null;
  current: LyricLineRef | null;
  next: LyricLineRef | null;
  index: number;
};
