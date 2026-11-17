import { Volume2, VolumeX } from "lucide-react";
import { useTranslation } from "../../i18n";
import { useVolume } from "./useVolume";
import { volumeToPercent } from "./volume";
import "./VolumeGauge.css";

export type VolumeGaugeProps = {
  paused: boolean;
  openPage: (page: "volume") => void;
};

export function VolumeGauge({ paused, openPage }: VolumeGaugeProps) {
  const t = useTranslation().volume;
  const { state, error } = useVolume(!paused);
  return (
    <button
      className="volume-gauge"
      type="button"
      aria-label={t.openDetails}
      data-tooltip=""
      onClick={(event) => {
        event.stopPropagation();
        openPage("volume");
      }}
    >
      {error !== null ? (
        <span className="volume-gauge__unavailable">{t.failed}</span>
      ) : state === null ? (
        <span className="volume-gauge__loading">{t.loading}</span>
      ) : !state.available ? (
        <span className="volume-gauge__unavailable">{t.unavailable}</span>
      ) : state.muted ? (
        <>
          <VolumeX size={14} strokeWidth={2.2} aria-hidden="true" />
          <span className="volume-gauge__value">{t.muted}</span>
        </>
      ) : (
        <>
          <Volume2 size={14} strokeWidth={2.2} aria-hidden="true" />
          <span className="volume-gauge__value">{volumeToPercent(state.level)}%</span>
        </>
      )}
    </button>
  );
}
