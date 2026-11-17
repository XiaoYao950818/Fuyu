import { Gauge } from "lucide-react";
import type { IslandPageMeta } from "../../plugin-kernel/slots";

export const islandPage = {
  id: "net-speed",
  order: 130,
  icon: Gauge,
  headerDot: true,
  shortcutOrder: 14,
  enabled: (features) => features["net-speed"] === true,
} satisfies IslandPageMeta<Readonly<Record<string, unknown>>> & { id: string; order: number };
