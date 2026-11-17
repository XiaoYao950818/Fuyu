import { Volume2 } from "lucide-react";
import type { IslandPageMeta } from "../../plugin-kernel/slots";

export const islandPage = {
  id: "volume",
  order: 140,
  icon: Volume2,
  headerDot: true,
  shortcutOrder: 15,
  enabled: (features) => features["volume"] === true,
} satisfies IslandPageMeta<Readonly<Record<string, unknown>>> & { id: string; order: number };
