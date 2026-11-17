import { useCallback, useEffect, useRef, useState } from "react";
import { File, Folder, FolderSearch, RefreshCw, Search } from "lucide-react";
import { useErrorText, useTranslation } from "../../i18n";
import { getFileSearchStatus, openFileSearchItem, revealFileSearchItem, searchFiles, startFileIndex } from "./api";
import { FILE_SEARCH_RESULT_LIMIT, fileSearchEmptyState, formatFileModified, formatFileSize, limitFileResults, matchFileName } from "./search";
import { useFileSearchSettings } from "./useFileSearchSettings";
import type { FileSearchItem, FileSearchStatus } from "./types";
import "../../components/list/IslandList.css";
import "./FileSearch.css";

const DEBOUNCE_MS = 300;
const STATUS_POLL_MS = 2000;

export function FileSearchPanel() {
  const t = useTranslation().fileSearch;
  const errorText = useErrorText();
  const [settings] = useFileSearchSettings();
  const [status, setStatus] = useState<FileSearchStatus | null>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<FileSearchItem[]>([]);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const startedRef = useRef(false);

  const refreshStatus = useCallback(() => {
    getFileSearchStatus().then(setStatus).catch(() => setStatus(null));
  }, []);

  useEffect(() => {
    if (!settings.enabled) return;
    refreshStatus();
    if (!startedRef.current) {
      startedRef.current = true;
      startFileIndex().catch(() => undefined);
    }
    const id = window.setInterval(refreshStatus, STATUS_POLL_MS);
    return () => window.clearInterval(id);
  }, [settings.enabled, refreshStatus]);

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed === "" || status?.state !== "ready") {
      setResults([]);
      setSearching(false);
      return;
    }
    setSearching(true);
    const id = window.setTimeout(() => {
      searchFiles(trimmed, FILE_SEARCH_RESULT_LIMIT).then(
        (items) => {
          setResults(limitFileResults(items.filter((item) => matchFileName(item.name, trimmed)), FILE_SEARCH_RESULT_LIMIT));
          setSearching(false);
          setError(null);
        },
        (failure: unknown) => {
          setResults([]);
          setSearching(false);
          setError(errorText(failure));
        },
      );
    }, DEBOUNCE_MS);
    return () => window.clearTimeout(id);
  }, [query, status?.state, errorText]);

  const open = (item: FileSearchItem) => {
    openFileSearchItem(item).catch((failure: unknown) => setError(errorText(failure)));
  };

  const reveal = (item: FileSearchItem) => {
    revealFileSearchItem(item).catch((failure: unknown) => setError(errorText(failure)));
  };

  const emptyState = fileSearchEmptyState({ enabled: settings.enabled, status, query, searching, resultCount: results.length });

  const emptyText = (): string => {
    switch (emptyState) {
      case "disabled":
        return t.disabled;
      case "loading":
        return t.loading;
      case "adminRequired":
        return t.adminRequired;
      case "indexing":
        return t.indexing(status?.indexedCount ?? 0);
      case "error":
        return status?.error ?? t.failed;
      case "hint":
        return t.hint(status?.indexedCount ?? 0);
      case "searching":
        return t.searching;
      case "noResults":
        return t.noResults;
      case null:
        return "";
    }
  };

  return (
    <section className="island-list-page file-search-panel" aria-label={t.title}>
      <div className="file-search-panel__search">
        <Search className="file-search-panel__search-icon" size={15} strokeWidth={2} aria-hidden="true" />
        <input
          className="file-search-panel__input"
          type="search"
          value={query}
          placeholder={t.placeholder}
          aria-label={t.placeholder}
          disabled={!settings.enabled || status?.state !== "ready"}
          onChange={(event) => setQuery(event.target.value)}
        />
        <button className="file-search-panel__button" type="button" aria-label={t.refresh} title={t.refresh} onClick={refreshStatus} disabled={!settings.enabled}>
          <RefreshCw size={14} strokeWidth={2.2} aria-hidden="true" />
        </button>
      </div>
      {emptyState !== null ? (
        <p className="file-search-panel__empty">{emptyText()}</p>
      ) : (
        <ul className="file-search-panel__list">
          {results.map((item) => (
            <li className="file-search-panel__row" key={item.path}>
              <button className="file-search-panel__open" type="button" onClick={() => open(item)} aria-label={`${t.open} ${item.name}`}>
                {item.isDirectory ? (
                  <Folder className="file-search-panel__icon" size={16} strokeWidth={2} aria-hidden="true" />
                ) : (
                  <File className="file-search-panel__icon" size={16} strokeWidth={2} aria-hidden="true" />
                )}
                <span className="file-search-panel__name">{item.name}</span>
                <span className="file-search-panel__meta">
                  {item.isDirectory ? t.folder : formatFileSize(item.size)}
                  {formatFileModified(item.modified) === "" ? "" : ` · ${formatFileModified(item.modified)}`}
                </span>
                <span className="file-search-panel__path">{item.path}</span>
              </button>
              <button className="file-search-panel__reveal" type="button" onClick={() => reveal(item)} aria-label={`${t.revealInFolder} ${item.name}`} title={t.revealInFolder}>
                <FolderSearch size={14} strokeWidth={2} aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      )}
      {error !== null ? <p className="file-search-panel__error">{error}</p> : null}
    </section>
  );
}
