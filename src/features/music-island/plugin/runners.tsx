import { useEffect, useRef } from "react";
import { defineSlot } from "../../plugin-kernel/slots";
import { getMusicIslandMedia, requestMusicIslandClose, setMusicIslandVisible } from "../api";
import { MUSIC_ISLAND_POLL_MS, decideMusicIsland, normalizeMusicIslandSnapshot } from "../musicIsland";
import type { MusicIslandWatch } from "../types";
import { useMusicIslandSettings } from "../useMusicIslandSettings";
import { OWNER } from "./owner.ts";

const runnerSlot = defineSlot<object>("island.runner/v1");

function MusicIslandRunner() {
  const [settings] = useMusicIslandSettings();
  const watch = useRef<MusicIslandWatch>({ shown: false, trackKey: null });
  const busy = useRef(false);

  useEffect(() => {
    const poll = async () => {
      if (busy.current) return;
      busy.current = true;
      try {
        const snapshot = normalizeMusicIslandSnapshot(await getMusicIslandMedia());
        const decision = decideMusicIsland(snapshot, settings.enabled, watch.current);
        watch.current = decision.watch;
        if (decision.action === "show") {
          await setMusicIslandVisible(true);
        } else if (decision.action === "hide") {
          await requestMusicIslandClose();
        }
      } catch (error) {
        console.error("Failed to update the music island", error);
        watch.current = { shown: false, trackKey: null };
      } finally {
        busy.current = false;
      }
    };
    void poll();
    const timer = window.setInterval(() => void poll(), MUSIC_ISLAND_POLL_MS);
    return () => window.clearInterval(timer);
  }, [settings.enabled]);

  return null;
}

runnerSlot.add({ id: "music-island.runner", component: MusicIslandRunner }, OWNER);
