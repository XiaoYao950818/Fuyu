import { defineSlot, type IslandPageMeta } from "../../plugin-kernel/slots";
import { TrayPanel } from "../TrayPanel";
import { islandPage } from "./page.ts";
import { OWNER } from "./owner.ts";

const pageSlot = defineSlot<TrayPageProps, IslandPageMeta<Readonly<Record<string, unknown>>>>("island.page/v1");

type TrayPageProps = { mode: string };

function TrayPage({ mode }: TrayPageProps) {
  return <TrayPanel isOpen={mode === "expanded"} />;
}

pageSlot.add({ ...islandPage, component: TrayPage }, OWNER);
