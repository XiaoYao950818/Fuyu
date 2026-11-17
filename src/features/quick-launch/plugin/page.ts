import { Rocket } from "lucide-react";
import type { IslandPageMeta } from "../../plugin-kernel/slots";

export const islandPage = {
  id: "quick-launch",
  order: 100,
  icon: Rocket,
  headerDot: true,
  shortcutOrder: 11,
  enabled: (features) => features["quick-launch"] === true,
} satisfies IslandPageMeta<Readonly<Record<string, unknown>>> & { id: string; order: number };
