import { useEffect, useState } from "react";
import { SettingsGroup } from "../../../components/settings/SettingsGroup";
import { SettingsToggleRow } from "../../../components/settings/SettingsToggleRow";
import { useTranslation } from "../../../i18n";
import { settingsSections } from "../../plugin-kernel/settingsSlots";
import { getFileSearchStatus } from "../api";
import type { FileSearchStatus } from "../types";
import { useFileSearchSettings } from "../useFileSearchSettings";
import "../FileSearch.css";
import { OWNER } from "./owner.ts";

const sections = settingsSections<object, "general">();

function FileSearchSettingsSection() {
  const t = useTranslation().fileSearch.settings;
  const panel = useTranslation().fileSearch;
  const [settings, update] = useFileSearchSettings();
  const [status, setStatus] = useState<FileSearchStatus | null>(null);

  useEffect(() => {
    if (!settings.enabled) return;
    getFileSearchStatus().then(setStatus).catch(() => setStatus(null));
    const id = window.setInterval(() => {
      getFileSearchStatus().then(setStatus).catch(() => setStatus(null));
    }, 5000);
    return () => window.clearInterval(id);
  }, [settings.enabled]);

  const statusText =
    status === null
      ? panel.loading
      : status.adminRequired
        ? panel.adminRequired
        : status.state === "building"
          ? panel.indexing(status.indexedCount)
          : status.state === "ready"
            ? t.ready(status.indexedCount, status.drives.join(", "))
            : status.error ?? panel.failed;

  return (
    <SettingsGroup title={t.title}>
      <SettingsToggleRow title={t.enable} description={t.enableHint} checked={settings.enabled} onChange={(enabled) => update({ ...settings, enabled })} />
      <p className="file-search-settings__status">{statusText}</p>
    </SettingsGroup>
  );
}

sections.add({ id: "general.fileSearch", category: "general", order: 49, component: FileSearchSettingsSection }, OWNER);
