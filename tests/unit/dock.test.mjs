import assert from "node:assert/strict";
import test from "node:test";
import {
  baseName,
  buildDockPinnedItem,
  formatDockClock,
  mergeDockEntries,
  normalizeDockApp,
  normalizeDockAppList,
  normalizeDockApps,
  normalizeTrayIcon,
  normalizeTrayIconList,
  normalizeTrayIcons,
  sortDockApps,
  trayDisplayName,
  trayFallbackLetter,
} from "../../src/features/dock/dock.ts";
import { DEFAULT_DOCK_SETTINGS, MAX_PINNED_APPS, loadDockSettings, normalizeDockScreen, normalizeDockSettings } from "../../src/features/dock/storage.ts";

const APP = { windowHandle: 1234, title: "Spotify", exePath: "C:\\Apps\\Spotify.exe", icon: "data:image/png;base64,AAA", minimized: false, active: true };
const APP2 = { windowHandle: 5678, title: "Notepad", exePath: "C:\\Windows\\notepad.exe", icon: null, minimized: true, active: false };

test("a broken app is dropped and a good one keeps its fields", () => {
  assert.deepEqual(normalizeDockApp(APP), APP);
  assert.equal(normalizeDockApp(undefined), null);
  assert.equal(normalizeDockApp(null), null);
  assert.equal(normalizeDockApp("spotify"), null);
  assert.equal(normalizeDockApp([]), null);
  assert.equal(normalizeDockApp({}), null);
  assert.equal(normalizeDockApp({ ...APP, windowHandle: 0 }), null);
  assert.equal(normalizeDockApp({ ...APP, windowHandle: -1 }), null);
  assert.equal(normalizeDockApp({ ...APP, windowHandle: 1.5 }), null);
  assert.equal(normalizeDockApp({ ...APP, windowHandle: "1234" }), null);
  assert.deepEqual(normalizeDockApp({ ...APP, title: 3 }), { ...APP, title: "" });
  assert.deepEqual(normalizeDockApp({ ...APP, exePath: "" }), { ...APP, exePath: null });
  assert.deepEqual(normalizeDockApp({ ...APP, icon: "" }), { ...APP, icon: null });
  assert.deepEqual(normalizeDockApp({ ...APP, minimized: 1 }), { ...APP, minimized: false });
  assert.deepEqual(normalizeDockApp({ ...APP, active: "yes" }), { ...APP, active: false });
});

test("app lists drop broken and duplicated entries", () => {
  assert.deepEqual(normalizeDockApps(undefined), []);
  assert.deepEqual(normalizeDockApps({}), []);
  assert.deepEqual(normalizeDockApps([]), []);
  assert.deepEqual(normalizeDockApps([APP, APP, null, APP2]), [APP, APP2]);
});

test("broken app lists fall back to an unavailable, empty list", () => {
  assert.deepEqual(normalizeDockAppList(undefined), { available: false, apps: [] });
  assert.deepEqual(normalizeDockAppList(null), { available: false, apps: [] });
  assert.deepEqual(normalizeDockAppList("apps"), { available: false, apps: [] });
  assert.deepEqual(normalizeDockAppList([]), { available: false, apps: [] });
  assert.deepEqual(normalizeDockAppList({}), { available: false, apps: [] });
  assert.deepEqual(normalizeDockAppList({ available: true, apps: [APP, APP] }), { available: true, apps: [APP] });
  assert.deepEqual(normalizeDockAppList({ available: "yes", apps: [APP2] }), { available: false, apps: [APP2] });
});

test("running apps sort active first, then visible, then by title", () => {
  const minimizedActive = { ...APP2, windowHandle: 9, title: "AAA", minimized: true, active: true };
  const visible = { ...APP, windowHandle: 10, title: "ZZZ", minimized: false, active: false };
  const minimized = { ...APP2, windowHandle: 11, title: "AAA", minimized: true, active: false };
  assert.deepEqual(
    sortDockApps([minimized, visible, minimizedActive, APP]).map((app) => app.windowHandle),
    [1234, 9, 10, 11],
  );
  assert.deepEqual(sortDockApps([]), []);
});

test("pinned apps come first and merge with their running window", () => {
  const pinned = [{ id: "p1", name: "Spotify", target: "C:\\Apps\\Spotify.exe" }];
  const entries = mergeDockEntries(pinned, [APP, APP2]);
  assert.equal(entries.length, 2);
  assert.deepEqual(entries[0], {
    id: "p1",
    name: "Spotify",
    icon: APP.icon,
    target: "C:\\Apps\\Spotify.exe",
    windowHandle: 1234,
    minimized: false,
    active: true,
    pinned: true,
  });
  assert.equal(entries[1]?.id, "running-5678");
  assert.equal(entries[1]?.pinned, false);
});

test("a pinned app that is not running still shows, without a window", () => {
  const pinned = [{ id: "p1", name: "Spotify", target: "C:\\Apps\\Spotify.exe" }];
  const entries = mergeDockEntries(pinned, [APP2]);
  assert.equal(entries.length, 2);
  assert.equal(entries[0]?.windowHandle, null);
  assert.equal(entries[0]?.icon, null);
  assert.equal(entries[0]?.pinned, true);
  assert.equal(entries[1]?.id, "running-5678");
});

test("pinned matching is case-insensitive on the exe path", () => {
  const pinned = [{ id: "p1", name: "spotify", target: "c:\\apps\\spotify.exe" }];
  const entries = mergeDockEntries(pinned, [APP]);
  assert.equal(entries.length, 1);
  assert.equal(entries[0]?.windowHandle, 1234);
});

test("a broken tray icon is dropped and a good one keeps its fields", () => {
  const icon = { id: "main:0", name: "OneDrive", exePath: "C:\\Apps\\OneDrive.exe", icon: null, overflow: false };
  assert.deepEqual(normalizeTrayIcon(icon), icon);
  assert.equal(normalizeTrayIcon(undefined), null);
  assert.equal(normalizeTrayIcon(null), null);
  assert.equal(normalizeTrayIcon("onedrive"), null);
  assert.equal(normalizeTrayIcon([]), null);
  assert.equal(normalizeTrayIcon({}), null);
  assert.equal(normalizeTrayIcon({ ...icon, id: "" }), null);
  assert.deepEqual(normalizeTrayIcon({ ...icon, name: 3 }), { ...icon, name: "" });
  assert.deepEqual(normalizeTrayIcon({ ...icon, exePath: "" }), { ...icon, exePath: null });
  assert.deepEqual(normalizeTrayIcon({ ...icon, icon: "" }), { ...icon, icon: null });
  assert.deepEqual(normalizeTrayIcon({ ...icon, overflow: 1 }), { ...icon, overflow: false });
});

test("tray icon lists drop broken and duplicated entries", () => {
  const icon = { id: "main:0", name: "OneDrive", exePath: null, icon: null, overflow: false };
  assert.deepEqual(normalizeTrayIcons(undefined), []);
  assert.deepEqual(normalizeTrayIcons({}), []);
  assert.deepEqual(normalizeTrayIcons([]), []);
  assert.deepEqual(normalizeTrayIcons([icon, icon, null]), [icon]);
});

test("broken tray lists fall back to an unavailable, empty list", () => {
  assert.deepEqual(normalizeTrayIconList(undefined), { available: false, overflowAvailable: false, icons: [] });
  assert.deepEqual(normalizeTrayIconList(null), { available: false, overflowAvailable: false, icons: [] });
  assert.deepEqual(normalizeTrayIconList("tray"), { available: false, overflowAvailable: false, icons: [] });
  assert.deepEqual(normalizeTrayIconList([]), { available: false, overflowAvailable: false, icons: [] });
  assert.deepEqual(normalizeTrayIconList({}), { available: false, overflowAvailable: false, icons: [] });
  const icon = { id: "overflow:0", name: "Hidden", exePath: null, icon: null, overflow: true };
  assert.deepEqual(normalizeTrayIconList({ available: true, overflowAvailable: true, icons: [icon, icon] }), {
    available: true,
    overflowAvailable: true,
    icons: [icon],
  });
});

test("tray names fall back to the exe stem and then to unknown", () => {
  assert.equal(trayDisplayName({ id: "main:0", name: "  OneDrive  ", exePath: null, icon: null, overflow: false }, "Unknown app"), "OneDrive");
  assert.equal(trayDisplayName({ id: "main:0", name: "", exePath: "C:\\Apps\\OneDrive.exe", icon: null, overflow: false }, "Unknown app"), "OneDrive");
  assert.equal(trayDisplayName({ id: "main:0", name: " ", exePath: null, icon: null, overflow: false }, "Unknown app"), "Unknown app");
  assert.equal(trayDisplayName({ id: "main:0", name: "", exePath: "C:\\Apps\\", icon: null, overflow: false }, "Unknown app"), "Unknown app");
});

test("tray fallback letters use the first letter, upper-cased", () => {
  assert.equal(trayFallbackLetter("OneDrive"), "O");
  assert.equal(trayFallbackLetter("  edge "), "E");
  assert.equal(trayFallbackLetter(""), "?");
  assert.equal(trayFallbackLetter("   "), "?");
});

test("pinned items need a name, a target and an id", () => {
  assert.deepEqual(buildDockPinnedItem("Spotify", "C:\\Apps\\Spotify.exe", "p1"), { id: "p1", name: "Spotify", target: "C:\\Apps\\Spotify.exe" });
  assert.deepEqual(buildDockPinnedItem("  Spotify  ", "  C:\\Apps\\Spotify.exe  ", "p1"), { id: "p1", name: "Spotify", target: "C:\\Apps\\Spotify.exe" });
  assert.equal(buildDockPinnedItem("", "C:\\Apps\\Spotify.exe", "p1"), null);
  assert.equal(buildDockPinnedItem("Spotify", "", "p1"), null);
  assert.equal(buildDockPinnedItem("Spotify", "C:\\Apps\\Spotify.exe", ""), null);
  assert.equal(buildDockPinnedItem("   ", "C:\\Apps\\Spotify.exe", "p1"), null);
});

test("base names drop folders and extensions", () => {
  assert.equal(baseName("C:\\Apps\\Spotify.exe"), "Spotify");
  assert.equal(baseName("C:\\Apps\\Spotify"), "Spotify");
  assert.equal(baseName("Spotify.exe"), "Spotify");
  assert.equal(baseName("C:\\Apps\\"), "Apps");
});

test("the dock clock shows hours, minutes and the date", () => {
  const at = new Date(2026, 10, 18, 5, 21, 30);
  const zh = formatDockClock(at, "zh-CN");
  assert.equal(zh.time, "05:21");
  assert.ok(zh.date.includes("18"), zh.date);
  assert.ok(zh.date.includes("周三"), zh.date);
  const en = formatDockClock(at, "en-US");
  assert.equal(en.time, "05:21");
  assert.ok(en.date.includes("18"), en.date);
});

test("dock settings default to off with no pinned apps and cap the pinned list", () => {
  assert.deepEqual(DEFAULT_DOCK_SETTINGS, { enabled: false, screen: "primary", pinned: [] });
  assert.equal(MAX_PINNED_APPS, 12);
  assert.deepEqual(normalizeDockSettings(undefined), { enabled: false, screen: "primary", pinned: [] });
  assert.deepEqual(normalizeDockSettings(null), { enabled: false, screen: "primary", pinned: [] });
  assert.deepEqual(normalizeDockSettings("dock"), { enabled: false, screen: "primary", pinned: [] });
  assert.deepEqual(normalizeDockSettings([]), { enabled: false, screen: "primary", pinned: [] });
  assert.deepEqual(normalizeDockSettings({ enabled: true }), { enabled: true, screen: "primary", pinned: [] });
  assert.deepEqual(normalizeDockSettings({ enabled: "yes" }), { enabled: false, screen: "primary", pinned: [] });
  assert.deepEqual(normalizeDockSettings({ enabled: true, pinned: "no" }), { enabled: true, screen: "primary", pinned: [] });
  const many = Array.from({ length: 14 }, (_, index) => ({ id: `p${index}`, name: `App ${index}`, target: `C:\\Apps\\App${index}.exe` }));
  const normalized = normalizeDockSettings({ enabled: true, pinned: many });
  assert.equal(normalized.pinned.length, 12);
  assert.equal(normalized.pinned[11]?.id, "p11");
  const dupes = normalizeDockSettings({
    enabled: false,
    pinned: [
      { id: "p1", name: "A", target: "C:\\A.exe" },
      { id: "p1", name: "A", target: "C:\\A.exe" },
      { id: "p2", name: " ", target: "C:\\B.exe" },
      { id: "p3", name: "C", target: "" },
    ],
  });
  assert.deepEqual(dupes.pinned, [{ id: "p1", name: "A", target: "C:\\A.exe" }]);
  assert.deepEqual(loadDockSettings(), { enabled: false, screen: "primary", pinned: [] });
});

test("the dock screen follows the stored choice and falls back to the primary screen", () => {
  assert.equal(normalizeDockScreen("cursor"), "cursor");
  assert.equal(normalizeDockScreen("primary"), "primary");
  assert.equal(normalizeDockScreen("foreground"), "primary");
  assert.equal(normalizeDockScreen("Primary"), "primary");
  assert.equal(normalizeDockScreen(""), "primary");
  assert.equal(normalizeDockScreen(undefined), "primary");
  assert.equal(normalizeDockScreen(null), "primary");
  assert.equal(normalizeDockScreen(1), "primary");
  assert.deepEqual(normalizeDockSettings({ enabled: true, screen: "cursor" }), { enabled: true, screen: "cursor", pinned: [] });
  assert.deepEqual(normalizeDockSettings({ enabled: true, screen: "foreground" }), { enabled: true, screen: "primary", pinned: [] });
  assert.deepEqual(normalizeDockSettings({ enabled: true, screen: 2 }), { enabled: true, screen: "primary", pinned: [] });
});
