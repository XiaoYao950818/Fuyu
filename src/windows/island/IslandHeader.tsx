import { SlotView } from "../../features/plugin-kernel/SlotView";
import { useSlotEntries } from "../../features/plugin-kernel/useSlotEntries";
import { useIslandContributed } from "../../features/plugin-kernel/useIslandContributions";
import { useTranslation } from "../../i18n";
import { headerDotPages, isPageEnabled, type IslandFeatures } from "./features";
import { headerSlot, withShortcut, type IslandHeaderContext } from "./slots/header";
import { pageSlot } from "./slots/pageSlot";
import "./slots/builtins";
import type { HeaderDotPage, IslandPage, IslandTab } from "./types";
import { usePageHoverSwitch } from "./usePageHoverSwitch";
import { PluginPageButton } from "./PluginPageButton";
import type { PluginViewEntry } from "../../features/plugin-views/api";
import { pluginPageId } from "../../features/plugin-views/model";
import type { PageTabDrag } from "./usePageTabDrag";
import "./IslandHeader.css";

type IslandHeaderProps = {
  page: IslandPage;
  features: IslandFeatures;
  showTitle: boolean;
  isDetached: boolean;
  onPageChange: (page: IslandPage) => void;
  onCollapse: () => void;
  onOpenSettings: (section?: "updates") => void;
  onResetPosition: () => void;
  minimizesToTray: boolean;
  onMinimize: () => void;
  pageDigitModifiers: string;
  hoverSwitchPage: boolean;
  hoverSwitchDelayMs: number;
  tabs?: readonly IslandTab[];
  pluginViews?: readonly PluginViewEntry[];
  tabDrag?: PageTabDrag;
};

export function IslandHeader({
  page,
  features,
  showTitle,
  isDetached,
  onPageChange,
  onCollapse,
  onOpenSettings,
  onResetPosition,
  minimizesToTray,
  onMinimize,
  pageDigitModifiers,
  hoverSwitchPage,
  hoverSwitchDelayMs,
  tabs,
  pluginViews,
  tabDrag,
}: IslandHeaderProps) {
  const t = useTranslation();
  const { hints } = useIslandContributed();
  const hoverSwitch = usePageHoverSwitch(hoverSwitchPage, hoverSwitchDelayMs, page, onPageChange);
  const pages = useSlotEntries(pageSlot);
  const dots = headerDotPages(pages, features);
  const buttons: IslandHeaderContext = {
    page,
    features,
    isDetached,
    onOpenSettings,
    hints,
    onResetPosition,
    minimizesToTray,
    onMinimize,
    pageDigitModifiers,
    withShortcut: (label, target) => withShortcut({ features, pageDigitModifiers }, label, target),
    isPageEnabled: (target) => isPageEnabled(target, features),
  };
  const pageLabel = (target: HeaderDotPage) => ({
    music: t.island.music,
    clipboard: t.island.clipboardHistory,
    shelf: t.island.shelf,
    screenshots: t.island.screenshots,
    timer: t.island.timer,
    "device-battery": t.deviceBattery.title,
    "quick-launch": t.quickLaunch.title,
    "quick-commands": t.quickCommands.title,
    "file-search": t.fileSearch.title,
    "net-speed": t.netSpeed.title,
    volume: t.volume.title,
  })[target];
  const dragState = (id: IslandPage) => {
    if (!tabDrag) return null;
    return {
      handle: tabDrag.handleFor(id),
      dragged: tabDrag.draggedId === id,
      dropBefore: tabDrag.dropId === id && tabDrag.dropBefore,
      dropAfter: tabDrag.dropId === id && !tabDrag.dropBefore,
    };
  };
  const renderDot = (target: HeaderDotPage, Icon: (typeof dots)[number]["icon"]) => {
    const drag = dragState(target);
    const className = `dot-button dot-button--${target}${page === target ? " dot-button--active" : ""}${drag?.dragged ? " dot-button--dragging" : ""}${drag?.dropBefore ? " dot-button--drop-before" : ""}${drag?.dropAfter ? " dot-button--drop-after" : ""}`;
    return (
      <button
        key={target}
        className={className}
        type="button"
        aria-label={withShortcut(buttons, pageLabel(target), target)}
        aria-pressed={page === target}
        {...hoverSwitch(target)}
        {...(drag
          ? {
              draggable: drag.handle.draggable,
              onDragStart: drag.handle.onDragStart,
              onDragOver: drag.handle.onDragOver,
              onDragLeave: drag.handle.onDragLeave,
              onDrop: drag.handle.onDrop,
              onDragEnd: drag.handle.onDragEnd,
            }
          : {})}
        onClick={(event) => {
          event.stopPropagation();
          onPageChange(target);
        }}
      >
        {Icon && <Icon size={15} strokeWidth={1.8} absoluteStrokeWidth aria-hidden="true" />}
      </button>
    );
  };
  return (
    <header className="island__header">
      <div className="island__header-start">
      <div className="island__title">
        {showTitle && <span>{t.island.appName}</span>}
      </div>

      <div className="editor-dots" aria-label={t.island.editor}>
        {tabs
          ? tabs.map((tab) => {
              if (tab.kind === "plugin") {
                const view = pluginViews?.find((entry) => pluginPageId(entry.pluginId, entry.viewId) === tab.id);
                if (!view) return null;
                const drag = dragState(tab.id);
                return (
                  <PluginPageButton
                    key={tab.id}
                    view={view}
                    page={page}
                    features={features}
                    modifiers={pageDigitModifiers}
                    hoverSwitchPage={hoverSwitchPage}
                    hoverSwitchDelayMs={hoverSwitchDelayMs}
                    onOpen={onPageChange}
                    dragHandle={drag?.handle}
                    dragged={drag?.dragged}
                    dropBefore={drag?.dropBefore}
                    dropAfter={drag?.dropAfter}
                  />
                );
              }
              const item = pages.find((entry) => entry.id === tab.id);
              if (!item?.icon) return null;
              return renderDot(tab.id as HeaderDotPage, item.icon);
            })
          : dots.map((item) => {
              const target = item.id as HeaderDotPage;
              const Icon = item.icon;
              return renderDot(target, Icon);
            })}
      </div>
      </div>

      <button
        className="island__collapse-target"
        type="button"
        aria-label={t.island.collapseIsland}
        data-tooltip=""
        data-window-drag="false"
        onClick={onCollapse}
      />

      <div className="window-actions">
        <SlotView slot={headerSlot} props={buttons} select={(items) => items.filter((item) => item.enabled?.(buttons) ?? true)} />
      </div>
    </header>
  );
}
