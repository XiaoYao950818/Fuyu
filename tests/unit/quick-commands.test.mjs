import assert from "node:assert/strict";
import test from "node:test";
import { buildCommandItem, combineCommandOutput, commandResultKind } from "../../src/features/quick-commands/commands.ts";
import {
  DEFAULT_QUICK_COMMANDS_SETTINGS,
  QUICK_COMMANDS_KEY,
  loadQuickCommandsSettings,
  normalizeQuickCommandsSettings,
  saveQuickCommandsSettings,
} from "../../src/features/quick-commands/storage.ts";

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
  return { id: "1", name: "List", command: "Get-ChildItem", ...overrides };
}

test("stdout and stderr are shown together with trailing blank lines trimmed", () => {
  assert.equal(combineCommandOutput("hello\n", ""), "hello");
  assert.equal(combineCommandOutput("", "boom\n\n"), "boom");
  assert.equal(combineCommandOutput("out\n", "err\n"), "out\nerr");
  assert.equal(combineCommandOutput("out\n\n\n", "err\n\n"), "out\nerr");
  assert.equal(combineCommandOutput("  spaced  \n", ""), "  spaced");
  assert.equal(combineCommandOutput("", ""), "");
  assert.equal(combineCommandOutput("   \n", "\n  \n"), "");
});

test("an empty run shows nothing rather than a blank line", () => {
  assert.equal(combineCommandOutput("", ""), "");
  assert.equal(combineCommandOutput("\n", "\n"), "");
});

test("the result kind follows error first, then timeout, then the exit code", () => {
  assert.equal(commandResultKind({ error: "failed", timedOut: false, exitCode: null }), "error");
  assert.equal(commandResultKind({ error: "failed", timedOut: true, exitCode: null }), "error");
  assert.equal(commandResultKind({ error: null, timedOut: true, exitCode: null }), "timedOut");
  assert.equal(commandResultKind({ error: null, timedOut: false, exitCode: 0 }), "exited");
  assert.equal(commandResultKind({ error: null, timedOut: false, exitCode: 1 }), "exited");
  assert.equal(commandResultKind({ error: null, timedOut: false, exitCode: null }), "unknown");
});

test("a command needs a name, a command line and an id, and both texts are trimmed", () => {
  assert.deepEqual(buildCommandItem("  List  ", "  Get-ChildItem  ", "1"), item());
  for (const [name, command, id] of [
    ["", "Get-ChildItem", "1"],
    ["   ", "Get-ChildItem", "1"],
    ["List", "", "1"],
    ["List", "   ", "1"],
    ["List", "Get-ChildItem", ""],
  ]) {
    assert.equal(buildCommandItem(name, command, id), null, JSON.stringify([name, command, id]));
  }
});

test("missing or broken stored settings fall back to an empty enabled list", () => {
  assert.deepEqual(DEFAULT_QUICK_COMMANDS_SETTINGS, { enabled: true, items: [] });
  for (const value of [undefined, null, "items", 1, true, {}]) {
    assert.deepEqual(normalizeQuickCommandsSettings(value), { enabled: true, items: [] }, JSON.stringify(value));
  }
  assert.deepEqual(loadQuickCommandsSettings(), DEFAULT_QUICK_COMMANDS_SETTINGS);
});

test("a bare array of commands is read as the old format", () => {
  assert.deepEqual(normalizeQuickCommandsSettings([item()]), { enabled: true, items: [item()] });
  assert.deepEqual(normalizeQuickCommandsSettings([item(), { junk: true }]), { enabled: true, items: [item()] });
});

test("bad commands are dropped, good ones are trimmed and the first of a duplicated id wins", () => {
  const settings = normalizeQuickCommandsSettings({
    enabled: false,
    items: [
      item({ name: "  List  ", command: "  Get-ChildItem  " }),
      { id: "2", name: "", command: "Get-ChildItem" },
      { id: "3", name: "No command", command: "" },
      { id: "4", name: "No command", command: "   " },
      { name: "No id", command: "Get-ChildItem" },
      item({ id: "1", name: "Duplicate", command: "Get-Date" }),
      "not a command",
      null,
    ],
  });
  assert.deepEqual(settings, { enabled: false, items: [item()] });
});

test("commands without an array, or with a non-array value, read as empty", () => {
  assert.deepEqual(normalizeQuickCommandsSettings({ enabled: true, items: "x" }), { enabled: true, items: [] });
  assert.deepEqual(normalizeQuickCommandsSettings({ enabled: true }), { enabled: true, items: [] });
  assert.deepEqual(normalizeQuickCommandsSettings({ enabled: false, items: [item()] }), { enabled: false, items: [item()] });
});

test("corrupted stored JSON falls back to defaults and settings round-trip through storage", () => {
  const storage = memoryStorage([[QUICK_COMMANDS_KEY, "{not json"]]);
  withWindow({ localStorage: storage }, () => {
    assert.deepEqual(loadQuickCommandsSettings(), DEFAULT_QUICK_COMMANDS_SETTINGS);
  });
  const oldFormat = memoryStorage([[QUICK_COMMANDS_KEY, JSON.stringify([item()])]]);
  withWindow({ localStorage: oldFormat }, () => {
    assert.deepEqual(loadQuickCommandsSettings(), { enabled: true, items: [item()] });
  });
  const empty = memoryStorage();
  withWindow({ localStorage: empty }, () => {
    assert.equal(saveQuickCommandsSettings({ enabled: false, items: [item()] }), true);
    assert.equal(empty.values.get(QUICK_COMMANDS_KEY), JSON.stringify({ enabled: false, items: [item()] }));
    assert.deepEqual(loadQuickCommandsSettings(), { enabled: false, items: [item()] });
  });
});
