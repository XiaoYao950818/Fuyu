import type { BuiltinPage } from "./types";

const TRAY_MENU_PAGES: Readonly<Record<string, BuiltinPage>> = {
  "file-shelf": "shelf",
};

export function trayMenuIslandPage(page: unknown): BuiltinPage | null {
  return typeof page === "string" && Object.prototype.hasOwnProperty.call(TRAY_MENU_PAGES, page) ? TRAY_MENU_PAGES[page] : null;
}
