import { useState } from "react";
import { AppWindow, Folder, Globe } from "lucide-react";
import { useTranslation } from "../../i18n";
import { openQuickLaunchItem } from "./api";
import { useQuickLaunchSettings } from "./useQuickLaunchSettings";
import type { QuickLaunchItem, QuickLaunchKind } from "./types";
import "../../components/list/IslandList.css";
import "./QuickLaunch.css";

function kindIcon(kind: QuickLaunchKind) {
  if (kind === "folder") return Folder;
  if (kind === "url") return Globe;
  return AppWindow;
}

export function QuickLaunchPanel() {
  const t = useTranslation().quickLaunch;
  const [settings] = useQuickLaunchSettings();
  const [failedId, setFailedId] = useState<string | null>(null);

  return (
    <section className="island-list-page quick-launch-panel" aria-label={t.title}>
      <div className="quick-launch-panel__header">
        <span className="quick-launch-panel__title">{t.title}</span>
      </div>
      {!settings.enabled ? (
        <p className="quick-launch-panel__empty">{t.disabled}</p>
      ) : settings.items.length === 0 ? (
        <p className="quick-launch-panel__empty">{t.empty}</p>
      ) : (
        <ul className="quick-launch-panel__list">
          {settings.items.map((item) => (
            <LaunchRow
              key={item.id}
              item={item}
              failed={failedId === item.id}
              onOpen={() =>
                void openQuickLaunchItem(item).then(
                  () => setFailedId((current) => (current === item.id ? null : current)),
                  () => setFailedId(item.id),
                )
              }
            />
          ))}
        </ul>
      )}
    </section>
  );
}

function LaunchRow({ item, failed, onOpen }: { item: QuickLaunchItem; failed: boolean; onOpen: () => void }) {
  const t = useTranslation().quickLaunch;
  const Icon = kindIcon(item.kind);
  return (
    <li className="quick-launch-panel__row">
      <button className="quick-launch-panel__open" type="button" onClick={onOpen} aria-label={`${item.name} · ${item.target}`}>
        <Icon className="quick-launch-panel__icon" size={16} strokeWidth={2} aria-hidden="true" />
        <span className="quick-launch-panel__label">{item.name}</span>
        <span className="quick-launch-panel__target">{item.target}</span>
      </button>
      {failed ? <span className="quick-launch-panel__failed">{t.openFailed}</span> : null}
    </li>
  );
}
