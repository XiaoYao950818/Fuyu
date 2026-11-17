import { act, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { mockIPC, mockWindows } from "@tauri-apps/api/mocks";
import "../../src/styles/tokens.css";
import { IslandApp } from "../../src/windows/island/IslandApp";
import { SettingsWindow } from "../../src/windows/settings/SettingsWindow";
import { I18nProvider, LOCALE_STORAGE_KEY, TRANSLATIONS, useLocale } from "../../src/i18n";

const query = new URLSearchParams(location.search);
const automated = query.has("test");
Object.assign(globalThis, { isTauri: true, IS_REACT_ACT_ENVIRONMENT: automated });
const original = new Map(Object.entries(localStorage).filter(([key]) => key.startsWith("fuyu-")));
const restore = () => {
  for (const key of Object.keys(localStorage).filter(key => key.startsWith("fuyu-"))) {
    if (!original.has(key)) localStorage.removeItem(key);
  }
  for (const [key, value] of original) localStorage.setItem(key, value);
};
window.addEventListener("beforeunload", restore);

const now = new Date();
if (automated || localStorage.getItem(LOCALE_STORAGE_KEY) === null) localStorage.setItem(LOCALE_STORAGE_KEY, "zh-CN");
localStorage.setItem("fuyu-qq-notification-access-requested", "true");
let revision = 0;
let reads = 0;
const commands: string[] = [];
mockIPC((command, payload) => {
  commands.push(command);
  const args = (payload ?? {}) as Record<string, unknown>;
  switch (command) {
    case "get_launch_at_startup": return false;
    case "get_clipboard_history": return { settings: { enabled: true, captureImages: true, maxItems: 100, shortcut: "Ctrl+X", shortcutEnabled: true }, items: [] };
    case "list_plugin_views": return { views: [], status: [] };
    case "get_media_state": return { available: false, audioActive: false, audioPeak: 0, playbackStatus: "unavailable", title: null, artist: null, album: null, thumbnail: null, positionMs: 0, durationMs: 0, canSeek: false, canNext: false, canPrevious: false, shuffleActive: null, canShuffle: false, repeatMode: "unknown", canRepeat: false, volume: -1, sourceApp: null, activeSessionId: null, sessions: [], updatedAt: 0 };
    case "get_audio_level": return { active: false, peak: 0, updatedAt: 0 };
    case "get_foreground_fullscreen": return { active: false, onIslandMonitor: false };
    case "set_island_interaction": return "disabled";
    case "get_qq_notification_state": return { revision: ++revision, enabled: true, status: "listening", items: [], error: null };
    case "set_wechat_expose_ui": case "set_wechat_hide_taskbar_button": return { revision: ++revision, enabled: true, status: "listening", pending: false, lastAttentionAt: null, error: null };
    case "get_qq_mail_state": return [{ revision: ++revision, email: "test@qq.com", configured: true, enabled: true, syncing: false, status: "connected", unreadCount: 1, items: [{ id: "mail:1", uid: 1, sender: "原始发件人", subject: "保留邮件主题", receivedAt: now.getTime(), unread: true }], lastSyncedAt: now.getTime(), error: null }];
    case "read_qq_mail": ++reads; return { id: args.messageId, content: "<script>removed</script>", contentType: "text/html" };
    case "plugin:window|is_visible": return true;
    default: return null;
  }
}, { shouldMockEvents: true });
mockWindows("main");

let changeLocale: ReturnType<typeof useLocale>["setLocale"];
function Fixture() {
  const { setLocale } = useLocale();
  changeLocale = setLocale;
  return <><IslandApp /><SettingsWindow /></>;
}
const root = createRoot(document.getElementById("root")!);
const mount = () => root.render(<StrictMode><I18nProvider><Fixture /></I18nProvider></StrictMode>);
const messages: string[] = [];
const check = (condition: unknown, message: string) => {
  if (!condition) throw new Error(message);
  messages.push(`PASS ${message}`);
};
const click = async (selector: string) => {
  const element = document.querySelector<HTMLButtonElement>(selector);
  if (!element) throw new Error(`Missing ${selector}`);
  await act(async () => { element.click(); });
};
const LANGUAGE_TRIGGER = [TRANSLATIONS["zh-CN"], TRANSLATIONS.en]
  .map((text) => `.settings-select .select-control__trigger[aria-label='${text.settings.language.label}']`)
  .join(", ");
const switchTo = async (locale: string) => {
  await click(LANGUAGE_TRIGGER);
  const menu = document.querySelector(LANGUAGE_TRIGGER)?.closest(".select-control");
  const option = menu?.querySelector<HTMLElement>(`.select-control__option[data-value='${locale}']`);
  if (!option) throw new Error(`Missing language option ${locale}`);
  await act(async () => { option.click(); });
};

if (!automated) mount();
else {
  try {
    await act(async () => { mount(); });
    await click(".island__open-button");
    check(document.querySelector(LANGUAGE_TRIGGER)?.getAttribute("aria-label") === "界面语言", "Chinese language control is reachable");
    const dataKeys = ["fuyu-settings", "fuyu-setting-presets"];
    const dataBefore = dataKeys.map(key => localStorage.getItem(key));
    const subscriptionsBefore = commands.filter(command => command === "get_qq_notification_state" || command === "set_wechat_expose_ui").length;
    await switchTo("en");
    check(document.documentElement.lang === "en" && localStorage.getItem(LOCALE_STORAGE_KEY) === "en", "Language changes immediately and persists");
    check(document.querySelector(".settings-sidebar")?.textContent?.includes("Appearance"), "Settings categories are translated");
    await click(".settings-sidebar__item[data-category='appearance']");
    await click(".settings-tabs__tab[data-tab='appearance']");
    check(document.querySelector(".editor-panel")?.textContent?.includes("Collapsed island scale"), "Current scale and font settings are translated");
    await click(".settings-sidebar__item[data-category='general']");
    check(dataKeys.every((key, index) => localStorage.getItem(key) === dataBefore[index]), "Switching keeps settings and custom presets unchanged");
    check(commands.filter(command => command === "get_qq_notification_state" || command === "set_wechat_expose_ui").length === subscriptionsBefore, "Switching does not reconnect notification receivers");
    await act(async () => { changeLocale!("constructor" as "en"); });
    check(document.documentElement.lang === "en", "Invalid locale cannot break the mounted interface");
    check(document.querySelectorAll("[title]").length === 0, "No hover tooltips on the island");
    await click("button.island-message-button[aria-label^='Messages']");
    check(document.querySelector(".qq-panel__empty")?.textContent?.includes("No messages"), "QQ panel uses English copy");
    await click(".message-sources button[aria-label='WeChat reminders']");
    check(document.querySelector(".qq-panel__empty")?.textContent?.includes("No reminders"), "WeChat panel uses English copy");
    await click(".message-sources button[aria-label='Mail']");
    check(document.querySelector(".qq-mail-list")?.textContent?.includes("保留邮件主题"), "Mail subjects stay as written");
    await click("button[data-mail-id='mail:1']");
    check(document.querySelector(".qq-mail-body")?.textContent?.includes("No text to display"), "Sanitized empty HTML mail has a translated fallback");
    await switchTo("zh-CN");
    check(document.documentElement.lang === "zh-CN" && reads === 1, "Switching back keeps mail requests stable");
    await act(async () => { localStorage.setItem(LOCALE_STORAGE_KEY, "en"); window.dispatchEvent(new StorageEvent("storage", { key: LOCALE_STORAGE_KEY, newValue: "en", storageArea: localStorage })); });
    check(document.documentElement.lang === "en", "The provider accepts language changes from another window");
    document.documentElement.dataset.testResult = "passed";
  } catch (error) {
    document.documentElement.dataset.testResult = "failed";
    messages.push(`FAIL ${String(error)}`);
    console.error(error);
  } finally {
    restore();
    document.getElementById("results")!.textContent = messages.join("\n");
  }
}
