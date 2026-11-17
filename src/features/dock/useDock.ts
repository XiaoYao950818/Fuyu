import { useCallback, useEffect, useState } from "react";
import { activateDockApp, clickTrayIcon, getDockApps, getTrayIcons } from "./api";
import { normalizeDockAppList, normalizeTrayIconList } from "./dock";
import type { DockAppList, TrayIconList } from "./types";
import { useDockSettings } from "./useDockSettings";

const POLL_MS = 2000;

export function useDock(active: boolean) {
  const [settings] = useDockSettings();
  const [apps, setApps] = useState<DockAppList | null>(null);
  const [tray, setTray] = useState<TrayIconList | null>(null);
  const [error, setError] = useState<unknown>(null);

  const refresh = useCallback(() => {
    Promise.all([getDockApps(), getTrayIcons()])
      .then(([nextApps, nextTray]) => {
        setApps(normalizeDockAppList(nextApps));
        setTray(normalizeTrayIconList(nextTray));
        setError(null);
      })
      .catch((caught: unknown) => setError(caught));
  }, []);

  useEffect(() => {
    if (!active || !settings.enabled) return;
    refresh();
    const id = window.setInterval(refresh, POLL_MS);
    return () => window.clearInterval(id);
  }, [active, settings.enabled, refresh]);

  const activate = useCallback(
    (windowHandle: number) => {
      activateDockApp(windowHandle).then(refresh).catch((caught: unknown) => setError(caught));
    },
    [refresh],
  );

  const clickTray = useCallback(
    (iconId: string, button: "left" | "right") => {
      clickTrayIcon(iconId, button).then(refresh).catch((caught: unknown) => setError(caught));
    },
    [refresh],
  );

  return { apps, tray, error, enabled: settings.enabled, pinned: settings.pinned, refresh, activate, clickTray };
}
