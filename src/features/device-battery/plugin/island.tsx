import { defineSlot, type IslandPageMeta } from "../../plugin-kernel/slots";
import { DeviceBatteryPanel } from "../DeviceBatteryPanel";
import { islandPage } from "./page.ts";
import { OWNER } from "./owner.ts";

type DeviceBatteryPageProps = { mode: string };

const pageSlot = defineSlot<DeviceBatteryPageProps, IslandPageMeta<Readonly<Record<string, unknown>>>>("island.page/v1");

function DeviceBatteryPage({ mode }: DeviceBatteryPageProps) {
  return <DeviceBatteryPanel isOpen={mode === "expanded"} />;
}

pageSlot.add({ ...islandPage, component: DeviceBatteryPage }, OWNER);
