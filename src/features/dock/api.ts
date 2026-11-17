import { invoke } from "@tauri-apps/api/core";
import { open as openDialog } from "@tauri-apps/plugin-dialog";
import type { DockAppList, DockScreen, TrayIconList } from "./types";

export async function pickDockFile(title: string): Promise<string | null> {
  const picked = await openDialog({ multiple: false, title });
  return typeof picked === "string" ? picked : null;
}

export function getDockApps(): Promise<DockAppList> {
  return invoke<DockAppList>("get_dock_apps");
}

export function activateDockApp(windowHandle: number): Promise<boolean> {
  return invoke<boolean>("activate_dock_app", { windowHandle });
}

export function getTrayIcons(): Promise<TrayIconList> {
  return invoke<TrayIconList>("get_tray_icons");
}

export function clickTrayIcon(iconId: string, button: "left" | "right"): Promise<boolean> {
  return invoke<boolean>("click_tray_icon", { iconId, button });
}

export function setDockEnabled(enabled: boolean, screen: DockScreen): Promise<void> {
  return invoke<void>("set_dock_enabled", { enabled, screen });
}
