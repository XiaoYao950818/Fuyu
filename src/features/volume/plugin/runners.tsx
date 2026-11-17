import { useMemo } from "react";
import type { IslandContribution } from "../../plugin-kernel/islandContributions";
import { defineSlot } from "../../plugin-kernel/slots";
import { useIslandContributions } from "../../plugin-kernel/useIslandContributions";
import { useVolumeSettings } from "../useVolumeSettings";
import { OWNER, VOLUME_HINT } from "./owner.ts";

const runnerSlot = defineSlot<object>("island.runner/v1");

function VolumeHint() {
  const [settings] = useVolumeSettings();
  const list = useMemo<IslandContribution[]>(
    () => (settings.enabled ? [{ kind: "hint", key: VOLUME_HINT }] : []),
    [settings.enabled],
  );
  useIslandContributions(OWNER, "volume.hint", list);
  return null;
}

runnerSlot.add({ id: "volume.hint", component: VolumeHint }, OWNER);
