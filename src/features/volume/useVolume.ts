import { useCallback, useEffect, useState } from "react";
import { getVolumeState, setMasterMuted, setMasterVolumeLevel, setSessionMuted, setSessionVolume } from "./api";
import type { VolumeState } from "./types";
import { useVolumeSettings } from "./useVolumeSettings";
import { normalizeVolumeState, percentToVolume } from "./volume";

const POLL_MS = 2000;

export function useVolume(active: boolean) {
  const [settings] = useVolumeSettings();
  const [state, setState] = useState<VolumeState | null>(null);
  const [error, setError] = useState<unknown>(null);

  const refresh = useCallback(() => {
    getVolumeState()
      .then((value) => {
        setState(normalizeVolumeState(value));
        setError(null);
      })
      .catch((caught: unknown) => setError(caught));
  }, []);

  useEffect(() => {
    if (!active || !settings.enabled) return;
    refresh();
    const id = window.setInterval(refresh, POLL_MS);
    return () => window.clearInterval(id);
  }, [active, settings.enabled, refresh]);

  const setMaster = useCallback((percent: number) => {
    const level = percentToVolume(percent);
    setState((current) => (current === null ? null : { ...current, level }));
    setMasterVolumeLevel(level)
      .then((value) => {
        setState(normalizeVolumeState(value));
        setError(null);
      })
      .catch((caught: unknown) => {
        setError(caught);
        refresh();
      });
  }, [refresh]);

  const setMuted = useCallback((muted: boolean) => {
    setState((current) => (current === null ? null : { ...current, muted }));
    setMasterMuted(muted)
      .then((value) => {
        setState(normalizeVolumeState(value));
        setError(null);
      })
      .catch((caught: unknown) => {
        setError(caught);
        refresh();
      });
  }, [refresh]);

  const setSession = useCallback((processId: number, percent: number) => {
    const level = percentToVolume(percent);
    setState((current) => (current === null ? null : {
      ...current,
      sessions: current.sessions.map((session) => (session.processId === processId ? { ...session, volume: level } : session)),
    }));
    setSessionVolume(processId, level).then(refresh).catch((caught: unknown) => {
      setError(caught);
      refresh();
    });
  }, [refresh]);

  const setSessionMute = useCallback((processId: number, muted: boolean) => {
    setState((current) => (current === null ? null : {
      ...current,
      sessions: current.sessions.map((session) => (session.processId === processId ? { ...session, muted } : session)),
    }));
    setSessionMuted(processId, muted).then(refresh).catch((caught: unknown) => {
      setError(caught);
      refresh();
    });
  }, [refresh]);

  return { state, error, enabled: settings.enabled, refresh, setMaster, setMuted, setSession, setSessionMute };
}
