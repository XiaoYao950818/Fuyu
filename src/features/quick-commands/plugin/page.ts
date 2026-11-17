import { Terminal } from "lucide-react";
import type { IslandPageMeta } from "../../plugin-kernel/slots";

export const islandPage = {
  id: "quick-commands",
  order: 110,
  icon: Terminal,
  headerDot: true,
  shortcutOrder: 12,
  enabled: (features) => features["quick-commands"] === true,
} satisfies IslandPageMeta<Readonly<Record<string, unknown>>> & { id: string; order: number };
