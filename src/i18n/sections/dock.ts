export type DockText = {
  title: string;
  trayTitle: string;
  loading: string;
  unavailable: string;
  disabled: string;
  failed: string;
  emptyApps: string;
  emptyTray: string;
  trayOverflowUnavailable: string;
  trayFailed: string;
  unknownApp: string;
  openSettings: string;
  switchTo: (name: string) => string;
  openApp: (name: string) => string;
  minimized: string;
  running: string;
  settings: DockSettingsText;
};

export type DockSettingsText = {
  title: string;
  enable: string;
  enableHint: string;
  screen: string;
  screenHint: string;
  screenOptions: Record<DockScreenText, string>;
  pinnedTitle: string;
  pinnedEmpty: string;
  addApp: string;
  removeApp: (name: string) => string;
  pinnedFull: string;
  pinnedHint: string;
};

export type DockScreenText = "primary" | "cursor";

export const zhCN: DockText = {
  title: "Dock 栏",
  trayTitle: "系统托盘",
  loading: "正在读取运行中的应用…",
  unavailable: "Dock 在这个系统上不可用。",
  disabled: "Dock 已关闭，在设置里打开后可使用。",
  failed: "读取运行中的应用失败。",
  emptyApps: "现在没有正在运行的应用。",
  emptyTray: "没有找到托盘图标。",
  trayOverflowUnavailable: "隐藏的托盘图标暂时读不到，点一下系统托盘的展开箭头后再试。",
  trayFailed: "读取托盘图标失败。",
  unknownApp: "未知应用",
  openSettings: "打开设置",
  switchTo: (name) => `切换到「${name}」`,
  openApp: (name) => `打开「${name}」`,
  minimized: "已最小化",
  running: "正在运行",
  settings: {
    title: "Dock",
    enable: "启用 Dock",
    enableHint: "在屏幕底部显示 Dock 栏，代替系统任务栏。开启后会隐藏原任务栏，关闭 Dock 或退出浮屿时会恢复。",
    screen: "显示在哪个屏幕",
    screenHint: "跟随鼠标时，鼠标移到哪个屏幕，Dock 就跟到哪个屏幕。",
    screenOptions: { primary: "主屏幕", cursor: "鼠标所在的屏幕" },
    pinnedTitle: "固定应用",
    pinnedEmpty: "还没固定应用，点下面添加常用的程序。",
    addApp: "添加程序",
    removeApp: (name) => `取消固定「${name}」`,
    pinnedFull: "最多固定 12 个应用。",
    pinnedHint: "固定后不管有没有运行，都会出现在 Dock 栏里。",
  },
};

export const en: DockText = {
  title: "Dock",
  trayTitle: "System tray",
  loading: "Reading running apps…",
  unavailable: "The Dock is not available on this system.",
  disabled: "The Dock is off. Turn it on in Settings to use it.",
  failed: "Could not read the running apps.",
  emptyApps: "No apps are running right now.",
  emptyTray: "No tray icons were found.",
  trayOverflowUnavailable: "Hidden tray icons could not be read right now. Open the tray overflow chevron and try again.",
  trayFailed: "Could not read the tray icons.",
  unknownApp: "Unknown app",
  openSettings: "Open Settings",
  switchTo: (name) => `Switch to ${name}`,
  openApp: (name) => `Open ${name}`,
  minimized: "Minimized",
  running: "Running",
  settings: {
    title: "Dock",
    enable: "Enable Dock",
    enableHint: "Shows a Dock bar at the bottom of the screen instead of the system taskbar. The taskbar is hidden while the Dock runs and restored when the Dock is turned off or Fuyu quits.",
    screen: "Show on screen",
    screenHint: "When following the mouse, the Dock moves to whichever screen the mouse is on.",
    screenOptions: { primary: "Primary screen", cursor: "Screen with the mouse" },
    pinnedTitle: "Pinned apps",
    pinnedEmpty: "No apps pinned yet. Add a program you use often below.",
    addApp: "Add program",
    removeApp: (name) => `Unpin ${name}`,
    pinnedFull: "You can pin up to 12 apps.",
    pinnedHint: "Pinned apps stay on the Dock whether or not they are running.",
  },
};
