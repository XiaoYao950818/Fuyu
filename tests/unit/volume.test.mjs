import assert from "node:assert/strict";
import test from "node:test";
import {
  clampVolume,
  normalizeVolumeSession,
  normalizeVolumeSessions,
  normalizeVolumeState,
  percentToVolume,
  sessionDisplayName,
  sortVolumeSessions,
  volumeToPercent,
} from "../../src/features/volume/volume.ts";
import { DEFAULT_VOLUME_SETTINGS, loadVolumeSettings, normalizeVolumeSettings } from "../../src/features/volume/storage.ts";

const SESSION = { id: "1234", name: "Spotify", processId: 1234, volume: 0.5, muted: false, icon: null };

test("volumes clamp to 0..1 and round-trip through percent", () => {
  assert.equal(clampVolume(0), 0);
  assert.equal(clampVolume(0.5), 0.5);
  assert.equal(clampVolume(1), 1);
  assert.equal(clampVolume(-0.2), 0);
  assert.equal(clampVolume(1.4), 1);
  assert.equal(clampVolume(Number.NaN), 0);
  assert.equal(clampVolume(Number.POSITIVE_INFINITY), 0);
  assert.equal(volumeToPercent(0), 0);
  assert.equal(volumeToPercent(0.5), 50);
  assert.equal(volumeToPercent(0.754), 75);
  assert.equal(volumeToPercent(1), 100);
  assert.equal(volumeToPercent(-1), 0);
  assert.equal(volumeToPercent(Number.NaN), 0);
  assert.equal(percentToVolume(0), 0);
  assert.equal(percentToVolume(50), 0.5);
  assert.equal(percentToVolume(100), 1);
  assert.equal(percentToVolume(-10), 0);
  assert.equal(percentToVolume(140), 1);
  assert.equal(percentToVolume(Number.NaN), 0);
});

test("a broken session is dropped and a good one keeps its fields", () => {
  assert.deepEqual(normalizeVolumeSession(SESSION), SESSION);
  assert.equal(normalizeVolumeSession(undefined), null);
  assert.equal(normalizeVolumeSession(null), null);
  assert.equal(normalizeVolumeSession("spotify"), null);
  assert.equal(normalizeVolumeSession([]), null);
  assert.equal(normalizeVolumeSession({}), null);
  assert.equal(normalizeVolumeSession({ ...SESSION, id: "" }), null);
  assert.equal(normalizeVolumeSession({ ...SESSION, processId: -1 }), null);
  assert.equal(normalizeVolumeSession({ ...SESSION, processId: 1.5 }), null);
  assert.equal(normalizeVolumeSession({ ...SESSION, processId: "1234" }), null);
  assert.deepEqual(normalizeVolumeSession({ ...SESSION, volume: 2 }), { ...SESSION, volume: 1 });
  assert.deepEqual(normalizeVolumeSession({ ...SESSION, volume: Number.NaN }), { ...SESSION, volume: 0 });
  assert.deepEqual(normalizeVolumeSession({ ...SESSION, volume: "loud" }), { ...SESSION, volume: 0 });
  assert.deepEqual(normalizeVolumeSession({ ...SESSION, muted: 1 }), { ...SESSION, muted: false });
  assert.deepEqual(normalizeVolumeSession({ ...SESSION, name: 3 }), { ...SESSION, name: "" });
  assert.deepEqual(normalizeVolumeSession({ ...SESSION, icon: "" }), { ...SESSION, icon: null });
  assert.deepEqual(normalizeVolumeSession({ ...SESSION, icon: 3 }), { ...SESSION, icon: null });
});

test("session lists drop broken and duplicated entries", () => {
  assert.deepEqual(normalizeVolumeSessions(undefined), []);
  assert.deepEqual(normalizeVolumeSessions({}), []);
  assert.deepEqual(normalizeVolumeSessions([]), []);
  assert.deepEqual(normalizeVolumeSessions([SESSION, SESSION, null, { id: "9", name: "", processId: 9, volume: 0, muted: true, icon: null }]), [
    SESSION,
    { id: "9", name: "", processId: 9, volume: 0, muted: true, icon: null },
  ]);
});

test("broken states fall back to an empty, unavailable state shape", () => {
  assert.equal(normalizeVolumeState(undefined), null);
  assert.equal(normalizeVolumeState(null), null);
  assert.equal(normalizeVolumeState("loud"), null);
  assert.equal(normalizeVolumeState([]), null);
  assert.deepEqual(normalizeVolumeState({}), { available: false, level: 0, muted: false, outputName: null, sessions: [] });
  assert.deepEqual(normalizeVolumeState({ available: true, level: 0.8, muted: true, outputName: "Speakers", sessions: [SESSION, SESSION] }), {
    available: true,
    level: 0.8,
    muted: true,
    outputName: "Speakers",
    sessions: [SESSION],
  });
  assert.deepEqual(normalizeVolumeState({ available: true, level: 3, outputName: "", sessions: "none" }), {
    available: true,
    level: 1,
    muted: false,
    outputName: null,
    sessions: [],
  });
});

test("sessions sort by name with unnamed ones last", () => {
  const unnamed = { id: "0", name: "", processId: 0, volume: 0.5, muted: false, icon: null };
  const firefox = { id: "7", name: "Firefox", processId: 7, volume: 0.5, muted: false, icon: null };
  const spotify = { id: "9", name: "Spotify", processId: 9, volume: 0.5, muted: false, icon: null };
  assert.deepEqual(sortVolumeSessions([spotify, unnamed, firefox]), [firefox, spotify, unnamed]);
  assert.deepEqual(sortVolumeSessions([]), []);
});

test("unnamed sessions fall back to system sounds or unknown app", () => {
  assert.equal(sessionDisplayName(SESSION, "System sounds", "Unknown app"), "Spotify");
  assert.equal(sessionDisplayName({ ...SESSION, name: "  " }, "System sounds", "Unknown app"), "Unknown app");
  assert.equal(sessionDisplayName({ id: "0", name: "", processId: 0, volume: 0.5, muted: false, icon: null }, "System sounds", "Unknown app"), "System sounds");
});

test("missing or broken stored settings fall back to showing the volume", () => {
  assert.deepEqual(DEFAULT_VOLUME_SETTINGS, { enabled: true });
  assert.deepEqual(normalizeVolumeSettings(undefined), DEFAULT_VOLUME_SETTINGS);
  assert.deepEqual(normalizeVolumeSettings(null), DEFAULT_VOLUME_SETTINGS);
  assert.deepEqual(normalizeVolumeSettings("enabled"), DEFAULT_VOLUME_SETTINGS);
  assert.deepEqual(normalizeVolumeSettings(1), DEFAULT_VOLUME_SETTINGS);
  assert.deepEqual(normalizeVolumeSettings(true), DEFAULT_VOLUME_SETTINGS);
  assert.deepEqual(normalizeVolumeSettings([]), DEFAULT_VOLUME_SETTINGS);
  assert.deepEqual(normalizeVolumeSettings({}), DEFAULT_VOLUME_SETTINGS);
  assert.deepEqual(loadVolumeSettings(), DEFAULT_VOLUME_SETTINGS);
});

test("only an explicit false turns the volume off", () => {
  assert.deepEqual(normalizeVolumeSettings({ enabled: false }), { enabled: false });
  assert.deepEqual(normalizeVolumeSettings({ enabled: true }), { enabled: true });
  assert.deepEqual(normalizeVolumeSettings({ enabled: false, other: 1 }), { enabled: false });
});
