import { useTranslation } from "../../i18n";
import { formatRate } from "./speed";
import { useNetSpeed } from "./useNetSpeed";
import "./NetSpeedGauge.css";

export type NetSpeedGaugeProps = {
  paused: boolean;
  openPage: (page: "net-speed") => void;
};

export function NetSpeedGauge({ paused, openPage }: NetSpeedGaugeProps) {
  const t = useTranslation().netSpeed;
  const { speed, error } = useNetSpeed(!paused);
  return (
    <button
      className="net-speed-gauge"
      type="button"
      aria-label={t.openDetails}
      data-tooltip=""
      onClick={(event) => {
        event.stopPropagation();
        openPage("net-speed");
      }}
    >
      {error !== null ? (
        <span className="net-speed-gauge__unavailable">{t.failed}</span>
      ) : speed === null ? (
        <span className="net-speed-gauge__loading">{t.loading}</span>
      ) : !speed.available ? (
        <span className="net-speed-gauge__unavailable">{t.unavailable}</span>
      ) : (
        <>
          <span className="net-speed-gauge__rate">↓{formatRate(speed.downBytesPerSec)}</span>
          <span className="net-speed-gauge__rate">↑{formatRate(speed.upBytesPerSec)}</span>
        </>
      )}
    </button>
  );
}
