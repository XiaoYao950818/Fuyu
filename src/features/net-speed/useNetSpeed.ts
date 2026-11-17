import { useCallback, useEffect, useState } from "react";
import { getNetSpeed } from "./api";
import type { NetSpeed } from "./types";
import { useNetSpeedSettings } from "./useNetSpeedSettings";

const POLL_MS = 1000;

export function useNetSpeed(active: boolean) {
  const [settings] = useNetSpeedSettings();
  const [speed, setSpeed] = useState<NetSpeed | null>(null);
  const [error, setError] = useState<unknown>(null);

  const refresh = useCallback(() => {
    getNetSpeed()
      .then((next) => {
        setSpeed(next);
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

  return { speed, error, enabled: settings.enabled, refresh };
}
