import { Bell } from "lucide-react";
import type { IslandPageMeta } from "../../plugin-kernel/slots";

export const islandPage = {
  id: "dock-tray",
  order: 150,
  icon: Bell,
  headerDot: true,
  shortcutOrder: 16,
  enabled: (features) => features["dock"] === true,
} satisfies IslandPageMeta<Readonly<Record<string, unknown>>> & { id: string; order: number };
