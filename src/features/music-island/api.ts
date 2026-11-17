import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";

export function getMusicIslandMedia() {
  return invoke<unknown>("get_media_state", { target: undefined });
}

export function setMusicIslandVisible(visible: boolean): Promise<void> {
  return invoke<void>("set_music_island_visible", { visible });
}

export function requestMusicIslandClose(): Promise<void> {
  return invoke<void>("request_music_island_close", {});
}

export const MUSIC_ISLAND_CLOSE_EVENT = "music-island-close-requested";

export function listenMusicIslandClose(handler: () => void) {
  return listen<void>(MUSIC_ISLAND_CLOSE_EVENT, () => handler());
}
