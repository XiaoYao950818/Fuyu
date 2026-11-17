import type { DeviceAlert } from "../../src/features/device-events/api";
import { useMemo } from "react";
import type { MediaState } from "../../src/features/media/api";
import type { CurrentLyric } from "../../src/features/media/lyrics/useCurrentLyric";
import { DEFAULT_MEDIA_STATE } from "../../src/features/media/mediaState";
import { mediaIsland, type MediaController } from "../../src/features/media/plugin/islandState";
import { lyricLineContribution } from "../../src/features/media/plugin/lyricLine";
import type { LevelChange } from "../../src/features/system-levels/api";
import { deviceAlertState } from "../../src/features/device-events/plugin/islandState";
import type { DeviceUse } from "../../src/features/device-use/api";
import { devicesInUse } from "../../src/features/device-use/deviceUse";
import { deviceUseState } from "../../src/features/device-use/plugin/islandState";
import type { IslandContribution } from "../../src/features/plugin-kernel/islandContributions";
import { LINE_PRIORITY } from "../../src/features/plugin-kernel/islandContributions";
import { useIslandContributions } from "../../src/features/plugin-kernel/useIslandContributions";
import { useTranslation } from "../../src/i18n";
import { levelState } from "../../src/features/system-levels/plugin/islandState";
import { shelfContributions, shelfIsland } from "../../src/features/file-shelf/plugin/islandState";
import { useFixtureMessages, type FixtureMessages } from "./islandMessages";

type FixtureLines = {
  lyricLine?: CurrentLyric | null;
  screenshotPeek?: string | null;
  deviceAlert?: DeviceAlert | null;
  levelPopup?: LevelChange | null;
  deviceUse?: DeviceUse;
  media?: MediaState | null;
  sideCover?: boolean;
  messages?: FixtureMessages | null;
  shelfCount?: number | null;
};

const NO_DEVICES: DeviceUse = { camera: [], microphone: [] };

export function useFixtureLines({ lyricLine = null, screenshotPeek = null, deviceAlert = null, levelPopup = null, deviceUse = NO_DEVICES, media = null, sideCover = false, messages = null, shelfCount = null }: FixtureLines) {
  const t = useTranslation();
  useFixtureMessages(messages);
  deviceAlertState.useProvide(deviceAlert);
  levelState.useProvide(levelPopup);
  const alerts: IslandContribution[] = [];
  if (deviceAlert) alerts.push({ kind: "alert", item: "device" });
  if (levelPopup) alerts.push({ kind: "alert", item: "level" });
  for (const device of devicesInUse(deviceUse)) alerts.push({ kind: "side", item: `device-${device}`, height: 28 });
  useIslandContributions("builtin", "fixture.features", alerts);
  deviceUseState.useProvide(deviceUse);
  useIslandContributions("screenshot", "fixture.peek", screenshotPeek === null ? [] : [{ kind: "line", item: "screenshot.text", priority: LINE_PRIORITY.screenshotPeek, always: true, bare: true, drop: true, label: screenshotPeek }]);
  mediaIsland.useProvide(useMemo(() => ({ media: { mediaState: media ?? DEFAULT_MEDIA_STATE } as MediaController, lyricLine, sideCover }), [media, lyricLine, sideCover]));
  const mediaList: IslandContribution[] = [];
  const line = lyricLineContribution(lyricLine, t);
  if (line) mediaList.push(line);
  if (media && (media.available || media.audioActive)) mediaList.push({ kind: "side", item: "music", height: sideCover && media.thumbnail ? 40 : 28 });
  if (media?.audioActive) mediaList.push({ kind: "hint", key: "media.audible" });
  if (media?.playbackStatus === "playing") mediaList.push({ kind: "hint", key: "media.playing" });
  useIslandContributions("builtin", "fixture.media", mediaList);
  shelfIsland.useProvide(useMemo(() => ({ shelf: null, dropping: false, count: shelfCount }), [shelfCount]));
  useIslandContributions("file-shelf", "fixture.shelf", shelfContributions(shelfCount));
}
