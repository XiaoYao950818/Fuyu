import assert from "node:assert/strict";
import test from "node:test";
import {
  batteryIconKind,
  batteryPercentText,
  levelKey,
  normalizeDeviceBatteries,
  normalizeDeviceBattery,
  stateKey,
} from "../../src/features/device-battery/battery.ts";
import {
  DEFAULT_DEVICE_BATTERY_SETTINGS,
  DEVICE_BATTERY_KEY,
  loadDeviceBatterySettings,
  normalizeDeviceBatterySettings,
  saveDeviceBatterySettings,
} from "../../src/features/device-battery/storage.ts";

function withWindow(windowValue, run) {
  const descriptor = Object.getOwnPropertyDescriptor(globalThis, "window");
  Object.defineProperty(globalThis, "window", { configurable: true, value: windowValue });
  try {
    run();
  } finally {
    if (descriptor) Object.defineProperty(globalThis, "window", descriptor);
    else delete globalThis.window;
  }
}

function memoryStorage(initial = []) {
  const values = new Map(initial);
  return {
    values,
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, String(value)),
    removeItem: (key) => values.delete(key),
  };
}

function battery(overrides = {}) {
  return { id: "gpw4", name: "PRO X SUPERLIGHT 2c", available: true, percent: 95, level: 8, state: 0, ...overrides };
}

test("HID++ battery levels map 8/4/2/1 to full, good, low and critical", () => {
  assert.equal(levelKey(8), "full");
  assert.equal(levelKey(4), "good");
  assert.equal(levelKey(2), "low");
  assert.equal(levelKey(1), "critical");
  for (const level of [null, 0, 3, 5, 6, 7, 9, 16, 255, -1]) assert.equal(levelKey(level), null, String(level));
});

test("HID++ battery states map 0/1/2/3 to discharging, charging, almost full and full", () => {
  assert.equal(stateKey(0), "discharging");
  assert.equal(stateKey(1), "charging");
  assert.equal(stateKey(2), "almostFull");
  assert.equal(stateKey(3), "full");
  for (const state of [null, 4, 5, 255, -1]) assert.equal(stateKey(state), null, String(state));
});

test("the icon follows availability, charging and the charge band", () => {
  assert.equal(batteryIconKind(battery({ available: false })), "unknown");
  assert.equal(batteryIconKind(battery({ percent: null })), "unknown");
  assert.equal(batteryIconKind(battery({ percent: 20, state: 1 })), "charging");
  assert.equal(batteryIconKind(battery({ percent: 100 })), "full");
  assert.equal(batteryIconKind(battery({ percent: 80 })), "full");
  assert.equal(batteryIconKind(battery({ percent: 79 })), "medium");
  assert.equal(batteryIconKind(battery({ percent: 30 })), "medium");
  assert.equal(batteryIconKind(battery({ percent: 29 })), "low");
  assert.equal(batteryIconKind(battery({ percent: 0 })), "low");
});

test("the percent text only shows for a connected device with a reading", () => {
  assert.equal(batteryPercentText(battery({ percent: 95 })), "95%");
  assert.equal(batteryPercentText(battery({ percent: 0 })), "0%");
  assert.equal(batteryPercentText(battery({ available: false })), null);
  assert.equal(batteryPercentText(battery({ percent: null })), null);
});

test("a well-formed battery record passes through unchanged", () => {
  assert.deepEqual(normalizeDeviceBattery(battery()), battery());
  assert.deepEqual(normalizeDeviceBattery(battery({ percent: 35, level: 4, state: 1 })), battery({ percent: 35, level: 4, state: 1 }));
  assert.deepEqual(normalizeDeviceBattery(battery({ available: false, percent: null, level: null, state: null })), battery({ available: false, percent: null, level: null, state: null }));
});

test("records without an id or a name are dropped", () => {
  for (const value of [null, undefined, "gpw4", 1, [], {}, { name: "Mouse" }, { id: "gpw4" }, { id: "", name: "Mouse" }, { id: "gpw4", name: "" }, { id: 1, name: "Mouse" }, { id: "gpw4", name: 2 }]) {
    assert.equal(normalizeDeviceBattery(value), null, JSON.stringify(value));
  }
});

test("an out-of-range or non-integer percent reads as no reading instead of a wrong number", () => {
  for (const percent of [101, 255, -1, 95.5, "95", Number.NaN]) {
    assert.deepEqual(normalizeDeviceBattery(battery({ percent })), battery({ percent: null }), String(percent));
  }
  assert.deepEqual(normalizeDeviceBattery(battery({ percent: 100 })), battery({ percent: 100 }));
  assert.deepEqual(normalizeDeviceBattery(battery({ percent: 0 })), battery({ percent: 0 }));
});

test("bad level and state bytes read as unknown instead of crashing the row", () => {
  assert.deepEqual(normalizeDeviceBattery(battery({ level: "8" })), battery({ level: null }));
  assert.deepEqual(normalizeDeviceBattery(battery({ level: 300 })), battery({ level: null }));
  assert.deepEqual(normalizeDeviceBattery(battery({ state: "1" })), battery({ state: null }));
  assert.deepEqual(normalizeDeviceBattery(battery({ state: -1 })), battery({ state: null }));
  assert.deepEqual(normalizeDeviceBattery(battery({ level: 9, state: 7 })), battery({ level: 9, state: 7 }));
  assert.deepEqual(normalizeDeviceBattery(battery({ available: "yes" })), battery({ available: false }));
});

test("a battery list keeps valid rows, drops bad ones and keeps the first of a duplicated id", () => {
  assert.deepEqual(normalizeDeviceBatteries(null), []);
  assert.deepEqual(normalizeDeviceBatteries("gpw4"), []);
  assert.deepEqual(normalizeDeviceBatteries({}), []);
  assert.deepEqual(normalizeDeviceBatteries([]), []);
  assert.deepEqual(normalizeDeviceBatteries([battery(), { junk: true }, battery({ id: "gpw4", percent: 50 }), battery({ id: "mx-master-4", name: "MX Master 4", percent: 70, level: 8, state: 0 })]), [
    battery(),
    battery({ id: "mx-master-4", name: "MX Master 4", percent: 70, level: 8, state: 0 }),
  ]);
});

test("missing or broken stored settings fall back to showing the batteries", () => {
  assert.deepEqual(DEFAULT_DEVICE_BATTERY_SETTINGS, { enabled: true });
  assert.deepEqual(normalizeDeviceBatterySettings(undefined), DEFAULT_DEVICE_BATTERY_SETTINGS);
  assert.deepEqual(normalizeDeviceBatterySettings(null), DEFAULT_DEVICE_BATTERY_SETTINGS);
  assert.deepEqual(normalizeDeviceBatterySettings("enabled"), DEFAULT_DEVICE_BATTERY_SETTINGS);
  assert.deepEqual(normalizeDeviceBatterySettings([]), DEFAULT_DEVICE_BATTERY_SETTINGS);
  assert.deepEqual(normalizeDeviceBatterySettings({}), DEFAULT_DEVICE_BATTERY_SETTINGS);
  assert.deepEqual(loadDeviceBatterySettings(), DEFAULT_DEVICE_BATTERY_SETTINGS);
});

test("only an explicit false turns the batteries off", () => {
  assert.deepEqual(normalizeDeviceBatterySettings({ enabled: false }), { enabled: false });
  assert.deepEqual(normalizeDeviceBatterySettings({ enabled: true }), { enabled: true });
  assert.deepEqual(normalizeDeviceBatterySettings({ enabled: false, other: 1 }), { enabled: false });
});

test("corrupted stored JSON falls back to defaults and settings round-trip through storage", () => {
  const storage = memoryStorage([[DEVICE_BATTERY_KEY, "{not json"]]);
  withWindow({ localStorage: storage }, () => {
    assert.deepEqual(loadDeviceBatterySettings(), DEFAULT_DEVICE_BATTERY_SETTINGS);
  });
  const empty = memoryStorage();
  withWindow({ localStorage: empty }, () => {
    assert.equal(saveDeviceBatterySettings({ enabled: false }), true);
    assert.equal(empty.values.get(DEVICE_BATTERY_KEY), JSON.stringify({ enabled: false }));
    assert.deepEqual(loadDeviceBatterySettings(), { enabled: false });
  });
});
