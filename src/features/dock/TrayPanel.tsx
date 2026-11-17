import { useErrorText, useTranslation } from "../../i18n";
import { trayDisplayName, trayFallbackLetter } from "./dock";
import type { TrayIcon } from "./types";
import { useDock } from "./useDock";
import "../../components/list/IslandList.css";
import "./TrayPanel.css";

export function TrayPanel({ isOpen }: { isOpen: boolean }) {
  const t = useTranslation().dock;
  const errorText = useErrorText();
  const { tray, error, enabled, clickTray } = useDock(isOpen);

  return (
    <section className="island-list-page tray-panel" aria-label={t.trayTitle}>
      <div className="tray-panel__header">
        <span className="tray-panel__title">{t.trayTitle}</span>
      </div>
      {!enabled ? (
        <p className="tray-panel__empty">{t.disabled}</p>
      ) : error !== null ? (
        <p className="tray-panel__empty">{errorText(error) || t.trayFailed}</p>
      ) : tray === null ? (
        <p className="tray-panel__empty">{t.loading}</p>
      ) : !tray.available ? (
        <p className="tray-panel__empty">{t.unavailable}</p>
      ) : tray.icons.length === 0 ? (
        <p className="tray-panel__empty">{t.emptyTray}</p>
      ) : (
        <>
          {!tray.overflowAvailable && <p className="tray-panel__note">{t.trayOverflowUnavailable}</p>}
          <ul className="tray-panel__list">
            {tray.icons.map((icon) => (
              <li key={icon.id} className="tray-panel__item">
                <TrayIconButton icon={icon} onClick={(button) => clickTray(icon.id, button)} />
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}

function TrayIconButton({ icon, onClick }: { icon: TrayIcon; onClick: (button: "left" | "right") => void }) {
  const t = useTranslation().dock;
  const name = trayDisplayName(icon, t.unknownApp);
  return (
    <button
      className="tray-panel__row"
      type="button"
      aria-label={name}
      title={name}
      onClick={() => onClick("left")}
      onContextMenu={(event) => {
        event.preventDefault();
        onClick("right");
      }}
    >
      {icon.icon !== null ? (
        <img className="tray-panel__icon" src={icon.icon} alt="" aria-hidden="true" />
      ) : (
        <span className="tray-panel__fallback" aria-hidden="true">
          {trayFallbackLetter(name)}
        </span>
      )}
      <span className="tray-panel__label">{name}</span>
      <span className="tray-panel__hint" aria-hidden="true">
        {"›"}
      </span>
    </button>
  );
}
