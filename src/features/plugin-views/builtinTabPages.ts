import type { LucideIcon } from "lucide-react";
import { BatteryCharging, Bell, ClipboardList, Gauge, Images, Inbox, Music, Rocket, Search, Terminal, Timer, Volume2 } from "lucide-react";
import type { Translations } from "../../i18n";

export type BuiltinTabPage = { id: string; icon: LucideIcon; shortcutOrder: number };

export const BUILTIN_TAB_PAGES: readonly BuiltinTabPage[] = [
  { id: "music", icon: Music, shortcutOrder: 3 },
  { id: "clipboard", icon: ClipboardList, shortcutOrder: 5 },
  { id: "shelf", icon: Inbox, shortcutOrder: 6 },
  { id: "screenshots", icon: Images, shortcutOrder: 7 },
  { id: "timer", icon: Timer, shortcutOrder: 8 },
  { id: "device-battery", icon: BatteryCharging, shortcutOrder: 10 },
  { id: "quick-launch", icon: Rocket, shortcutOrder: 11 },
  { id: "quick-commands", icon: Terminal, shortcutOrder: 12 },
  { id: "file-search", icon: Search, shortcutOrder: 13 },
  { id: "net-speed", icon: Gauge, shortcutOrder: 14 },
  { id: "volume", icon: Volume2, shortcutOrder: 15 },
  { id: "dock-tray", icon: Bell, shortcutOrder: 16 },
];

export const BUILTIN_TAB_PAGE_IDS: readonly string[] = BUILTIN_TAB_PAGES.map((page) => page.id);

export function builtinTabPageLabel(id: string, t: Translations): string | null {
  switch (id) {
    case "music":
      return t.island.music;
    case "clipboard":
      return t.island.clipboardHistory;
    case "shelf":
      return t.island.shelf;
    case "screenshots":
      return t.island.screenshots;
    case "timer":
      return t.island.timer;
    case "device-battery":
      return t.deviceBattery.title;
    case "quick-launch":
      return t.quickLaunch.title;
    case "quick-commands":
      return t.quickCommands.title;
    case "file-search":
      return t.fileSearch.title;
    case "net-speed":
      return t.netSpeed.title;
    case "volume":
      return t.volume.title;
    case "dock-tray":
      return t.dock.title;
    default:
      return null;
  }
}
