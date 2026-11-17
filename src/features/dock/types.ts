export type DockApp = {
  windowHandle: number;
  title: string;
  exePath: string | null;
  icon: string | null;
  minimized: boolean;
  active: boolean;
};

export type DockAppList = {
  available: boolean;
  apps: DockApp[];
};

export type TrayIcon = {
  id: string;
  name: string;
  exePath: string | null;
  icon: string | null;
  overflow: boolean;
};

export type TrayIconList = {
  available: boolean;
  overflowAvailable: boolean;
  icons: TrayIcon[];
};

export type DockPinnedApp = {
  id: string;
  name: string;
  target: string;
};

export type DockScreen = "primary" | "cursor";

export type DockSettings = {
  enabled: boolean;
  screen: DockScreen;
  pinned: DockPinnedApp[];
};

export type DockEntry = {
  id: string;
  name: string;
  icon: string | null;
  target: string | null;
  windowHandle: number | null;
  minimized: boolean;
  active: boolean;
  pinned: boolean;
};
