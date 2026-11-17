export type QuickCommandItem = {
  id: string;
  name: string;
  command: string;
};

export type QuickCommandSettings = {
  enabled: boolean;
  items: QuickCommandItem[];
};

export type QuickCommandResult = {
  stdout: string;
  stderr: string;
  exitCode: number | null;
  timedOut: boolean;
};
