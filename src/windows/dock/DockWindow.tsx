import { useCallback, useEffect } from "react";
import { openPath } from "@tauri-apps/plugin-opener";
import { DockBar } from "../../features/dock/DockBar";
import { mergeDockEntries } from "../../features/dock/dock";
import type { DockEntry } from "../../features/dock/types";
import { useDock } from "../../features/dock/useDock";
import { useDockClock } from "../../features/dock/useDockClock";
import { useSystemDark } from "../../lib/theme/useResolvedTheme";
import { useWindowAccent } from "../../lib/theme/useWindowAccent";
import { openSettingsWindow } from "../settings/api";
import "./DockWindow.css";

export function DockWindow() {
  const light = !useSystemDark();
  useWindowAccent();
  const clock = useDockClock();
  const { apps, pinned, activate } = useDock(true);
  const entries = apps === null ? [] : mergeDockEntries(pinned, apps.apps);

  useEffect(() => {
    document.documentElement.classList.toggle("island-light", light);
  }, [light]);

  const onActivate = useCallback(
    (entry: DockEntry) => {
      if (entry.windowHandle !== null) {
        activate(entry.windowHandle);
        return;
      }
      if (entry.target !== null) {
        void openPath(entry.target).catch((error: unknown) => console.error("Failed to open the pinned app", error));
      }
    },
    [activate],
  );

  return (
    <div className="dock-window">
      <DockBar entries={entries} clock={clock} empty={apps !== null && entries.length === 0} onActivate={onActivate} onOpenSettings={() => openSettingsWindow()} />
    </div>
  );
}
