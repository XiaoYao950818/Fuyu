export type QuickLaunchKind = "app" | "folder" | "url";

export type QuickLaunchItem = {
  id: string;
  name: string;
  target: string;
  kind: QuickLaunchKind;
};

export type QuickLaunchSettings = {
  enabled: boolean;
  items: QuickLaunchItem[];
};
