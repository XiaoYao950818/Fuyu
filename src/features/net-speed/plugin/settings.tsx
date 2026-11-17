import { SettingsGroup } from "../../../components/settings/SettingsGroup";
import { SettingsToggleRow } from "../../../components/settings/SettingsToggleRow";
import { useTranslation } from "../../../i18n";
import { settingsSections } from "../../plugin-kernel/settingsSlots";
import { useNetSpeedSettings } from "../useNetSpeedSettings";
import { OWNER } from "./owner.ts";

const sections = settingsSections<object, "general">();

function NetSpeedSettingsSection() {
  const t = useTranslation().netSpeed.settings;
  const [settings, update] = useNetSpeedSettings();
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

sections.add({ id: "general.netSpeed", category: "general", order: 50, component: NetSpeedSettingsSection }, OWNER);
