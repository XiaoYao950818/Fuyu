import { defineSlot, type IslandPageMeta } from "../../plugin-kernel/slots";
import { QuickLaunchPanel } from "../QuickLaunchPanel";
import { islandPage } from "./page.ts";
import { OWNER } from "./owner.ts";

const pageSlot = defineSlot<object, IslandPageMeta<Readonly<Record<string, unknown>>>>("island.page/v1");

function QuickLaunchPage() {
  return <QuickLaunchPanel />;
}

pageSlot.add({ ...islandPage, component: QuickLaunchPage }, OWNER);
