import { useEffect, useRef } from "react";
import { defineSlot } from "../../plugin-kernel/slots";
import { useIslandContributions } from "../../plugin-kernel/useIslandContributions";
import { setDockEnabled } from "../api";
import { useDockSettings } from "../useDockSettings";
import { OWNER } from "./owner.ts";

const runnerSlot = defineSlot<object>("island.runner/v1");

function DockRunner() {
  const [settings] = useDockSettings();
  const applied = useRef<string | null>(null);

  useIslandContributions(OWNER, "dock.island", [{ kind: "page", page: "dock-tray", enabled: settings.enabled }]);

  useEffect(() => {
    const wanted = `${settings.enabled}:${settings.screen}`;
    if (applied.current === wanted) return;
    applied.current = wanted;
    void setDockEnabled(settings.enabled, settings.screen).catch((error: unknown) => {
      console.error("Failed to apply the Dock setting", error);
      applied.current = null;
    });
  }, [settings.enabled, settings.screen]);

  return null;
}

runnerSlot.add({ id: "dock.runner", component: DockRunner }, OWNER);
