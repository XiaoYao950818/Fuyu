import { SettingsGroup } from "../../../components/settings/SettingsGroup";
import { SettingsToggleRow } from "../../../components/settings/SettingsToggleRow";
import { useTranslation } from "../../../i18n";
import { settingsSections } from "../../plugin-kernel/settingsSlots";
import { useVolumeSettings } from "../useVolumeSettings";
import { OWNER } from "./owner.ts";

const sections = settingsSections<object, "general">();

function VolumeSettingsSection() {
  const t = useTranslation().volume.settings;
  const [settings, update] = useVolumeSettings();
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

sections.add({ id: "general.volume", category: "general", order: 51, component: VolumeSettingsSection }, OWNER);
