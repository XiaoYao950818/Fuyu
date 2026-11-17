import { useState } from "react";
import { AppWindow, Folder, Globe } from "lucide-react";
import { SettingsInput } from "../../components/settings/SettingsInput";
import { SettingsLinkButton } from "../../components/settings/SettingsLinkButton";
import { SettingsSelect } from "../../components/settings/SettingsSelect";
import { useTranslation } from "../../i18n";
import { pickQuickLaunchFile, pickQuickLaunchFolder } from "./api";
import { baseName, buildLaunchItem } from "./launch";
import type { QuickLaunchItem, QuickLaunchKind, QuickLaunchSettings } from "./types";
import "./QuickLaunchSettings.css";

function kindIcon(kind: QuickLaunchKind) {
  if (kind === "folder") return Folder;
  if (kind === "url") return Globe;
  return AppWindow;
}

export function QuickLaunchSettingsEditor({ settings, onChange }: { settings: QuickLaunchSettings; onChange: (next: QuickLaunchSettings) => void }) {
  const quickLaunch = useTranslation().quickLaunch;
  const t = quickLaunch.settings;
  const kindOptions = (["app", "folder", "url"] as const).map((kind) => ({ value: kind, label: quickLaunch.kind[kind] }));
  const [draft, setDraft] = useState<{ name: string; target: string; kind: QuickLaunchKind }>({ name: "", target: "", kind: "app" });

  const updateItem = (id: string, patch: Partial<QuickLaunchItem>) => {
    onChange({ ...settings, items: settings.items.map((item) => (item.id === id ? { ...item, ...patch } : item)) });
  };

  const removeItem = (id: string) => {
    onChange({ ...settings, items: settings.items.filter((item) => item.id !== id) });
  };

  const browse = (kind: QuickLaunchKind, apply: (target: string) => void) => {
    const pick = kind === "folder" ? pickQuickLaunchFolder(t.browseFolder) : pickQuickLaunchFile(t.browseFile);
    void pick.then((target) => {
      if (target !== null) apply(target);
    });
  };

  const addItem = () => {
    const item = buildLaunchItem(draft.name, draft.target, draft.kind, crypto.randomUUID());
    if (item === null) return;
    onChange({ ...settings, items: [...settings.items, item] });
    setDraft({ name: "", target: "", kind: "app" });
  };

  return (
    <div className="quick-launch-settings">
      {settings.items.length === 0 ? <p className="quick-launch-settings__empty">{t.empty}</p> : null}
      {settings.items.map((item) => {
        const Icon = kindIcon(item.kind);
        return (
          <div className="quick-launch-settings__item" key={item.id}>
            <Icon className="quick-launch-settings__icon" size={16} strokeWidth={2} aria-hidden="true" />
            <SettingsInput aria-label={t.name} value={item.name} placeholder={t.namePlaceholder} onChange={(event) => updateItem(item.id, { name: event.target.value })} />
            <SettingsSelect ariaLabel={t.kind} value={item.kind} options={kindOptions} onChange={(kind) => updateItem(item.id, { kind })} />
            <SettingsInput aria-label={t.target} value={item.target} placeholder={t.targetPlaceholder} onChange={(event) => updateItem(item.id, { target: event.target.value })} />
            {item.kind === "url" ? null : (
              <SettingsLinkButton onClick={() => browse(item.kind, (target) => updateItem(item.id, { target }))}>
                {item.kind === "folder" ? t.browseFolder : t.browseFile}
              </SettingsLinkButton>
            )}
            <SettingsLinkButton tone="danger" onClick={() => removeItem(item.id)}>
              {t.remove}
            </SettingsLinkButton>
          </div>
        );
      })}
      <div className="quick-launch-settings__item quick-launch-settings__item--new">
        <AppWindow className="quick-launch-settings__icon" size={16} strokeWidth={2} aria-hidden="true" />
        <SettingsInput aria-label={t.name} value={draft.name} placeholder={t.namePlaceholder} onChange={(event) => setDraft({ ...draft, name: event.target.value })} />
        <SettingsSelect ariaLabel={t.kind} value={draft.kind} options={kindOptions} onChange={(kind) => setDraft({ ...draft, kind })} />
        <SettingsInput
          aria-label={t.target}
          value={draft.target}
          placeholder={t.targetPlaceholder}
          onChange={(event) => setDraft({ ...draft, target: event.target.value })}
          onKeyDown={(event) => {
            if (event.key === "Enter") addItem();
          }}
        />
        {draft.kind === "url" ? null : (
          <SettingsLinkButton
            onClick={() =>
              browse(draft.kind, (target) => setDraft((current) => ({ ...current, target, name: current.name === "" ? baseName(target) : current.name })))
            }
          >
            {draft.kind === "folder" ? t.browseFolder : t.browseFile}
          </SettingsLinkButton>
        )}
        <SettingsLinkButton onClick={addItem}>{t.add}</SettingsLinkButton>
      </div>
      <p className="quick-launch-settings__hint">{t.targetHint}</p>
    </div>
  );
}
