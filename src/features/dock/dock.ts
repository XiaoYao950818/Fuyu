import type { DockApp, DockAppList, DockEntry, DockPinnedApp, TrayIcon, TrayIconList } from "./types";

export function normalizeDockApp(value: unknown): DockApp | null {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return null;
  const app = value as Partial<DockApp>;
  if (typeof app.windowHandle !== "number" || !Number.isInteger(app.windowHandle) || app.windowHandle <= 0) return null;
  return {
    windowHandle: app.windowHandle,
    title: typeof app.title === "string" ? app.title : "",
    exePath: typeof app.exePath === "string" && app.exePath !== "" ? app.exePath : null,
    icon: typeof app.icon === "string" && app.icon !== "" ? app.icon : null,
    minimized: app.minimized === true,
    active: app.active === true,
  };
}

export function normalizeDockApps(value: unknown): DockApp[] {
  if (!Array.isArray(value)) return [];
  const seen = new Set<number>();
  const apps: DockApp[] = [];
  for (const entry of value) {
    const app = normalizeDockApp(entry);
    if (app === null || seen.has(app.windowHandle)) continue;
    seen.add(app.windowHandle);
    apps.push(app);
  }
  return apps;
}

export function normalizeDockAppList(value: unknown): DockAppList {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return { available: false, apps: [] };
  const list = value as Partial<DockAppList>;
  return { available: list.available === true, apps: normalizeDockApps(list.apps) };
}

export function sortDockApps(apps: DockApp[]): DockApp[] {
  return [...apps].sort((left, right) => {
    if (left.active !== right.active) return left.active ? -1 : 1;
    if (left.minimized !== right.minimized) return left.minimized ? 1 : -1;
    const byTitle = left.title.localeCompare(right.title);
    if (byTitle !== 0) return byTitle;
    return left.windowHandle - right.windowHandle;
  });
}

export function mergeDockEntries(pinned: DockPinnedApp[], running: DockApp[]): DockEntry[] {
  const entries: DockEntry[] = [];
  const used = new Set<number>();
  for (const item of pinned) {
    const match = running.find((app) => !used.has(app.windowHandle) && app.exePath !== null && app.exePath.toLowerCase() === item.target.toLowerCase());
    if (match) {
      used.add(match.windowHandle);
      entries.push({
        id: item.id,
        name: item.name,
        icon: match.icon,
        target: item.target,
        windowHandle: match.windowHandle,
        minimized: match.minimized,
        active: match.active,
        pinned: true,
      });
    } else {
      entries.push({
        id: item.id,
        name: item.name,
        icon: null,
        target: item.target,
        windowHandle: null,
        minimized: false,
        active: false,
        pinned: true,
      });
    }
  }
  for (const app of sortDockApps(running)) {
    if (used.has(app.windowHandle)) continue;
    entries.push({
      id: `running-${app.windowHandle}`,
      name: app.title,
      icon: app.icon,
      target: app.exePath,
      windowHandle: app.windowHandle,
      minimized: app.minimized,
      active: app.active,
      pinned: false,
    });
  }
  return entries;
}

export function normalizeTrayIcon(value: unknown): TrayIcon | null {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return null;
  const icon = value as Partial<TrayIcon>;
  if (typeof icon.id !== "string" || icon.id === "") return null;
  return {
    id: icon.id,
    name: typeof icon.name === "string" ? icon.name : "",
    exePath: typeof icon.exePath === "string" && icon.exePath !== "" ? icon.exePath : null,
    icon: typeof icon.icon === "string" && icon.icon !== "" ? icon.icon : null,
    overflow: icon.overflow === true,
  };
}

export function normalizeTrayIcons(value: unknown): TrayIcon[] {
  if (!Array.isArray(value)) return [];
  const seen = new Set<string>();
  const icons: TrayIcon[] = [];
  for (const entry of value) {
    const icon = normalizeTrayIcon(entry);
    if (icon === null || seen.has(icon.id)) continue;
    seen.add(icon.id);
    icons.push(icon);
  }
  return icons;
}

export function normalizeTrayIconList(value: unknown): TrayIconList {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return { available: false, overflowAvailable: false, icons: [] };
  const list = value as Partial<TrayIconList>;
  return {
    available: list.available === true,
    overflowAvailable: list.overflowAvailable === true,
    icons: normalizeTrayIcons(list.icons),
  };
}

export function trayDisplayName(icon: TrayIcon, unknownApp: string): string {
  const name = icon.name.trim();
  if (name !== "") return name;
  const path = icon.exePath ?? "";
  const base = path.split(/[/\\]/).pop() ?? "";
  const stem = base.replace(/\.[^.]+$/, "");
  if (stem !== "") return stem;
  return unknownApp;
}

export function trayFallbackLetter(name: string): string {
  const trimmed = name.trim();
  if (trimmed === "") return "?";
  return trimmed[0]?.toUpperCase() ?? "?";
}

export function baseName(target: string): string {
  const trimmed = target.replace(/[/\\]+$/, "");
  const parts = trimmed.split(/[/\\]/);
  const last = parts[parts.length - 1] ?? "";
  return last.replace(/\.[^.]+$/, "") || last;
}

export function buildDockPinnedItem(name: string, target: string, id: string): DockPinnedApp | null {
  const trimmedName = name.trim();
  const trimmedTarget = target.trim();
  if (trimmedName === "" || trimmedTarget === "" || id === "") return null;
  return { id, name: trimmedName, target: trimmedTarget };
}

export function formatDockClock(date: Date, locale: string): { time: string; date: string } {
  const time = new Intl.DateTimeFormat(locale, { hour: "2-digit", minute: "2-digit", hour12: false }).format(date);
  const day = new Intl.DateTimeFormat(locale, { month: "numeric", day: "numeric", weekday: "short" }).format(date);
  return { time, date: day };
}
