import { useCallback, useEffect, useMemo, useRef } from "react";
import type { IslandSettings } from "../../lib/settings/types";
import { useUnsupportedFeatures } from "../../lib/platform";
import { normalizePageOrder } from "../../features/plugin-views/pagePrefs";
import { defaultTabOrder, foldScreenshotsIntoClipboard, isPageEnabled, resolveIslandPage, withoutUnsupported, type IslandFeatures } from "./features";
import type { IslandPage, PluginPageId } from "./types";
import { usePluginOpenView } from "./usePluginOpenView";
import { useBuiltinEnabled } from "../../features/plugin-kernel/useBuiltinPlugins";
import { useIslandContributed } from "../../features/plugin-kernel/useIslandContributions";
import type { usePluginPages } from "./usePluginPages";

const NO_PLUGIN_PAGES: readonly PluginPageId[] = [];

type IslandFeatureOptions = {
  settings: IslandSettings;
  page: IslandPage;
  setPage: (page: IslandPage) => void;
  openIslandPage: (page: IslandPage) => void;
  pluginPages?: ReturnType<typeof usePluginPages>;
};

export function useIslandFeatures({
  settings,
  page,
  setPage,
  openIslandPage,
  pluginPages,
}: IslandFeatureOptions) {
  const unsupported = useUnsupportedFeatures();
  const timer = useBuiltinEnabled("timer");
  const deviceBattery = useBuiltinEnabled("device-battery");
  const quickLaunch = useBuiltinEnabled("quick-launch");
  const quickCommands = useBuiltinEnabled("quick-commands");
  const fileSearch = useBuiltinEnabled("file-search");
  const netSpeed = useBuiltinEnabled("net-speed");
  const volume = useBuiltinEnabled("volume");
  const clipboardEnabled = useBuiltinEnabled("clipboard");
  const { pages, settled } = useIslandContributed();
  const qqEnabled = pages.qq === true;
  const wechatEnabled = pages.wechat === true;
  const dockEnabled = pages["dock-tray"] === true;
  const pluginPageIds = pluginPages?.pageIds;
  const features = useMemo<IslandFeatures>(() => foldScreenshotsIntoClipboard(withoutUnsupported({
    music: settings.musicEnabled,
    clipboard: clipboardEnabled,
    shelf: settings.shelfEnabled,
    screenshots: settings.screenshotEnabled,
    timer,
    "device-battery": deviceBattery,
    "quick-launch": quickLaunch,
    "quick-commands": quickCommands,
    "file-search": fileSearch,
    "net-speed": netSpeed,
    volume,
    qq: qqEnabled,
    wechat: wechatEnabled,
    dock: dockEnabled,
    qqMail: settings.mailEnabled,
    pluginPages: pluginPageIds,
  }, unsupported)), [unsupported, timer, deviceBattery, quickLaunch, quickCommands, fileSearch, netSpeed, volume, pluginPageIds, clipboardEnabled, qqEnabled, settings.mailEnabled, settings.musicEnabled, settings.screenshotEnabled, settings.shelfEnabled, wechatEnabled, dockEnabled]);

  const availableTabs = useMemo<IslandPage[]>(() => [...defaultTabOrder(), ...(pluginPages?.allPageIds ?? NO_PLUGIN_PAGES)], [pluginPages?.allPageIds]);
  const orderedTabs = useMemo(() => normalizePageOrder(pluginPages?.prefs.order ?? [], availableTabs), [pluginPages?.prefs.order, availableTabs]);
  const visibleTabs = useMemo(() => orderedTabs.filter((candidate) => isPageEnabled(candidate, features)), [orderedTabs, features]);

  const initialPageRef = useRef(page);
  const defaultAppliedRef = useRef(false);
  useEffect(() => {
    if (!settled) return;
    if (page !== initialPageRef.current) {
      defaultAppliedRef.current = true;
      return;
    }
    if (!defaultAppliedRef.current) {
      const first = visibleTabs[0] ?? null;
      if (first && first !== page) {
        defaultAppliedRef.current = true;
        setPage(first);
        return;
      }
    }
    const next = resolveIslandPage(page, features, orderedTabs);
    if (next && next !== page) setPage(next);
  }, [features, page, setPage, settled, orderedTabs, visibleTabs]);

  const openEnabledPage = useCallback((target: IslandPage) => {
    const next = resolveIslandPage(target, features, orderedTabs);
    if (next) openIslandPage(next);
  }, [features, openIslandPage, orderedTabs]);
  usePluginOpenView(pluginPageIds ?? NO_PLUGIN_PAGES, openEnabledPage);

  return { features, openEnabledPage, orderedTabs, visibleTabs };
}
