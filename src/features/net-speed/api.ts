import { invoke } from "@tauri-apps/api/core";
import type { NetSpeed } from "./types";

export function getNetSpeed(): Promise<NetSpeed> {
  return invoke<NetSpeed>("get_net_speed");
}
