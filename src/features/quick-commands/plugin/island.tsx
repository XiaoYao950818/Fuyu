import { defineSlot, type IslandPageMeta } from "../../plugin-kernel/slots";
import { QuickCommandsPanel } from "../QuickCommandsPanel";
import { islandPage } from "./page.ts";
import { OWNER } from "./owner.ts";

const pageSlot = defineSlot<object, IslandPageMeta<Readonly<Record<string, unknown>>>>("island.page/v1");

function QuickCommandsPage() {
  return <QuickCommandsPanel />;
}

pageSlot.add({ ...islandPage, component: QuickCommandsPage }, OWNER);
