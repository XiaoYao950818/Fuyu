import assert from "node:assert/strict";
import test from "node:test";
import { formatRate } from "../../src/features/net-speed/speed.ts";
import { DEFAULT_NET_SPEED_SETTINGS, loadNetSpeedSettings, normalizeNetSpeedSettings } from "../../src/features/net-speed/storage.ts";

test("rates read as bytes per second with B, KB, MB and GB units", () => {
  assert.equal(formatRate(0), "0 B/s");
  assert.equal(formatRate(820), "820 B/s");
  assert.equal(formatRate(1024), "1.0 KB/s");
  assert.equal(formatRate(12.4 * 1024), "12 KB/s");
  assert.equal(formatRate(2_150_400), "2.1 MB/s");
  assert.equal(formatRate(5 * 1024 ** 3), "5.0 GB/s");
  assert.equal(formatRate(Number.NaN), "0 B/s");
  assert.equal(formatRate(-5), "0 B/s");
});

test("missing or broken stored settings fall back to showing the speed", () => {
  assert.deepEqual(DEFAULT_NET_SPEED_SETTINGS, { enabled: true });
  assert.deepEqual(normalizeNetSpeedSettings(undefined), DEFAULT_NET_SPEED_SETTINGS);
  assert.deepEqual(normalizeNetSpeedSettings(null), DEFAULT_NET_SPEED_SETTINGS);
  assert.deepEqual(normalizeNetSpeedSettings("enabled"), DEFAULT_NET_SPEED_SETTINGS);
  assert.deepEqual(normalizeNetSpeedSettings(1), DEFAULT_NET_SPEED_SETTINGS);
  assert.deepEqual(normalizeNetSpeedSettings(true), DEFAULT_NET_SPEED_SETTINGS);
  assert.deepEqual(normalizeNetSpeedSettings([]), DEFAULT_NET_SPEED_SETTINGS);
  assert.deepEqual(normalizeNetSpeedSettings({}), DEFAULT_NET_SPEED_SETTINGS);
  assert.deepEqual(loadNetSpeedSettings(), DEFAULT_NET_SPEED_SETTINGS);
});

test("only an explicit false turns the speed off", () => {
  assert.deepEqual(normalizeNetSpeedSettings({ enabled: false }), { enabled: false });
  assert.deepEqual(normalizeNetSpeedSettings({ enabled: true }), { enabled: true });
  assert.deepEqual(normalizeNetSpeedSettings({ enabled: false, other: 1 }), { enabled: false });
});
