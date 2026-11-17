import { RefreshCw } from "lucide-react";
import { useErrorText, useTranslation } from "../../i18n";
import { formatBytes } from "../../utils/bytes";
import { formatRate } from "./speed";
import { useNetSpeed } from "./useNetSpeed";
import "../../components/list/IslandList.css";
import "./NetSpeedPanel.css";

export function NetSpeedPanel({ isOpen }: { isOpen: boolean }) {
  const t = useTranslation().netSpeed;
  const errorText = useErrorText();
  const { speed, error, enabled, refresh } = useNetSpeed(isOpen);

  return (
    <section className="island-list-page net-speed-panel" aria-label={t.title}>
      <div className="net-speed-panel__header">
        <span className="net-speed-panel__title">{t.title}</span>
        <button className="net-speed-panel__button" type="button" aria-label={t.refresh} title={t.refresh} onClick={refresh} disabled={!enabled}>
          <RefreshCw size={14} strokeWidth={2.2} aria-hidden="true" />
        </button>
      </div>
      {!enabled ? (
        <p className="net-speed-panel__empty">{t.disabled}</p>
      ) : error !== null ? (
        <p className="net-speed-panel__empty">{errorText(error) || t.failed}</p>
      ) : speed === null ? (
        <p className="net-speed-panel__empty">{t.loading}</p>
      ) : !speed.available ? (
        <p className="net-speed-panel__empty">{t.unavailable}</p>
      ) : (
        <dl className="net-speed-panel__list">
          <div className="net-speed-panel__row net-speed-panel__row--rate">
            <dt>{t.down}</dt>
            <dd>↓{formatRate(speed.downBytesPerSec)}</dd>
          </div>
          <div className="net-speed-panel__row net-speed-panel__row--rate">
            <dt>{t.up}</dt>
            <dd>↑{formatRate(speed.upBytesPerSec)}</dd>
          </div>
          <div className="net-speed-panel__row">
            <dt>{t.totalReceived}</dt>
            <dd>{formatBytes(speed.totalReceivedBytes)}</dd>
          </div>
          <div className="net-speed-panel__row">
            <dt>{t.totalSent}</dt>
            <dd>{formatBytes(speed.totalSentBytes)}</dd>
          </div>
          <div className="net-speed-panel__row">
            <dt>{t.adapter}</dt>
            <dd className="net-speed-panel__adapter">{speed.name ?? t.unknownAdapter}</dd>
          </div>
        </dl>
      )}
    </section>
  );
}
