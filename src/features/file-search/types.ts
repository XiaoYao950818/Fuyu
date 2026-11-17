export type FileSearchState = "not-started" | "building" | "ready" | "error";

export type FileSearchItem = {
  name: string;
  path: string;
  size: number;
  modified: number | null;
  isDirectory: boolean;
};

export type FileSearchStatus = {
  state: FileSearchState;
  indexedCount: number;
  drives: string[];
  adminRequired: boolean;
  error: string | null;
};

export type FileSearchSettings = {
  enabled: boolean;
};
