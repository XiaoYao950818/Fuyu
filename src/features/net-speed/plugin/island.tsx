import { defineSlot, type IslandCollapsedMeta, type IslandPageMeta } from "../../plugin-kernel/slots";
import { NetSpeedGauge, type NetSpeedGaugeProps } from "../NetSpeedGauge";
import { NetSpeedPanel } from "../NetSpeedPanel";
import { islandPage } from "./page.ts";
import { NET_SPEED_HINT, OWNER } from "./owner.ts";

type NetSpeedPageProps = { mode: string };

type GaugeContext = NetSpeedGaugeProps & {
  hints: ReadonlySet<string>;
  listenIslandHover: (handler: (inside: boolean) => void) => Promise<() => void>;
};

const pageSlot = defineSlot<NetSpeedPageProps, IslandPageMeta<Readonly<Record<string, unknown>>>>("island.page/v1");
const gaugeSlot = defineSlot<GaugeContext, IslandCollapsedMeta<GaugeContext>>("island.collapsed/v1");

function NetSpeedPage({ mode }: NetSpeedPageProps) {
  return <NetSpeedPanel isOpen={mode === "expanded"} />;
}

pageSlot.add({ ...islandPage, component: NetSpeedPage }, OWNER);

gaugeSlot.add(
  {
    id: "net-speed",
    order: 71,
    group: "gauges",
    width: 140,
    hideable: true,
    shown: ({ hints }) => hints.has(NET_SPEED_HINT),
    component: NetSpeedGauge,
  },
  OWNER,
);
