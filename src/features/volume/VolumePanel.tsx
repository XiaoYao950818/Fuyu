import { useState, type CSSProperties } from "react";
import { RefreshCw, Volume1, Volume2, VolumeX } from "lucide-react";
import { useErrorText, useTranslation } from "../../i18n";
import type { AudioSession } from "./types";
import { useVolume } from "./useVolume";
import { sessionDisplayName, sortVolumeSessions, volumeToPercent } from "./volume";
import "../../components/list/IslandList.css";
import "./VolumePanel.css";

export function VolumePanel({ isOpen }: { isOpen: boolean }) {
  const t = useTranslation().volume;
  const errorText = useErrorText();
  const { state, error, enabled, refresh, setMaster, setMuted, setSession, setSessionMute } = useVolume(isOpen);
  const sessions = state === null ? [] : sortVolumeSessions(state.sessions);

  return (
    <section className="island-list-page volume-panel" aria-label={t.title}>
      <div className="volume-panel__header">
        <span className="volume-panel__title">{t.title}</span>
        <button className="volume-panel__button" type="button" aria-label={t.refresh} title={t.refresh} onClick={refresh} disabled={!enabled}>
          <RefreshCw size={14} strokeWidth={2.2} aria-hidden="true" />
        </button>
      </div>
      {!enabled ? (
        <p className="volume-panel__empty">{t.disabled}</p>
      ) : error !== null ? (
        <p className="volume-panel__empty">{errorText(error) || t.failed}</p>
      ) : state === null ? (
        <p className="volume-panel__empty">{t.loading}</p>
      ) : !state.available ? (
        <p className="volume-panel__empty">{t.unavailable}</p>
      ) : (
        <>
          <div className="volume-panel__row volume-panel__row--master">
            <button
              className="volume-panel__mute"
              type="button"
              aria-label={state.muted ? t.unmute : t.mute}
              title={state.muted ? t.unmute : t.mute}
              aria-pressed={state.muted}
              onClick={() => setMuted(!state.muted)}
            >
              {state.muted ? <VolumeX size={16} strokeWidth={2} aria-hidden="true" /> : state.level < 0.5 ? <Volume1 size={16} strokeWidth={2} aria-hidden="true" /> : <Volume2 size={16} strokeWidth={2} aria-hidden="true" />}
            </button>
            <span className="volume-panel__label">{t.master}</span>
            <VolumeSlider value={volumeToPercent(state.level)} disabled={state.muted} label={t.master} onCommit={setMaster} />
            <span className="volume-panel__percent">{state.muted ? t.muted : `${volumeToPercent(state.level)}%`}</span>
          </div>
          <div className="volume-panel__row volume-panel__row--output">
            <span className="volume-panel__label">{t.output}</span>
            <span className="volume-panel__output">{state.outputName ?? t.unknownOutput}</span>
          </div>
          <h2 className="volume-panel__subtitle">{t.sessions}</h2>
          {sessions.length === 0 ? (
            <p className="volume-panel__empty">{t.emptySessions}</p>
          ) : (
            <ul className="volume-panel__list">
              {sessions.map((session) => (
                <SessionRow
                  key={session.id}
                  session={session}
                  onVolume={(percent) => setSession(session.processId, percent)}
                  onMute={(muted) => setSessionMute(session.processId, muted)}
                />
              ))}
            </ul>
          )}
        </>
      )}
    </section>
  );
}

function VolumeSlider({ value, disabled, label, onCommit }: { value: number; disabled: boolean; label: string; onCommit: (percent: number) => void }) {
  const [draft, setDraft] = useState<number | null>(null);
  const shown = draft ?? value;
  const commit = () => {
    if (draft === null) return;
    onCommit(draft);
    setDraft(null);
  };
  return (
    <input
      className="volume-panel__slider"
      type="range"
      min={0}
      max={100}
      step={1}
      value={shown}
      disabled={disabled}
      aria-label={label}
      style={{ "--volume-slider-fill": `${shown}%` } as CSSProperties}
      onChange={(event) => setDraft(Number(event.currentTarget.value))}
      onPointerUp={commit}
      onKeyUp={commit}
      onBlur={commit}
    />
  );
}

function SessionRow({ session, onVolume, onMute }: { session: AudioSession; onVolume: (percent: number) => void; onMute: (muted: boolean) => void }) {
  const t = useTranslation().volume;
  const name = sessionDisplayName(session, t.systemSounds, t.unknownApp);
  const MuteIcon = session.muted ? VolumeX : Volume2;
  return (
    <li className="volume-panel__row">
      {session.icon !== null ? (
        <img className="volume-panel__app-icon" src={session.icon} alt="" aria-hidden="true" />
      ) : (
        <Volume2 className="volume-panel__app-icon volume-panel__app-icon--fallback" size={18} strokeWidth={2} aria-hidden="true" />
      )}
      <span className="volume-panel__label">{name}</span>
      <VolumeSlider value={volumeToPercent(session.volume)} disabled={session.muted} label={name} onCommit={onVolume} />
      <span className="volume-panel__percent">{session.muted ? t.muted : `${volumeToPercent(session.volume)}%`}</span>
      <button
        className="volume-panel__mute volume-panel__mute--small"
        type="button"
        aria-label={session.muted ? t.unmuteApp(name) : t.muteApp(name)}
        title={session.muted ? t.unmuteApp(name) : t.muteApp(name)}
        aria-pressed={session.muted}
        onClick={() => onMute(!session.muted)}
      >
        <MuteIcon size={15} strokeWidth={2} aria-hidden="true" />
      </button>
    </li>
  );
}
