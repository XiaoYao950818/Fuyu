import { BatteryCharging } from "lucide-react";
import type { IslandPageMeta } from "../../plugin-kernel/slots";

export const islandPage = {
  id: "device-battery",
  order: 90,
  icon: BatteryCharging,
  headerDot: true,
  shortcutOrder: 10,
  enabled: (features) => features["device-battery"] === true,
} satisfies IslandPageMeta<Readonly<Record<string, unknown>>> & { id: string; order: number };
