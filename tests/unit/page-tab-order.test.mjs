import assert from "node:assert/strict";
import test from "node:test";
import "./islandPageSlot.mjs";
import {
  applySubsetOrder,
  defaultPageId,
  movePageInList,
  normalizePageOrder,
  normalizePluginPagePrefs,
  orderPluginViews,
  reorderPageOrder,
  visiblePluginViews,
} from "../../src/features/plugin-views/pagePrefs.ts";
import { BUILTIN_TAB_PAGES, builtinTabPageLabel } from "../../src/features/plugin-views/builtinTabPages.ts";
import { loadPluginPagePrefs } from "../../src/features/plugin-views/storage.ts";
import { defaultTabOrder, resolveIslandPage } from "../../src/windows/island/features.ts";
import { pageSlot } from "../../src/windows/island/slots/pageSlot.ts";

const board = "plugin:dev.example.board/board";
const timer = "plugin:dev.example.pomodoro/timer";
const available = ["music", "clipboard", "shelf", timer, board];

test("normalizing the tab order keeps the stored order, appends missing pages and drops stale ones", () => {
  assert.deepEqual(normalizePageOrder([], available), available);
  assert.deepEqual(normalizePageOrder(["shelf", "music"], available), ["shelf", "music", "clipboard", timer, board]);
  assert.deepEqual(normalizePageOrder(["plugin:gone/q", "clipboard"], available), ["clipboard", "music", "shelf", timer, board]);
  assert.deepEqual(normalizePageOrder(["music", "music", "clipboard", "clipboard"], available), ["music", "clipboard", "shelf", timer, board]);
  assert.deepEqual(normalizePageOrder(["music"], []), []);
  assert.deepEqual(normalizePageOrder(["music", "clipboard", "music"], ["music", "clipboard", "music"]), ["music", "clipboard"]);
});

test("the default page is the first ordered page that is still visible", () => {
  assert.equal(defaultPageId(["music", "clipboard", "shelf"], ["clipboard", "shelf"]), "clipboard");
  assert.equal(defaultPageId(["music", "clipboard"], ["shelf"]), null);
  assert.equal(defaultPageId([], ["music"]), null);
  assert.equal(defaultPageId(["music"], []), null);
});

test("dragging a tab moves it before the drop target, or to the end when dropped past the last tab", () => {
  const order = ["music", "clipboard", "shelf", timer];
  assert.deepEqual(reorderPageOrder(order, "shelf", "music"), ["shelf", "music", "clipboard", timer]);
  assert.deepEqual(reorderPageOrder(order, "music", "shelf"), ["clipboard", "music", "shelf", timer]);
  assert.deepEqual(reorderPageOrder(order, "clipboard", null), ["music", "shelf", timer, "clipboard"]);
  assert.deepEqual(reorderPageOrder(order, timer, "clipboard"), ["music", timer, "clipboard", "shelf"]);
  assert.equal(reorderPageOrder(order, "music", "clipboard"), order, "already right before the target");
  assert.equal(reorderPageOrder(order, timer, null), order, "already last");
  assert.equal(reorderPageOrder(order, "plugin:gone/q", "music"), order, "an unknown tab cannot move");
  assert.equal(reorderPageOrder(order, "music", "plugin:gone/q"), order, "an unknown target changes nothing");
  assert.equal(reorderPageOrder(order, "music", "music"), order, "dropping on itself changes nothing");
  const single = ["music"];
  assert.equal(reorderPageOrder(single, "music", null), single, "a single tab has nowhere to go");
});

test("moving a row one step swaps neighbours and stops at the ends", () => {
  const order = ["music", "clipboard", "shelf"];
  assert.deepEqual(movePageInList(order, "clipboard", -1), ["clipboard", "music", "shelf"]);
  assert.deepEqual(movePageInList(order, "clipboard", 1), ["music", "shelf", "clipboard"]);
  assert.equal(movePageInList(order, "music", -1), order, "the first row cannot move up");
  assert.equal(movePageInList(order, "shelf", 1), order, "the last row cannot move down");
  assert.equal(movePageInList(order, "plugin:gone/q", 1), order, "an unknown row cannot move");
});

test("reordering the visible tabs keeps hidden and disabled tabs where they were stored", () => {
  const full = ["music", "plugin:hidden/x", "clipboard", "shelf", "volume"];
  const visible = ["music", "clipboard", "shelf", "volume"];
  const moved = reorderPageOrder(visible, "shelf", "music");
  assert.deepEqual(applySubsetOrder(full, visible, moved), ["shelf", "plugin:hidden/x", "music", "clipboard", "volume"]);
  const toEnd = reorderPageOrder(visible, "music", null);
  assert.deepEqual(applySubsetOrder(full, visible, toEnd), ["clipboard", "plugin:hidden/x", "shelf", "volume", "music"]);
  assert.equal(applySubsetOrder(full, visible, ["music", "clipboard"]), full, "a partial new order is rejected");
  assert.equal(applySubsetOrder(full, visible, ["music", "clipboard", "shelf", "shelf"]), full, "a duplicated new order is rejected");
  assert.equal(applySubsetOrder(full, visible, ["music", "clipboard", "shelf", "plugin:gone/q"]), full, "an unknown id in the new order is rejected");
});

test("plugin views keep their relative order when builtin pages sit between them in the stored order", () => {
  const view = (pluginId, viewId) => ({ pluginId, viewId, pluginName: { "zh-CN": "p", en: "p" }, title: { "zh-CN": "t", en: "t" }, icon: "list", template: "list", status: "running", error: null });
  const views = [view("a.one", "x"), view("b.two", "y"), view("c.three", "z")];
  const prefs = normalizePluginPagePrefs({ order: ["music", "plugin:c.three/z", "clipboard", "plugin:a.one/x"], hidden: ["plugin:b.two/y"] });
  const ids = (list) => list.map((item) => `${item.pluginId}/${item.viewId}`);
  assert.deepEqual(ids(orderPluginViews(views, prefs)), ["c.three/z", "a.one/x", "b.two/y"]);
  assert.deepEqual(ids(visiblePluginViews(views, prefs)), ["c.three/z", "a.one/x"]);
});

test("bad stored tab order falls back to the default order instead of throwing", () => {
  assert.deepEqual(loadPluginPagePrefs(), { order: [], hidden: [] });
  assert.deepEqual(normalizePluginPagePrefs("{not json"), { order: [], hidden: [] });
  assert.deepEqual(normalizePluginPagePrefs({ order: "music", hidden: null }), { order: [], hidden: [] });
  assert.deepEqual(normalizePageOrder([], available), available);
});

test("the built-in tab list matches the registered header-dot pages, in shortcut order", () => {
  const registered = pageSlot
    .items()
    .filter((item) => item.headerDot === true)
    .sort((a, b) => (a.shortcutOrder ?? Number.MAX_SAFE_INTEGER) - (b.shortcutOrder ?? Number.MAX_SAFE_INTEGER));
  assert.deepEqual(
    BUILTIN_TAB_PAGES.map((page) => [page.id, page.shortcutOrder]),
    registered.map((item) => [item.id, item.shortcutOrder]),
  );
  assert.deepEqual(defaultTabOrder(), BUILTIN_TAB_PAGES.map((page) => page.id));
});

test("every built-in tab has a label in both languages", async () => {
  const { TRANSLATIONS } = await import("../../src/i18n/index.ts");
  for (const page of BUILTIN_TAB_PAGES) {
    const zh = builtinTabPageLabel(page.id, TRANSLATIONS["zh-CN"]);
    const en = builtinTabPageLabel(page.id, TRANSLATIONS.en);
    assert.equal(typeof zh, "string");
    assert.equal(typeof en, "string");
    assert.ok(zh.length > 0, page.id);
    assert.ok(en.length > 0, page.id);
  }
  assert.equal(builtinTabPageLabel("plugin:gone/q", TRANSLATIONS["zh-CN"]), null);
  assert.equal(builtinTabPageLabel("qq", TRANSLATIONS["zh-CN"]), null, "the messages page is not a tab");
});

test("when the first tab is hidden the island falls back to the next visible tab in order", () => {
  const features = { music: true, clipboard: true, shelf: true, qq: true, wechat: false, qqMail: false, pluginPages: [] };
  assert.equal(resolveIslandPage(board, features, [board, "music", "clipboard"]), "music");
  assert.equal(resolveIslandPage(board, features, [board, "clipboard"]), "clipboard");
  assert.equal(resolveIslandPage("music", features, [board, "music"]), "music", "an enabled page stays");
  const none = { music: false, clipboard: false, shelf: false, qq: false, wechat: false, qqMail: false, pluginPages: [] };
  assert.equal(resolveIslandPage("music", none, ["music", "clipboard"]), null);
  assert.equal(resolveIslandPage("music", features), "music", "without a tab order the old fallback still works");
});
