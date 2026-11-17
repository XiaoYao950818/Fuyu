import type { PluginViewEntry } from "./api";
import { pluginPageId } from "./model.ts";

export type PluginPagePrefs = { order: string[]; hidden: string[] };

const MAX_ENTRIES = 100;

function cleanId(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const id = value.trim();
  if (!id || id.length > 200 || !/^[A-Za-z0-9][A-Za-z0-9\-_./:]*$/.test(id)) return null;
  return id;
}

function pluginPageIds(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  const ids: string[] = [];
  for (const entry of value) {
    const id = cleanId(entry);
    if (id && id.startsWith("plugin:") && !ids.includes(id)) ids.push(id);
    if (ids.length >= MAX_ENTRIES) break;
  }
  return ids;
}

function orderIds(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  const ids: string[] = [];
  for (const entry of value) {
    const id = cleanId(entry);
    if (id && !ids.includes(id)) ids.push(id);
    if (ids.length >= MAX_ENTRIES) break;
  }
  return ids;
}

export function normalizePluginPagePrefs(value: unknown): PluginPagePrefs {
  const record = value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
  return { order: orderIds(record.order), hidden: pluginPageIds(record.hidden) };
}

export function normalizePageOrder<T extends string>(storedOrder: readonly string[], availableIds: readonly T[]): T[] {
  const available: string[] = [];
  for (const id of availableIds) {
    if (cleanId(id) !== null && !available.includes(id)) available.push(id);
  }
  const known = new Set(available);
  const ordered: string[] = [];
  for (const id of storedOrder) {
    if (known.has(id) && !ordered.includes(id)) ordered.push(id);
  }
  for (const id of available) {
    if (!ordered.includes(id)) ordered.push(id);
  }
  return ordered.slice(0, MAX_ENTRIES) as T[];
}

export function defaultPageId<T extends string>(order: readonly T[], visibleIds: readonly T[]): T | null {
  const visible = new Set(visibleIds);
  return order.find((id) => visible.has(id)) ?? null;
}

export function reorderPageOrder<T extends string>(order: readonly T[], draggedId: T, targetId: T | null): readonly T[] {
  const from = order.indexOf(draggedId);
  if (from < 0 || order.length < 2) return order;
  if (targetId === null) {
    if (from === order.length - 1) return order;
    const next = [...order];
    next.splice(from, 1);
    next.push(draggedId);
    return next;
  }
  const to = order.indexOf(targetId);
  if (to < 0 || to === from || to === from + 1) return order;
  const next = [...order];
  next.splice(from, 1);
  next.splice(to > from ? to - 1 : to, 0, draggedId);
  return next;
}

export function movePageInList<T extends string>(order: readonly T[], id: T, step: -1 | 1): readonly T[] {
  const from = order.indexOf(id);
  const to = from + step;
  if (from < 0 || to < 0 || to >= order.length) return order;
  const next = [...order];
  [next[from], next[to]] = [next[to], next[from]];
  return next;
}

export function applySubsetOrder<T extends string>(fullOrder: readonly T[], subsetOrder: readonly T[], newSubsetOrder: readonly T[]): readonly T[] {
  if (subsetOrder.length !== newSubsetOrder.length || new Set(newSubsetOrder).size !== newSubsetOrder.length) return fullOrder;
  const subset = new Set(subsetOrder);
  for (const id of newSubsetOrder) {
    if (!subset.has(id)) return fullOrder;
  }
  const next: T[] = [];
  let index = 0;
  for (const id of fullOrder) {
    if (subset.has(id)) {
      next.push(newSubsetOrder[index]);
      index += 1;
    } else {
      next.push(id);
    }
  }
  return next;
}

const idOf = (view: PluginViewEntry): string => pluginPageId(view.pluginId, view.viewId);

export function orderPluginViews(views: readonly PluginViewEntry[], prefs: PluginPagePrefs): PluginViewEntry[] {
  const rank = (view: PluginViewEntry) => {
    const index = prefs.order.indexOf(idOf(view));
    return index < 0 ? Number.MAX_SAFE_INTEGER : index;
  };
  return views
    .map((view, index) => ({ view, index }))
    .sort((a, b) => rank(a.view) - rank(b.view) || a.index - b.index)
    .map(({ view }) => view);
}

export function visiblePluginViews(views: readonly PluginViewEntry[], prefs: PluginPagePrefs): PluginViewEntry[] {
  return orderPluginViews(views, prefs).filter((view) => !prefs.hidden.includes(idOf(view)));
}

export function movePluginPage(views: readonly PluginViewEntry[], prefs: PluginPagePrefs, id: string, step: -1 | 1): PluginPagePrefs {
  const ids = orderPluginViews(views, prefs).map(idOf);
  const from = ids.indexOf(id);
  const to = from + step;
  if (from < 0 || to < 0 || to >= ids.length) return prefs;
  [ids[from], ids[to]] = [ids[to], ids[from]];
  const rest = prefs.order.filter((known) => !ids.includes(known));
  return { ...prefs, order: [...ids, ...rest].slice(0, MAX_ENTRIES) };
}

export function setPluginPageHidden(prefs: PluginPagePrefs, id: string, hidden: boolean): PluginPagePrefs {
  const others = prefs.hidden.filter((known) => known !== id);
  return { ...prefs, hidden: hidden ? [...others, id].slice(0, MAX_ENTRIES) : others };
}
