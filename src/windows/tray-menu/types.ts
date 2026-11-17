import type { TrayMenuAction, TrayMenuState } from "./api";
import type { TrayMedia } from "./trayCard";

export type TrayMenuShortcuts = {
  screenshot: string | null;
  clipboard: string | null;
};

export type TrayCardData = {
  state: TrayMenuState;
  shortcuts: TrayMenuShortcuts;
  off: ReadonlySet<string>;
  dnd: boolean;
  autostart: boolean;
  media: TrayMedia | null;
  now: number;
};

export type TrayCardHandlers = {
  onAction: (action: TrayMenuAction, arg?: string) => void;
  onDnd: () => void;
  onAutostart: () => void;
  onPlayPause: () => void;
  onNext: () => void;
};

export type TrayCardProps = { data: TrayCardData; handlers: TrayCardHandlers };
