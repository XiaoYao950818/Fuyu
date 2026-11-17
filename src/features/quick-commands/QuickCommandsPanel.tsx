import { useState } from "react";
import { Play, Terminal } from "lucide-react";
import { useErrorText, useTranslation } from "../../i18n";
import { runQuickCommand } from "./api";
import { combineCommandOutput, commandResultKind } from "./commands";
import { useQuickCommandsSettings } from "./useQuickCommandsSettings";
import type { QuickCommandItem, QuickCommandResult } from "./types";
import "../../components/list/IslandList.css";
import "./QuickCommands.css";

type LastRun = QuickCommandResult & { error: string | null };

export function QuickCommandsPanel() {
  const t = useTranslation().quickCommands;
  const errorText = useErrorText();
  const [settings] = useQuickCommandsSettings();
  const [runningId, setRunningId] = useState<string | null>(null);
  const [lastRuns, setLastRuns] = useState<Readonly<Record<string, LastRun>>>({});

  const run = (item: QuickCommandItem) => {
    if (runningId !== null) return;
    setRunningId(item.id);
    void runQuickCommand(item.command).then(
      (result) => {
        setLastRuns((current) => ({ ...current, [item.id]: { ...result, error: null } }));
        setRunningId(null);
      },
      (error: unknown) => {
        setLastRuns((current) => ({
          ...current,
          [item.id]: { stdout: "", stderr: "", exitCode: null, timedOut: false, error: errorText(error) },
        }));
        setRunningId(null);
      },
    );
  };

  return (
    <section className="island-list-page quick-commands-panel" aria-label={t.title}>
      <div className="quick-commands-panel__header">
        <span className="quick-commands-panel__title">{t.title}</span>
      </div>
      {!settings.enabled ? (
        <p className="quick-commands-panel__empty">{t.disabled}</p>
      ) : settings.items.length === 0 ? (
        <p className="quick-commands-panel__empty">{t.empty}</p>
      ) : (
        <ul className="quick-commands-panel__list">
          {settings.items.map((item) => (
            <CommandRow
              key={item.id}
              item={item}
              running={runningId === item.id}
              busy={runningId !== null}
              lastRun={lastRuns[item.id]}
              onRun={() => run(item)}
            />
          ))}
        </ul>
      )}
    </section>
  );
}

function outputText(lastRun: LastRun): string {
  return combineCommandOutput(lastRun.stdout, lastRun.stderr);
}

function CommandRow({ item, running, busy, lastRun, onRun }: { item: QuickCommandItem; running: boolean; busy: boolean; lastRun: LastRun | undefined; onRun: () => void }) {
  const t = useTranslation().quickCommands;
  const output = lastRun === undefined ? "" : outputText(lastRun);
  const kind = lastRun === undefined ? null : commandResultKind(lastRun);
  return (
    <li className="quick-commands-panel__row">
      <button className="quick-commands-panel__run" type="button" onClick={onRun} disabled={busy} aria-label={`${t.run} ${item.name}`}>
        <Terminal className="quick-commands-panel__icon" size={16} strokeWidth={2} aria-hidden="true" />
        <span className="quick-commands-panel__label">{item.name}</span>
        <span className="quick-commands-panel__command">{item.command}</span>
        <Play className="quick-commands-panel__play" size={14} strokeWidth={2} aria-hidden="true" />
      </button>
      {running ? <p className="quick-commands-panel__status">{t.running}</p> : null}
      {lastRun !== undefined && !running ? (
        <div className="quick-commands-panel__result">
          <span className="quick-commands-panel__exit">
            {kind === "error" ? `${t.failed}: ${lastRun.error}` : kind === "timedOut" ? t.timedOut : t.exitCode(lastRun.exitCode)}
          </span>
          {output === "" ? <span className="quick-commands-panel__no-output">{t.noOutput}</span> : <pre className="quick-commands-panel__output">{output}</pre>}
        </div>
      ) : null}
    </li>
  );
}
