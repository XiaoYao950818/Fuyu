import assert from "node:assert/strict";
import test from "node:test";
import {
  FILE_SEARCH_RESULT_LIMIT,
  fileSearchEmptyState,
  formatFileModified,
  formatFileSize,
  limitFileResults,
  matchFileName,
} from "../../src/features/file-search/search.ts";
import {
  DEFAULT_FILE_SEARCH_SETTINGS,
  FILE_SEARCH_KEY,
  loadFileSearchSettings,
  normalizeFileSearchSettings,
  saveFileSearchSettings,
} from "../../src/features/file-search/storage.ts";

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

function status(overrides = {}) {
  return { state: "ready", indexedCount: 120, drives: ["C"], adminRequired: false, error: null, ...overrides };
}

test("file names match by case-insensitive substring", () => {
  assert.equal(matchFileName("Report.docx", "report"), true);
  assert.equal(matchFileName("REPORT.DOCX", "report"), true);
  assert.equal(matchFileName("photo.PNG", ".png"), true);
  assert.equal(matchFileName("My File.txt", "my file"), true);
  assert.equal(matchFileName("报告.docx", "报告"), true);
  assert.equal(matchFileName("notes.txt", "xyz"), false);
  assert.equal(matchFileName("notes.txt", "notes.txt.bak"), false);
  assert.equal(matchFileName("", "notes"), false);
});

test("an empty query matches nothing", () => {
  assert.equal(matchFileName("notes.txt", ""), false);
  assert.equal(matchFileName("notes.txt", "   "), false);
  assert.equal(matchFileName("notes.txt", "\n"), false);
});

test("surrounding whitespace in the query is ignored", () => {
  assert.equal(matchFileName("notes.txt", "  notes  "), true);
  assert.equal(matchFileName("NOTES.TXT", "  Notes  "), true);
});

test("results stop at 200 by default and never exceed the given limit", () => {
  assert.equal(FILE_SEARCH_RESULT_LIMIT, 200);
  const items = Array.from({ length: 250 }, (_, index) => index);
  assert.equal(limitFileResults(items).length, 200);
  assert.deepEqual(limitFileResults(items), items.slice(0, 200));
  assert.deepEqual(limitFileResults(items, 3), [0, 1, 2]);
  assert.deepEqual(limitFileResults([1, 2], 200), [1, 2]);
  assert.deepEqual(limitFileResults([], 200), []);
  assert.deepEqual(limitFileResults(items, 0), []);
  assert.deepEqual(limitFileResults(items, -5), []);
  assert.deepEqual(limitFileResults(items, Number.NaN), []);
  assert.deepEqual(limitFileResults(items, Number.POSITIVE_INFINITY), []);
  assert.deepEqual(limitFileResults(items, 2.9), [0, 1]);
});

test("sizes read as B, KB, MB and GB", () => {
  assert.equal(formatFileSize(0), "0 B");
  assert.equal(formatFileSize(512), "512 B");
  assert.equal(formatFileSize(1023), "1023 B");
  assert.equal(formatFileSize(1024), "1.0 KB");
  assert.equal(formatFileSize(1536), "1.5 KB");
  assert.equal(formatFileSize(1024 * 1024), "1.0 MB");
  assert.equal(formatFileSize(2.5 * 1024 * 1024), "2.5 MB");
  assert.equal(formatFileSize(5 * 1024 ** 3), "5.00 GB");
  assert.equal(formatFileSize(2.5 * 1024 ** 3), "2.50 GB");
});

test("a missing modified time shows nothing, a set one shows a date", () => {
  assert.equal(formatFileModified(null), "");
  const shown = formatFileModified(Date.parse("2024-06-15T12:00:00Z"));
  assert.equal(typeof shown, "string");
  assert.ok(shown.length > 0);
  assert.ok(shown.includes("2024"), shown);
});

test("a disabled feature and a missing status come first", () => {
  assert.equal(fileSearchEmptyState({ enabled: false, status: null, query: "", searching: false, resultCount: 0 }), "disabled");
  assert.equal(fileSearchEmptyState({ enabled: false, status: status(), query: "x", searching: false, resultCount: 0 }), "disabled");
  assert.equal(fileSearchEmptyState({ enabled: true, status: null, query: "", searching: false, resultCount: 0 }), "loading");
  assert.equal(fileSearchEmptyState({ enabled: true, status: null, query: "x", searching: true, resultCount: 0 }), "loading");
});

test("the admin prompt beats the index state, and building and error beat the query", () => {
  assert.equal(fileSearchEmptyState({ enabled: true, status: status({ adminRequired: true }), query: "x", searching: false, resultCount: 0 }), "adminRequired");
  assert.equal(fileSearchEmptyState({ enabled: true, status: status({ state: "building", adminRequired: true }), query: "", searching: false, resultCount: 0 }), "adminRequired");
  assert.equal(fileSearchEmptyState({ enabled: true, status: status({ state: "building" }), query: "", searching: false, resultCount: 0 }), "indexing");
  assert.equal(fileSearchEmptyState({ enabled: true, status: status({ state: "building" }), query: "x", searching: true, resultCount: 0 }), "indexing");
  assert.equal(fileSearchEmptyState({ enabled: true, status: status({ state: "error", error: "boom" }), query: "", searching: false, resultCount: 0 }), "error");
});

test("an empty query shows the hint, a running search shows searching, no hits show no results", () => {
  assert.equal(fileSearchEmptyState({ enabled: true, status: status(), query: "", searching: false, resultCount: 0 }), "hint");
  assert.equal(fileSearchEmptyState({ enabled: true, status: status(), query: "   ", searching: false, resultCount: 0 }), "hint");
  assert.equal(fileSearchEmptyState({ enabled: true, status: status(), query: "x", searching: true, resultCount: 0 }), "searching");
  assert.equal(fileSearchEmptyState({ enabled: true, status: status(), query: "x", searching: false, resultCount: 0 }), "noResults");
  assert.equal(fileSearchEmptyState({ enabled: true, status: status(), query: "x", searching: false, resultCount: 3 }), null);
});

test("an index that has not started yet behaves like a ready one for the empty states", () => {
  assert.equal(fileSearchEmptyState({ enabled: true, status: status({ state: "not-started", indexedCount: 0 }), query: "", searching: false, resultCount: 0 }), "hint");
  assert.equal(fileSearchEmptyState({ enabled: true, status: status({ state: "not-started", indexedCount: 0 }), query: "x", searching: false, resultCount: 0 }), "noResults");
});

test("missing or broken stored settings fall back to showing file search", () => {
  assert.deepEqual(DEFAULT_FILE_SEARCH_SETTINGS, { enabled: true });
  assert.deepEqual(normalizeFileSearchSettings(undefined), DEFAULT_FILE_SEARCH_SETTINGS);
  assert.deepEqual(normalizeFileSearchSettings(null), DEFAULT_FILE_SEARCH_SETTINGS);
  assert.deepEqual(normalizeFileSearchSettings("enabled"), DEFAULT_FILE_SEARCH_SETTINGS);
  assert.deepEqual(normalizeFileSearchSettings([]), DEFAULT_FILE_SEARCH_SETTINGS);
  assert.deepEqual(normalizeFileSearchSettings({}), DEFAULT_FILE_SEARCH_SETTINGS);
  assert.deepEqual(loadFileSearchSettings(), DEFAULT_FILE_SEARCH_SETTINGS);
});

test("only an explicit false turns file search off", () => {
  assert.deepEqual(normalizeFileSearchSettings({ enabled: false }), { enabled: false });
  assert.deepEqual(normalizeFileSearchSettings({ enabled: true }), { enabled: true });
  assert.deepEqual(normalizeFileSearchSettings({ enabled: false, other: 1 }), { enabled: false });
});

test("corrupted stored JSON falls back to defaults and settings round-trip through storage", () => {
  const storage = memoryStorage([[FILE_SEARCH_KEY, "{not json"]]);
  withWindow({ localStorage: storage }, () => {
    assert.deepEqual(loadFileSearchSettings(), DEFAULT_FILE_SEARCH_SETTINGS);
  });
  const empty = memoryStorage();
  withWindow({ localStorage: empty }, () => {
    assert.equal(saveFileSearchSettings({ enabled: false }), true);
    assert.equal(empty.values.get(FILE_SEARCH_KEY), JSON.stringify({ enabled: false }));
    assert.deepEqual(loadFileSearchSettings(), { enabled: false });
  });
});
