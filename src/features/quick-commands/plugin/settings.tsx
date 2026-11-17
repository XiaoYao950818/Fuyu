import { useState } from "react";
import { Terminal } from "lucide-react";
import { SettingsGroup } from "../../../components/settings/SettingsGroup";
import { SettingsInput } from "../../../components/settings/SettingsInput";
import { SettingsLinkButton } from "../../../components/settings/SettingsLinkButton";
import { SettingsToggleRow } from "../../../components/settings/SettingsToggleRow";
import { useTranslation } from "../../../i18n";
import { settingsSections } from "../../plugin-kernel/settingsSlots";
import type { QuickCommandItem, QuickCommandSettings } from "../types";
import { buildCommandItem } from "../commands";
import { useQuickCommandsSettings } from "../useQuickCommandsSettings";
import "../QuickCommands.css";
import { OWNER } from "./owner.ts";

const sections = settingsSections<object, "general">();

function QuickCommandsSettingsSection() {
  const t = useTranslation().quickCommands.settings;
  const [settings, update] = useQuickCommandsSettings();
  return (
    <SettingsGroup title={t.title}>
      <SettingsToggleRow
        title={t.enable}
        description={t.enableHint}
        checked={settings.enabled}
        onChange={(enabled) => update({ ...settings, enabled })}
      />
      <QuickCommandsSettingsEditor settings={settings} onChange={update} />
    </SettingsGroup>
  );
}

function QuickCommandsSettingsEditor({ settings, onChange }: { settings: QuickCommandSettings; onChange: (next: QuickCommandSettings) => void }) {
  const t = useTranslation().quickCommands.settings;
  const [draft, setDraft] = useState({ name: "", command: "" });

  const updateItem = (id: string, patch: Partial<QuickCommandItem>) => {
    onChange({ ...settings, items: settings.items.map((item) => (item.id === id ? { ...item, ...patch } : item)) });
  };

  const removeItem = (id: string) => {
    onChange({ ...settings, items: settings.items.filter((item) => item.id !== id) });
  };

  const addItem = () => {
    const item = buildCommandItem(draft.name, draft.command, crypto.randomUUID());
    if (item === null) return;
    onChange({ ...settings, items: [...settings.items, item] });
    setDraft({ name: "", command: "" });
  };

  return (
    <div className="quick-commands-settings">
      {settings.items.length === 0 ? <p className="quick-commands-settings__empty">{t.empty}</p> : null}
      {settings.items.map((item) => (
        <div className="quick-commands-settings__item" key={item.id}>
          <Terminal className="quick-commands-settings__icon" size={16} strokeWidth={2} aria-hidden="true" />
          <SettingsInput aria-label={t.name} value={item.name} placeholder={t.namePlaceholder} onChange={(event) => updateItem(item.id, { name: event.target.value })} />
          <SettingsInput
            aria-label={t.command}
            value={item.command}
            placeholder={t.commandPlaceholder}
            monospace
            onChange={(event) => updateItem(item.id, { command: event.target.value })}
          />
          <SettingsLinkButton tone="danger" onClick={() => removeItem(item.id)}>
            {t.remove}
          </SettingsLinkButton>
        </div>
      ))}
      <div className="quick-commands-settings__item quick-commands-settings__item--new">
        <Terminal className="quick-commands-settings__icon" size={16} strokeWidth={2} aria-hidden="true" />
        <SettingsInput aria-label={t.name} value={draft.name} placeholder={t.namePlaceholder} onChange={(event) => setDraft({ ...draft, name: event.target.value })} />
        <SettingsInput
          aria-label={t.command}
          value={draft.command}
          placeholder={t.commandPlaceholder}
          monospace
          onChange={(event) => setDraft({ ...draft, command: event.target.value })}
          onKeyDown={(event) => {
            if (event.key === "Enter") addItem();
          }}
        />
        <SettingsLinkButton onClick={addItem}>{t.add}</SettingsLinkButton>
      </div>
      <p className="quick-commands-settings__hint">{t.commandHint}</p>
    </div>
  );
}

sections.add({ id: "general.quickCommands", category: "general", order: 48, component: QuickCommandsSettingsSection }, OWNER);
