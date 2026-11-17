import type { QuickLaunchItem, QuickLaunchKind } from "./types";

export function normalizeLaunchUrl(target: string): string {
  const trimmed = target.trim();
  if (/^[a-z][a-z0-9+.-]*:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

export function baseName(target: string): string {
  const trimmed = target.replace(/[/\\]+$/, "");
  const parts = trimmed.split(/[/\\]/);
  const last = parts[parts.length - 1] ?? "";
  return last.replace(/\.[^.]+$/, "") || last;
}

export function buildLaunchItem(name: string, target: string, kind: QuickLaunchKind, id: string): QuickLaunchItem | null {
  const trimmedName = name.trim();
  const trimmedTarget = target.trim();
  if (trimmedName === "" || trimmedTarget === "" || id === "") return null;
  return { id, name: trimmedName, target: trimmedTarget, kind };
}
