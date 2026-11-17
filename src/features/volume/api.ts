import { invoke } from "@tauri-apps/api/core";
import type { VolumeState } from "./types";

export function getVolumeState(): Promise<VolumeState> {
  return invoke<VolumeState>("get_volume_state");
}

export function setMasterVolumeLevel(level: number): Promise<VolumeState> {
  return invoke<VolumeState>("set_master_volume_level", { level });
}

export function setMasterMuted(muted: boolean): Promise<VolumeState> {
  return invoke<VolumeState>("set_master_muted", { muted });
}

export function setSessionVolume(processId: number, level: number): Promise<void> {
  return invoke<void>("set_session_volume", { processId, level });
}

export function setSessionMuted(processId: number, muted: boolean): Promise<void> {
  return invoke<void>("set_session_muted", { processId, muted });
}
