import { SettingsGroup } from "../../../components/settings/SettingsGroup";
import { SettingsToggleRow } from "../../../components/settings/SettingsToggleRow";
import { useTranslation } from "../../../i18n";
import { settingsSections } from "../../plugin-kernel/settingsSlots";
import { useDeviceBatterySettings } from "../useDeviceBatterySettings";
import { OWNER } from "./owner.ts";

const sections = settingsSections<object, "general">();

function DeviceBatterySettingsSection() {
  const t = useTranslation().deviceBattery.settings;
  const [settings, update] = useDeviceBatterySettings();
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

sections.add({ id: "general.deviceBattery", category: "general", order: 46, component: DeviceBatterySettingsSection }, OWNER);
