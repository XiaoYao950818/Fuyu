import type { ReactNode } from "react";
import type { IslandDecor } from "../../features/plugin-kernel/islandDecor";

export type IslandMode = "collapsed" | "expanded";

export type BuiltinPage = "music" | "clipboard" | "shelf" | "screenshots" | "timer" | "qq" | "device-battery" | "quick-launch" | "quick-commands" | "file-search" | "net-speed" | "volume";

export type HeaderDotPage = Extract<BuiltinPage, "music" | "clipboard" | "shelf" | "screenshots" | "timer" | "device-battery" | "quick-launch" | "quick-commands" | "file-search" | "net-speed" | "volume">;

export type PluginPageId = `plugin:${string}`;

export type IslandPage = BuiltinPage | PluginPageId;

export type IslandTabKind = "builtin" | "plugin";

export type IslandTab = { id: IslandPage; kind: IslandTabKind };

export type NativeGlassState = "active" | "css-fallback" | "disabled";

export type CollapsedSlots = IslandDecor & {
  gauges?: { id: string; node: ReactNode }[];
};
