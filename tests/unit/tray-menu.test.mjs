import assert from "node:assert/strict";
import test from "node:test";
import { trayMedia } from "../../src/windows/tray-menu/trayCard.ts";
import { normalizeTrayMenuLayout } from "../../src/windows/tray-menu/storage.ts";
import { entryShown, shownFeatures, shownStatus } from "../../src/windows/tray-menu/builtinEntries.ts";

test("the tray card layout falls back to the shortcuts layout", () => {
  assert.equal(normalizeTrayMenuLayout("status"), "status");
  assert.equal(normalizeTrayMenuLayout("compact"), "compact");
  assert.equal(normalizeTrayMenuLayout(null), "entry");
  assert.equal(normalizeTrayMenuLayout("\"status\""), "entry");
});

test("media shows only when something is loaded", () => {
  const media = { available: true, playbackStatus: "paused", title: "Song", artist: null, sourceApp: "App", thumbnail: null, positionMs: 50, durationMs: 100, canNext: false };
  assert.deepEqual(trayMedia(media), { title: "Song", artist: null, source: "App", thumbnail: null, playing: false, progress: 0.5, canNext: false });
  assert.equal(trayMedia({ ...media, playbackStatus: "unavailable" }), null);
  assert.equal(trayMedia({ ...media, title: null }), null);
});

test("tray card page names map onto island pages and nothing else gets through", async () => {
  const { trayMenuIslandPage } = await import("../../src/windows/island/trayMenuPage.ts");
  assert.equal(trayMenuIslandPage("file-shelf"), "shelf");
  assert.equal(trayMenuIslandPage("settings"), null);
  assert.equal(trayMenuIslandPage("toString"), null);
  assert.equal(trayMenuIslandPage(3), null);
});

test("tray card entries follow the built-in plugin switches", () => {
  const off = new Set(["music", "clipboard"]);
  assert.equal(entryShown(off, "music"), false);
  assert.equal(entryShown(off, "clipboard"), false);
  assert.equal(entryShown(off, "file-shelf"), true);
  assert.deepEqual(shownFeatures(off, ["screenshot", "clipboard"]), ["screenshot"]);
  const status = shownStatus({ media: { title: "x" }, now: 1 }, off);
  assert.equal(status.media, null);
  assert.equal(status.now, 1);
});
