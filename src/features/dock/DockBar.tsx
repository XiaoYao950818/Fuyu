import { AppWindow, Settings } from "lucide-react";
import { useTranslation } from "../../i18n";
import type { DockEntry } from "./types";
import "./DockBar.css";

export type DockBarProps = {
  entries: DockEntry[];
  clock: { time: string; date: string };
  empty: boolean;
  onActivate: (entry: DockEntry) => void;
  onOpenSettings: () => void;
};

export function DockBar({ entries, clock, empty, onActivate, onOpenSettings }: DockBarProps) {
  const t = useTranslation().dock;
  return (
    <div className="dock-bar" role="toolbar" aria-label={t.title}>
      <div className="dock-bar__glass" aria-hidden="true" />
      <div className="dock-bar__items">
        {empty ? (
          <span className="dock-bar__empty">{t.emptyApps}</span>
        ) : (
          entries.map((entry) => (
            <button
              key={entry.id}
              className={`dock-bar__item${entry.active ? " dock-bar__item--active" : ""}${entry.minimized ? " dock-bar__item--minimized" : ""}`}
              type="button"
              aria-label={entry.windowHandle !== null ? t.switchTo(entry.name) : t.openApp(entry.name)}
              title={entry.name}
              onClick={() => onActivate(entry)}
            >
              {entry.icon !== null ? (
                <img className="dock-bar__icon" src={entry.icon} alt="" aria-hidden="true" />
              ) : (
                <span className="dock-bar__fallback" aria-hidden="true">
                  {entry.name.trim() === "" ? <AppWindow size={20} strokeWidth={2} /> : entry.name.trim()[0]?.toUpperCase()}
                </span>
              )}
              <span className="dock-bar__dot" aria-hidden="true" />
            </button>
          ))
        )}
      </div>
      <div className="dock-bar__clock" aria-label={clock.date}>
        <span className="dock-bar__time">{clock.time}</span>
        <span className="dock-bar__date">{clock.date}</span>
      </div>
      <button className="dock-bar__settings" type="button" aria-label={t.openSettings} title={t.openSettings} onClick={onOpenSettings}>
        <Settings size={16} strokeWidth={2} aria-hidden="true" />
      </button>
    </div>
  );
}
