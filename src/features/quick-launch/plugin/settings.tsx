import { SettingsGroup } from "../../../components/settings/SettingsGroup";
import { SettingsToggleRow } from "../../../components/settings/SettingsToggleRow";
import { useTranslation } from "../../../i18n";
import { settingsSections } from "../../plugin-kernel/settingsSlots";
import { QuickLaunchSettingsEditor } from "../QuickLaunchSettingsEditor";
import { useQuickLaunchSettings } from "../useQuickLaunchSettings";
import { OWNER } from "./owner.ts";

const sections = settingsSections<object, "general">();

function QuickLaunchSettingsSection() {
  const t = useTranslation().quickLaunch.settings;
  const [settings, update] = useQuickLaunchSettings();
  return (
    <SettingsGroup title={t.title}>
      <SettingsToggleRow
        title={t.enable}
        description={t.enableHint}
        checked={settings.enabled}
        onChange={(enabled) => update({ ...settings, enabled })}
      />
      <QuickLaunchSettingsEditor settings={settings} onChange={update} />
    </SettingsGroup>
  );
}

sections.add({ id: "general.quickLaunch", category: "general", order: 47, component: QuickLaunchSettingsSection }, OWNER);
