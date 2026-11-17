import { SettingsGroup } from "../../../components/settings/SettingsGroup";
import { SettingsToggleRow } from "../../../components/settings/SettingsToggleRow";
import { useTranslation } from "../../../i18n";
import { useMusicIslandSettings } from "../useMusicIslandSettings";
import { settingsSections } from "../../plugin-kernel/settingsSlots";
import { OWNER } from "./owner.ts";

const sections = settingsSections<object, "general">();

function MusicIslandSettingsSection() {
  const t = useTranslation().musicIsland.settings;
  const [settings, update] = useMusicIslandSettings();

  return (
    <SettingsGroup title={t.title}>
      <SettingsToggleRow
        title={t.enable}
        description={t.enableHint}
        checked={settings.enabled}
        onChange={(enabled) => update({ ...settings, enabled })}
      />
    </SettingsGroup>
  );
}

sections.add({ id: "general.musicIsland", category: "general", order: 53, component: MusicIslandSettingsSection }, OWNER);
