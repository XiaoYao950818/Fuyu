import assert from "node:assert/strict";
import test from "node:test";
import { LINE_PRIORITY } from "../../src/features/plugin-kernel/islandContributions.ts";
import { lyricLineContribution } from "../../src/features/media/plugin/lyricLine.ts";

const t = { island: { nowPlaying: (text) => `Now playing: ${text}`, lyricLine: (text) => `Lyric: ${text}` } };
const lyric = (text) => lyricLineContribution({ text, song: false, longest: "a long line" }, t);

test("the lyric line takes the lyrics priority on the bar", () => {
  assert.equal(lyric("la la").priority, LINE_PRIORITY.lyrics);
  assert.equal(lyric("la la").label, "Lyric: la la");
  assert.equal(lyricLineContribution(null, t), null);
});
