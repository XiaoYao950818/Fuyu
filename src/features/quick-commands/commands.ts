import type { QuickCommandItem } from "./types";

export type CommandResultKind = "error" | "timedOut" | "exited" | "unknown";

export function combineCommandOutput(stdout: string, stderr: string): string {
  const parts = [stdout, stderr].map((part) => part.trimEnd()).filter((part) => part !== "");
  return parts.join("\n");
}

export function commandResultKind(result: { error: string | null; timedOut: boolean; exitCode: number | null }): CommandResultKind {
  if (result.error !== null) return "error";
  if (result.timedOut) return "timedOut";
  if (result.exitCode !== null) return "exited";
  return "unknown";
}

export function buildCommandItem(name: string, command: string, id: string): QuickCommandItem | null {
  const trimmedName = name.trim();
  const trimmedCommand = command.trim();
  if (trimmedName === "" || trimmedCommand === "" || id === "") return null;
  return { id, name: trimmedName, command: trimmedCommand };
}
