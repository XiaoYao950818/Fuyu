import { invoke } from "@tauri-apps/api/core";
import type { QuickCommandResult } from "./types";

export function runQuickCommand(command: string): Promise<QuickCommandResult> {
  return invoke<QuickCommandResult>("run_quick_command", { command });
}
