import { useMemo } from "react";
import type { IslandContribution } from "../../plugin-kernel/islandContributions";
import { defineSlot } from "../../plugin-kernel/slots";
import { useIslandContributions } from "../../plugin-kernel/useIslandContributions";
import { useNetSpeedSettings } from "../useNetSpeedSettings";
import { NET_SPEED_HINT, OWNER } from "./owner.ts";

const runnerSlot = defineSlot<object>("island.runner/v1");

function NetSpeedHint() {
  const [settings] = useNetSpeedSettings();
  const list = useMemo<IslandContribution[]>(
    () => (settings.enabled ? [{ kind: "hint", key: NET_SPEED_HINT }] : []),
    [settings.enabled],
  );
  useIslandContributions(OWNER, "net-speed.hint", list);
  return null;
}

runnerSlot.add({ id: "net-speed.hint", component: NetSpeedHint }, OWNER);
