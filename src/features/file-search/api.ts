import { invoke } from "@tauri-apps/api/core";
import { openPath, revealItemInDir } from "@tauri-apps/plugin-opener";
import type { FileSearchItem, FileSearchStatus } from "./types";

export function getFileSearchStatus(): Promise<FileSearchStatus> {
  return invoke<FileSearchStatus>("file_search_status");
}

export function searchFiles(query: string, limit: number): Promise<FileSearchItem[]> {
  return invoke<FileSearchItem[]>("search_files", { query, limit });
}

export function startFileIndex(): Promise<void> {
  return invoke<void>("start_file_index");
}

export function openFileSearchItem(item: FileSearchItem): Promise<void> {
  return openPath(item.path);
}

export function revealFileSearchItem(item: FileSearchItem): Promise<void> {
  return revealItemInDir(item.path);
}
