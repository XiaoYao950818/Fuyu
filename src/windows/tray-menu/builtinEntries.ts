import type { CSSProperties } from "react";
import type { TrayMedia } from "./trayCard";

const TRAY_ENTRY_PLUGINS = {
  screenshot: "screenshot",
  clipboard: "clipboard",
  "file-shelf": "file-shelf",
  music: "music",
} as const;

export type TrayEntry = keyof typeof TRAY_ENTRY_PLUGINS;

export function entryShown(off: ReadonlySet<string>, entry: TrayEntry) {
  return !off.has(TRAY_ENTRY_PLUGINS[entry]);
}

type Status = { media: TrayMedia | null };

export function shownStatus<T extends Status>(status: T, off: ReadonlySet<string>): T {
  return {
    ...status,
    media: entryShown(off, "music") ? status.media : null,
  };
}

export type TrayFeatureEntry = Extract<TrayEntry, "screenshot" | "clipboard">;

export function shownFeatures(off: ReadonlySet<string>, features: readonly TrayFeatureEntry[]) {
  return features.filter((feature) => entryShown(off, feature));
}

export function columns(count: number): CSSProperties {
  return { "--tray-cols": Math.max(1, count) } as CSSProperties;
}
