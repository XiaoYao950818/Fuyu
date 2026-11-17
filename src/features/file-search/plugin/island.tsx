import { defineSlot, type IslandPageMeta } from "../../plugin-kernel/slots";
import { FileSearchPanel } from "../FileSearchPanel";
import { islandPage } from "./page.ts";
import { OWNER } from "./owner.ts";

const pageSlot = defineSlot<object, IslandPageMeta<Readonly<Record<string, unknown>>>>("island.page/v1");

function FileSearchPage() {
  return <FileSearchPanel />;
}

pageSlot.add({ ...islandPage, component: FileSearchPage }, OWNER);
