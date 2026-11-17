import type { PluginViewEntry } from "../../features/plugin-views/api";
import { viewIcon } from "../../features/plugin-views/icons";
import { pluginPageId } from "../../features/plugin-views/model";
import { useLocale, useTranslation } from "../../i18n";
import { pageShortcutLabel, type IslandFeatures } from "./features";
import type { IslandPage } from "./types";
import { usePageHoverSwitch } from "./usePageHoverSwitch";
import type { PageTabDragHandle } from "./usePageTabDrag";
import "./PluginPageButton.css";
import { shortcutLabel } from "../../lib/shortcut/shortcut";

export function PluginPageButton({
  view,
  page,
  features,
  modifiers,
  hoverSwitchPage,
  hoverSwitchDelayMs,
  onOpen,
  dragHandle,
  dragged,
  dropBefore,
  dropAfter,
}: {
  view: PluginViewEntry;
  page: IslandPage;
  features: IslandFeatures;
  modifiers: string;
  hoverSwitchPage: boolean;
  hoverSwitchDelayMs: number;
  onOpen: (page: IslandPage) => void;
  dragHandle?: PageTabDragHandle;
  dragged?: boolean;
  dropBefore?: boolean;
  dropAfter?: boolean;
}) {
  const t = useTranslation();
  const { locale } = useLocale();
  const hoverSwitch = usePageHoverSwitch(hoverSwitchPage, hoverSwitchDelayMs, page, onOpen);
  const id = pluginPageId(view.pluginId, view.viewId);
  const Icon = viewIcon(view.icon);
  const label = t.pluginViews.pageLabel(view.title[locale], view.pluginName[locale]);
  const shortcut = pageShortcutLabel(features, id, modifiers);
  const title = shortcut ? `${label} (${shortcutLabel(shortcut)})` : label;
  const className = `plugin-page-button${page === id ? " plugin-page-button--active" : ""}${dragged ? " plugin-page-button--dragging" : ""}${dropBefore ? " plugin-page-button--drop-before" : ""}${dropAfter ? " plugin-page-button--drop-after" : ""}`;
  return (
    <button
      className={className}
      type="button"
      data-plugin-page={id}
      aria-label={title}
      aria-pressed={page === id}
      {...hoverSwitch(id)}
      {...(dragHandle
        ? {
            draggable: dragHandle.draggable,
            onDragStart: dragHandle.onDragStart,
            onDragOver: dragHandle.onDragOver,
            onDragLeave: dragHandle.onDragLeave,
            onDrop: dragHandle.onDrop,
            onDragEnd: dragHandle.onDragEnd,
          }
        : {})}
      onClick={(event) => {
        event.stopPropagation();
        onOpen(id);
      }}
    >
      <Icon size={14} strokeWidth={1.5} absoluteStrokeWidth aria-hidden="true" />
    </button>
  );
}
