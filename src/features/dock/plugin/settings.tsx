import { AppWindow, X } from "lucide-react";
import { SettingsGroup } from "../../../components/settings/SettingsGroup";
import { SettingsLinkButton } from "../../../components/settings/SettingsLinkButton";
import { SettingsRow } from "../../../components/settings/SettingsRow";
import { SettingsSelect } from "../../../components/settings/SettingsSelect";
import { SettingsToggleRow } from "../../../components/settings/SettingsToggleRow";
import { useTranslation } from "../../../i18n";
import { pickDockFile } from "../api";
import { baseName, buildDockPinnedItem } from "../dock";
import { MAX_PINNED_APPS } from "../storage";
import type { DockScreen } from "../types";
import { useDockSettings } from "../useDockSettings";
import { settingsSections } from "../../plugin-kernel/settingsSlots";
import { OWNER } from "./owner.ts";
import "./DockSettings.css";

const sections = settingsSections<object, "general">();

function DockSettingsSection() {
  const t = useTranslation().dock.settings;
  const [settings, update] = useDockSettings();
  const full = settings.pinned.length >= MAX_PINNED_APPS;
  const screenOptions = (["primary", "cursor"] as const).map((value) => ({ value, label: t.screenOptions[value] }));

  const addApp = () => {
    if (full) return;
    void pickDockFile(t.addApp).then((target) => {
      if (target === null) return;
      const item = buildDockPinnedItem(baseName(target), target, crypto.randomUUID());
      if (item === null) return;
      update({ ...settings, pinned: [...settings.pinned, item] });
    });
  };

  return (
    <SettingsGroup title={t.title}>
      <SettingsToggleRow
        title={t.enable}
        description={t.enableHint}
        checked={settings.enabled}
        onChange={(enabled) => update({ ...settings, enabled })}
      />
      <SettingsRow
        title={t.screen}
        description={t.screenHint}
        control={
          <SettingsSelect<DockScreen>
            value={settings.screen}
            options={screenOptions}
            ariaLabel={t.screen}
            onChange={(screen) => update({ ...settings, screen })}
          />
        }
      />
      <h3 className="dock-settings__subtitle">{t.pinnedTitle}</h3>
      <p className="dock-settings__hint">{t.pinnedHint}</p>
      {settings.pinned.length === 0 ? (
        <p className="dock-settings__empty">{t.pinnedEmpty}</p>
      ) : (
        <ul className="dock-settings__list">
          {settings.pinned.map((item) => (
            <li key={item.id} className="dock-settings__item">
              <AppWindow className="dock-settings__icon" size={16} strokeWidth={2} aria-hidden="true" />
              <span className="dock-settings__name">{item.name}</span>
              <span className="dock-settings__target">{item.target}</span>
              <button
                className="dock-settings__remove"
                type="button"
                aria-label={t.removeApp(item.name)}
                title={t.removeApp(item.name)}
                onClick={() => update({ ...settings, pinned: settings.pinned.filter((pinned) => pinned.id !== item.id) })}
              >
                <X size={14} strokeWidth={2.2} aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      )}
      {full ? (
        <p className="dock-settings__empty">{t.pinnedFull}</p>
      ) : (
        <SettingsLinkButton onClick={addApp}>{t.addApp}</SettingsLinkButton>
      )}
    </SettingsGroup>
  );
}

sections.add({ id: "general.dock", category: "general", order: 52, component: DockSettingsSection }, OWNER);
