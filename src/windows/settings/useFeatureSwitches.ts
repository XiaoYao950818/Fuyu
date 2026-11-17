import { useMemo } from "react";
import type { IslandSettings } from "../../lib/settings/types";
import { switchBuiltinPlugin } from "../../features/plugin-kernel/builtinSwitches";
import { useBuiltinEnabled } from "../../features/plugin-kernel/useBuiltinPlugins";
import { pagesOfFeaturesOff, type SettingsCategory, type SettingsFeature } from "./categories";

export type FeatureSwitch = { on: boolean; set: (on: boolean) => void };

export type FeatureSwitches = Record<SettingsFeature, FeatureSwitch>;

type FlagKey = "musicEnabled" | "shelfEnabled" | "screenshotEnabled";

const FLAGS: Record<Exclude<SettingsFeature, "clipboard">, FlagKey> = {
  music: "musicEnabled",
  shelf: "shelfEnabled",
  screenshot: "screenshotEnabled",
};

export function useFeatureSwitches(
  settings: IslandSettings,
  onSettingsChange: (update: (current: IslandSettings) => IslandSettings) => void,
): { switches: FeatureSwitches; hiddenPages: ReadonlySet<SettingsCategory> } {
  const clipboard = useBuiltinEnabled("clipboard");
  return useMemo(() => {
    const flag = (key: FlagKey): FeatureSwitch => ({
      on: settings[key],
      set: (on) => onSettingsChange((current) => ({ ...current, [key]: on })),
    });
    const switches: FeatureSwitches = {
      music: flag(FLAGS.music),
      clipboard: { on: clipboard, set: (enabled) => void switchBuiltinPlugin("clipboard", enabled).catch((error: unknown) => console.error("Could not switch the clipboard plugin", error)) },
      shelf: flag(FLAGS.shelf),
      screenshot: flag(FLAGS.screenshot),
    };
    const on = Object.fromEntries(Object.entries(switches).map(([feature, value]) => [feature, value.on])) as Record<SettingsFeature, boolean>;
    return { switches, hiddenPages: pagesOfFeaturesOff(on) };
  }, [settings, clipboard, onSettingsChange]);
}
