import { open as openDialog } from "@tauri-apps/plugin-dialog";
import { openPath, openUrl } from "@tauri-apps/plugin-opener";
import { normalizeLaunchUrl } from "./launch";
import type { QuickLaunchItem } from "./types";

export function openQuickLaunchItem(item: QuickLaunchItem): Promise<void> {
  if (item.kind === "url") {
    return openUrl(normalizeLaunchUrl(item.target));
  }
  return openPath(item.target);
}

export async function pickQuickLaunchFile(title: string): Promise<string | null> {
  const picked = await openDialog({ multiple: false, title });
  return typeof picked === "string" ? picked : null;
}

export async function pickQuickLaunchFolder(title: string): Promise<string | null> {
  const picked = await openDialog({ directory: true, multiple: false, title });
  return typeof picked === "string" ? picked : null;
}
