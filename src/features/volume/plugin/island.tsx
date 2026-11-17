import { defineSlot, type IslandCollapsedMeta, type IslandPageMeta } from "../../plugin-kernel/slots";
import { VolumeGauge, type VolumeGaugeProps } from "../VolumeGauge";
import { VolumePanel } from "../VolumePanel";
import { islandPage } from "./page.ts";
import { OWNER, VOLUME_HINT } from "./owner.ts";

type VolumePageProps = { mode: string };

type GaugeContext = VolumeGaugeProps & {
  hints: ReadonlySet<string>;
  listenIslandHover: (handler: (inside: boolean) => void) => Promise<() => void>;
};

const pageSlot = defineSlot<VolumePageProps, IslandPageMeta<Readonly<Record<string, unknown>>>>("island.page/v1");
const gaugeSlot = defineSlot<GaugeContext, IslandCollapsedMeta<GaugeContext>>("island.collapsed/v1");

function VolumePage({ mode }: VolumePageProps) {
  return <VolumePanel isOpen={mode === "expanded"} />;
}

pageSlot.add({ ...islandPage, component: VolumePage }, OWNER);

gaugeSlot.add(
  {
    id: "volume",
    order: 72,
    group: "gauges",
    width: 84,
    hideable: true,
    shown: ({ hints }) => hints.has(VOLUME_HINT),
    component: VolumeGauge,
  },
  OWNER,
);
