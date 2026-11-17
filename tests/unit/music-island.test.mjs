import assert from "node:assert/strict";
import test from "node:test";
import {
  MUSIC_ISLAND_EXIT_FALLBACK_MS,
  MUSIC_ISLAND_POLL_MS,
  decideMusicIsland,
  lyricWindow,
  normalizeMusicIslandSnapshot,
  trackKeyOf,
} from "../../src/features/music-island/musicIsland.ts";
import { DEFAULT_MUSIC_ISLAND_SETTINGS, loadMusicIslandSettings, normalizeMusicIslandSettings } from "../../src/features/music-island/storage.ts";

const PLAYING = {
  available: true,
  playbackStatus: "playing",
  title: "夜曲",
  artist: "周杰伦",
  durationMs: 240_000,
};
const HIDDEN = { shown: false, trackKey: null };

test("track keys are null without a title and bucket the duration", () => {
  assert.equal(trackKeyOf(null, "周杰伦", 240_000), null);
  assert.equal(trackKeyOf("夜曲", "周杰伦", 240_000), "夜曲\u001f周杰伦\u001f120");
  assert.equal(trackKeyOf("夜曲", null, 240_000), "夜曲\u001f\u001f120");
  assert.equal(trackKeyOf("夜曲", "周杰伦", 240_999), "夜曲\u001f周杰伦\u001f120");
  assert.equal(trackKeyOf("夜曲", "周杰伦", 241_000), "夜曲\u001f周杰伦\u001f121");
});

test("broken media payloads fall back to no snapshot", () => {
  assert.equal(normalizeMusicIslandSnapshot(undefined), null);
  assert.equal(normalizeMusicIslandSnapshot(null), null);
  assert.equal(normalizeMusicIslandSnapshot("playing"), null);
  assert.equal(normalizeMusicIslandSnapshot([]), null);
  assert.deepEqual(normalizeMusicIslandSnapshot({}), {
    available: false,
    playing: false,
    title: null,
    artist: null,
    durationMs: 0,
    trackKey: null,
  });
  assert.deepEqual(normalizeMusicIslandSnapshot(PLAYING), {
    available: true,
    playing: true,
    title: "夜曲",
    artist: "周杰伦",
    durationMs: 240_000,
    trackKey: "夜曲\u001f周杰伦\u001f120",
  });
});

test("snapshots keep the playing flag and clean up the fields", () => {
  assert.equal(normalizeMusicIslandSnapshot({ ...PLAYING, playbackStatus: "paused" })?.playing, false);
  assert.equal(normalizeMusicIslandSnapshot({ ...PLAYING, playbackStatus: "unavailable" })?.playing, false);
  assert.equal(normalizeMusicIslandSnapshot({ ...PLAYING, available: "yes" })?.available, false);
  assert.deepEqual(normalizeMusicIslandSnapshot({ ...PLAYING, title: "   " }), {
    available: true,
    playing: true,
    title: null,
    artist: "周杰伦",
    durationMs: 240_000,
    trackKey: null,
  });
  assert.equal(normalizeMusicIslandSnapshot({ ...PLAYING, title: 3 })?.title, null);
  assert.equal(normalizeMusicIslandSnapshot({ ...PLAYING, artist: "" })?.artist, null);
  assert.equal(normalizeMusicIslandSnapshot({ ...PLAYING, durationMs: -5 })?.durationMs, 0);
  assert.equal(normalizeMusicIslandSnapshot({ ...PLAYING, durationMs: Number.NaN })?.durationMs, 0);
  assert.equal(normalizeMusicIslandSnapshot({ ...PLAYING, durationMs: "240000" })?.durationMs, 0);
});

test("the island only pops out while music is playing", () => {
  const snapshot = normalizeMusicIslandSnapshot(PLAYING);
  assert.deepEqual(decideMusicIsland(snapshot, true, HIDDEN), {
    action: "show",
    watch: { shown: true, trackKey: "夜曲\u001f周杰伦\u001f120" },
  });
  assert.deepEqual(decideMusicIsland(snapshot, true, { shown: true, trackKey: "夜曲\u001f周杰伦\u001f120" }), {
    action: "none",
    watch: { shown: true, trackKey: "夜曲\u001f周杰伦\u001f120" },
  });
  assert.deepEqual(decideMusicIsland(snapshot, false, { shown: true, trackKey: "夜曲\u001f周杰伦\u001f120" }), {
    action: "hide",
    watch: HIDDEN,
  });
  assert.deepEqual(decideMusicIsland(snapshot, false, HIDDEN), { action: "none", watch: HIDDEN });
  assert.deepEqual(decideMusicIsland(null, true, { shown: true, trackKey: "夜曲\u001f周杰伦\u001f120" }), {
    action: "hide",
    watch: HIDDEN,
  });
  assert.deepEqual(decideMusicIsland(null, true, HIDDEN), { action: "none", watch: HIDDEN });
});

test("paused, unavailable and untitled sessions fold the island away", () => {
  const shown = { shown: true, trackKey: "夜曲\u001f周杰伦\u001f120" };
  const paused = normalizeMusicIslandSnapshot({ ...PLAYING, playbackStatus: "paused" });
  assert.deepEqual(decideMusicIsland(paused, true, shown), { action: "hide", watch: HIDDEN });
  assert.deepEqual(decideMusicIsland(paused, true, HIDDEN), { action: "none", watch: HIDDEN });
  const unavailable = normalizeMusicIslandSnapshot({ ...PLAYING, available: false });
  assert.deepEqual(decideMusicIsland(unavailable, true, shown), { action: "hide", watch: HIDDEN });
  const untitled = normalizeMusicIslandSnapshot({ ...PLAYING, title: null });
  assert.deepEqual(decideMusicIsland(untitled, true, shown), { action: "hide", watch: HIDDEN });
});

test("a new track pops the island out again after it was closed", () => {
  const next = normalizeMusicIslandSnapshot({ ...PLAYING, title: "晴天", durationMs: 300_000 });
  assert.deepEqual(decideMusicIsland(next, true, { shown: true, trackKey: "夜曲\u001f周杰伦\u001f120" }), {
    action: "show",
    watch: { shown: true, trackKey: "晴天\u001f周杰伦\u001f150" },
  });
  assert.deepEqual(decideMusicIsland(next, true, HIDDEN), {
    action: "show",
    watch: { shown: true, trackKey: "晴天\u001f周杰伦\u001f150" },
  });
});

const LINES = [
  { timeMs: 0, text: "第一句" },
  { timeMs: 5_000, text: "第二句" },
  { timeMs: 10_000, text: "第三句" },
  { timeMs: 15_000, text: "第四句" },
];

test("lyric windows follow the playback position", () => {
  assert.deepEqual(lyricWindow([], 5_000), { previous: null, current: null, next: null, index: -1 });
  assert.deepEqual(lyricWindow(LINES, -100), { previous: null, current: LINES[0], next: LINES[1], index: 0 });
  assert.deepEqual(lyricWindow(LINES, 0), { previous: null, current: LINES[0], next: LINES[1], index: 0 });
  assert.deepEqual(lyricWindow(LINES, 4_999), { previous: null, current: LINES[0], next: LINES[1], index: 0 });
  assert.deepEqual(lyricWindow(LINES, 5_000), { previous: LINES[0], current: LINES[1], next: LINES[2], index: 1 });
  assert.deepEqual(lyricWindow(LINES, 12_000), { previous: LINES[1], current: LINES[2], next: LINES[3], index: 2 });
  assert.deepEqual(lyricWindow(LINES, 99_000), { previous: LINES[2], current: LINES[3], next: null, index: 3 });
});

test("blank lyric lines are skipped and repeated times take the last line", () => {
  const lines = [
    { timeMs: 0, text: "  " },
    { timeMs: 1_000, text: "唱" },
    { timeMs: 2_000, text: "" },
    { timeMs: 3_000, text: "和" },
    { timeMs: 3_000, text: "和声" },
  ];
  assert.deepEqual(lyricWindow(lines, 500), { previous: null, current: null, next: { timeMs: 1_000, text: "唱" }, index: -1 });
  assert.deepEqual(lyricWindow(lines, 3_000), {
    previous: { timeMs: 3_000, text: "和" },
    current: { timeMs: 3_000, text: "和声" },
    next: null,
    index: 2,
  });
  assert.deepEqual(lyricWindow([{ timeMs: 0, text: " " }], 0), { previous: null, current: null, next: null, index: -1 });
});

test("the music island polls on the same beat as the island media state and waits out its exit", () => {
  assert.equal(MUSIC_ISLAND_POLL_MS, 1500);
  assert.equal(MUSIC_ISLAND_EXIT_FALLBACK_MS, 400);
});

test("music island settings default to on and only an explicit off turns them off", () => {
  assert.deepEqual(DEFAULT_MUSIC_ISLAND_SETTINGS, { enabled: true });
  assert.deepEqual(normalizeMusicIslandSettings(undefined), { enabled: true });
  assert.deepEqual(normalizeMusicIslandSettings(null), { enabled: true });
  assert.deepEqual(normalizeMusicIslandSettings("on"), { enabled: true });
  assert.deepEqual(normalizeMusicIslandSettings([]), { enabled: true });
  assert.deepEqual(normalizeMusicIslandSettings({}), { enabled: true });
  assert.deepEqual(normalizeMusicIslandSettings({ enabled: false }), { enabled: false });
  assert.deepEqual(normalizeMusicIslandSettings({ enabled: true }), { enabled: true });
  assert.deepEqual(normalizeMusicIslandSettings({ enabled: "yes" }), { enabled: true });
  assert.deepEqual(loadMusicIslandSettings(), { enabled: true });
});
