import { useCallback, useEffect, useState } from "react";
import { ArrowDown, ArrowUp, type LucideIcon } from "lucide-react";
import { ToggleControl } from "../../components/controls/ToggleControl";
import { useLocale, useTranslation } from "../../i18n";
import type { IslandSettings } from "../../lib/settings/types";
import { useBuiltinPlugins } from "../plugin-kernel/useBuiltinPlugins";
import { listPluginViews, type PluginViewEntry } from "./api";
import { BUILTIN_TAB_PAGES, BUILTIN_TAB_PAGE_IDS, builtinTabPageLabel } from "./builtinTabPages";
import { viewIcon } from "./icons";
import { pluginPageId } from "./model";
import { applySubsetOrder, movePageInList, normalizePageOrder, setPluginPageHidden } from "./pagePrefs";
import { usePluginPagePrefs } from "./usePluginPagePrefs";
import "./PluginIslandPagesSection.css";

type TabRow = { id: string; title: string; subtitle: string | null; icon: LucideIcon; hidden: boolean; builtin: boolean };

export function PluginIslandPagesSection({ settings }: { settings: IslandSettings }) {
  const t = useTranslation();
  const { locale } = useLocale();
  const labels = t.pluginViews.pagesSettings;
  const [views, setViews] = useState<PluginViewEntry[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [prefs, setPrefs] = usePluginPagePrefs();
  const builtinPlugins = useBuiltinPlugins();

  const refresh = useCallback(() => {
    listPluginViews()
      .then((snapshot) => {
        setViews(snapshot.views);
        setLoaded(true);
      })
      .catch((error: unknown) => console.error("Failed to list plugin pages", error));
  }, []);
  useEffect(() => {
    refresh();
    window.addEventListener("focus", refresh);
    return () => window.removeEventListener("focus", refresh);
  }, [refresh]);

  const builtinEnabled = (id: string): boolean => {
    switch (id) {
      case "music":
        return settings.musicEnabled;
      case "shelf":
        return settings.shelfEnabled;
      case "screenshots":
        return settings.screenshotEnabled;
      case "dock-tray":
        return builtinPlugins?.find((plugin) => plugin.id === "dock")?.enabled ?? true;
      default:
        return builtinPlugins?.find((plugin) => plugin.id === id)?.enabled ?? true;
    }
  };

  const availableIds = [...BUILTIN_TAB_PAGE_IDS, ...views.map((view) => pluginPageId(view.pluginId, view.viewId))];
  const fullOrder = normalizePageOrder(prefs.order, availableIds);
  const rows: TabRow[] = [];
  for (const id of fullOrder) {
    const builtin = BUILTIN_TAB_PAGES.find((page) => page.id === id);
    if (builtin) {
      if (!builtinEnabled(builtin.id)) continue;
      const title = builtinTabPageLabel(builtin.id, t);
      if (!title) continue;
      rows.push({ id, title, subtitle: labels.builtin, icon: builtin.icon, hidden: false, builtin: true });
      continue;
    }
    const view = views.find((entry) => pluginPageId(entry.pluginId, entry.viewId) === id);
    if (!view) continue;
    rows.push({ id, title: view.title[locale], subtitle: view.pluginName[locale], icon: viewIcon(view.icon), hidden: prefs.hidden.includes(id), builtin: false });
  }

  useEffect(() => {
    if (!loaded) return;
    if (fullOrder.join("\n") !== prefs.order.join("\n")) setPrefs({ ...prefs, order: fullOrder });
  }, [loaded, fullOrder, prefs, setPrefs]);

  const moveRow = (id: string, step: -1 | 1) => {
    const ids = rows.map((row) => row.id);
    const nextRows = movePageInList(ids, id, step);
    if (nextRows === ids) return;
    const nextOrder = applySubsetOrder(fullOrder, ids, nextRows);
    if (nextOrder === fullOrder) return;
    setPrefs({ ...prefs, order: [...nextOrder] });
  };

  const resetOrder = () => {
    if (!window.confirm(labels.resetConfirm)) return;
    setPrefs({ ...prefs, order: [...availableIds] });
  };

  return (
    <section className="settings-section plugins-panel">
      <div className="settings-section__header">
        <span>{labels.title}</span>
      </div>
      <p className="settings-section__hint">{labels.hint}</p>
      {rows.length === 0 ? <p className="settings-section__hint">{labels.empty}</p> : null}
      <ul className="plugin-pages">
        {rows.map((row, index) => {
          const Icon = row.icon;
          return (
            <li className="plugin-pages__row" key={row.id}>
              <Icon size={14} strokeWidth={2.3} aria-hidden="true" />
              <span className="plugin-pages__name">
                <strong>
                  {row.title}
                  {index === 0 ? <em className="plugin-pages__default">{labels.defaultPage}</em> : null}
                </strong>
                {row.subtitle ? <small>{row.subtitle}</small> : null}
              </span>
              <button className="plugin-card__button" type="button" disabled={index === 0} aria-label={`${labels.moveUp}: ${row.title}`} onClick={() => moveRow(row.id, -1)}>
                <ArrowUp size={12} strokeWidth={2.4} />
              </button>
              <button className="plugin-card__button" type="button" disabled={index === rows.length - 1} aria-label={`${labels.moveDown}: ${row.title}`} onClick={() => moveRow(row.id, 1)}>
                <ArrowDown size={12} strokeWidth={2.4} />
              </button>
              {row.builtin ? null : <ToggleControl label={labels.show} checked={!row.hidden} onChange={(show) => setPrefs(setPluginPageHidden(prefs, row.id, !show))} />}
            </li>
          );
        })}
      </ul>
      <div className="plugin-pages__actions">
        <button className="plugin-card__button" type="button" disabled={rows.length < 2} onClick={resetOrder}>
          {labels.reset}
        </button>
      </div>
    </section>
  );
}
