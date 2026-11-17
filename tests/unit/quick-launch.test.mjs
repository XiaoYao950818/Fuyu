import assert from "node:assert/strict";
import test from "node:test";
import { baseName, buildLaunchItem, normalizeLaunchUrl } from "../../src/features/quick-launch/launch.ts";
import {
  DEFAULT_QUICK_LAUNCH_SETTINGS,
  QUICK_LAUNCH_KEY,
  loadQuickLaunchSettings,
  normalizeQuickLaunchSettings,
  saveQuickLaunchSettings,
} from "../../src/features/quick-launch/storage.ts";

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

function item(overrides = {}) {
  return { id: "1", name: "Docs", target: "example.com/docs", kind: "url", ...overrides };
}

test("a URL without a scheme gets https, one with a scheme is left alone", () => {
  assert.equal(normalizeLaunchUrl("example.com"), "https://example.com");
  assert.equal(normalizeLaunchUrl("example.com/path?q=1"), "https://example.com/path?q=1");
  assert.equal(normalizeLaunchUrl("www.example.com"), "https://www.example.com");
  assert.equal(normalizeLaunchUrl("example.com:8080/app"), "https://example.com:8080/app");
  assert.equal(normalizeLaunchUrl("http://example.com"), "http://example.com");
  assert.equal(normalizeLaunchUrl("https://example.com/x"), "https://example.com/x");
  assert.equal(normalizeLaunchUrl("HTTP://EXAMPLE.COM"), "HTTP://EXAMPLE.COM");
  assert.equal(normalizeLaunchUrl("ftp://files.example.com/x"), "ftp://files.example.com/x");
  assert.equal(normalizeLaunchUrl("my-app://open"), "my-app://open");
});

test("surrounding whitespace is trimmed before the scheme check", () => {
  assert.equal(normalizeLaunchUrl("  example.com  "), "https://example.com");
  assert.equal(normalizeLaunchUrl("  https://example.com  "), "https://example.com");
});

test("the file browser fills the name from the picked path", () => {
  assert.equal(baseName("C:\\Program Files\\My App\\app.exe"), "app");
  assert.equal(baseName("/usr/local/bin/tool"), "tool");
  assert.equal(baseName("D:\\Games\\folder\\"), "folder");
  assert.equal(baseName("archive.tar.gz"), "archive.tar");
  assert.equal(baseName("notes"), "notes");
  assert.equal(baseName(".hidden"), ".hidden");
  assert.equal(baseName(""), "");
});

test("a launch item needs a name, a target and an id, and both texts are trimmed", () => {
  assert.deepEqual(buildLaunchItem("  Docs  ", "  example.com/docs  ", "url", "1"), item());
  assert.deepEqual(buildLaunchItem("Notepad", "C:\\Windows\\notepad.exe", "app", "2"), item({ id: "2", name: "Notepad", target: "C:\\Windows\\notepad.exe", kind: "app" }));
  for (const [name, target, id] of [
    ["", "example.com", "1"],
    ["   ", "example.com", "1"],
    ["Docs", "", "1"],
    ["Docs", "   ", "1"],
    ["Docs", "example.com", ""],
  ]) {
    assert.equal(buildLaunchItem(name, target, "url", id), null, JSON.stringify([name, target, id]));
  }
});

test("missing or broken stored settings fall back to an empty enabled list", () => {
  assert.deepEqual(DEFAULT_QUICK_LAUNCH_SETTINGS, { enabled: true, items: [] });
  for (const value of [undefined, null, "items", 1, true, {}]) {
    assert.deepEqual(normalizeQuickLaunchSettings(value), { enabled: true, items: [] }, JSON.stringify(value));
  }
  assert.deepEqual(loadQuickLaunchSettings(), DEFAULT_QUICK_LAUNCH_SETTINGS);
});

test("a bare array of items is read as the old format", () => {
  assert.deepEqual(normalizeQuickLaunchSettings([item()]), { enabled: true, items: [item()] });
  assert.deepEqual(normalizeQuickLaunchSettings([item(), { junk: true }]), { enabled: true, items: [item()] });
});

test("bad items are dropped, good ones are trimmed and the first of a duplicated id wins", () => {
  const settings = normalizeQuickLaunchSettings({
    enabled: false,
    items: [
      item({ name: "  Docs  ", target: "  example.com/docs  " }),
      { id: "2", name: "", target: "example.com", kind: "url" },
      { id: "3", name: "No target", target: "", kind: "url" },
      { id: "4", name: "No kind", target: "example.com" },
      { id: "5", name: "Bad kind", target: "example.com", kind: "site" },
      { name: "No id", target: "example.com", kind: "url" },
      item({ id: "1", name: "Duplicate", target: "other.example.com" }),
      "not an item",
      null,
    ],
  });
  assert.deepEqual(settings, { enabled: false, items: [item()] });
});

test("items without an array, or with a non-array value, read as empty", () => {
  assert.deepEqual(normalizeQuickLaunchSettings({ enabled: true, items: "x" }), { enabled: true, items: [] });
  assert.deepEqual(normalizeQuickLaunchSettings({ enabled: true }), { enabled: true, items: [] });
  assert.deepEqual(normalizeQuickLaunchSettings({ enabled: false, items: [item()] }), { enabled: false, items: [item()] });
});

test("corrupted stored JSON falls back to defaults and settings round-trip through storage", () => {
  const storage = memoryStorage([[QUICK_LAUNCH_KEY, "{not json"]]);
  withWindow({ localStorage: storage }, () => {
    assert.deepEqual(loadQuickLaunchSettings(), DEFAULT_QUICK_LAUNCH_SETTINGS);
  });
  const oldFormat = memoryStorage([[QUICK_LAUNCH_KEY, JSON.stringify([item()])]]);
  withWindow({ localStorage: oldFormat }, () => {
    assert.deepEqual(loadQuickLaunchSettings(), { enabled: true, items: [item()] });
  });
  const empty = memoryStorage();
  withWindow({ localStorage: empty }, () => {
    assert.equal(saveQuickLaunchSettings({ enabled: false, items: [item()] }), true);
    assert.equal(empty.values.get(QUICK_LAUNCH_KEY), JSON.stringify({ enabled: false, items: [item()] }));
    assert.deepEqual(loadQuickLaunchSettings(), { enabled: false, items: [item()] });
  });
});
