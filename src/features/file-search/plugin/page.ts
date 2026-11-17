import { Search } from "lucide-react";
import type { IslandPageMeta } from "../../plugin-kernel/slots";

export const islandPage = {
  id: "file-search",
  order: 120,
  icon: Search,
  headerDot: true,
  shortcutOrder: 13,
  enabled: (features) => features["file-search"] === true,
} satisfies IslandPageMeta<Readonly<Record<string, unknown>>> & { id: string; order: number };
