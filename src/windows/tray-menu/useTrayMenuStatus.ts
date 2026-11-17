import { useCallback, useState } from "react";
import { getMediaState, sendMediaCommand, type MediaCommand } from "../../features/media/api";
import { trayMedia, type TrayMedia } from "./trayCard";

type StatusData = { media: TrayMedia | null; now: number };

const EMPTY: StatusData = { media: null, now: 0 };

function settle<T>(promise: Promise<T>, label: string): Promise<T | null> {
  return promise.catch((error: unknown) => {
    console.error(`Failed to read ${label} for the tray card`, error);
    return null;
  });
}

export function useTrayMenuStatus() {
  const [status, setStatus] = useState<StatusData>(EMPTY);

  const refresh = useCallback(async () => {
    const now = Date.now();
    const media = await settle(getMediaState(undefined), "media");
    setStatus({
      media: media ? trayMedia(media) : null,
      now,
    });
  }, []);

  const media = useCallback(async (command: MediaCommand) => {
    const next = await settle(sendMediaCommand(command, undefined), "media");
    if (next) setStatus((current) => ({ ...current, media: trayMedia(next) }));
  }, []);

  return { status, refresh, media };
}
