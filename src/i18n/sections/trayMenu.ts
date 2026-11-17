export type TrayMenuText = {
  cardName: string;
  appName: string;
  updateBadge: string;
  updateLabel: (version: string) => string;
  separator: string;
  settings: string;
  island: string;
  islandOn: string;
  islandOff: string;
  islandOnShort: string;
  islandOffShort: string;
  showIsland: string;
  hideIsland: string;
  screenshot: string;
  clipboard: string;
  off: string;
  offHint: (feature: string) => string;
  open: string;
  openPage: (page: string) => string;
  pages: Record<"file-shelf", string>;
  dnd: string;
  clipPaused: string;
  autostart: string;
  autostartMac: string;
  restart: string;
  quit: string;
  nowPlaying: string;
  unknownTrack: string;
  play: string;
  pause: string;
  next: string;
  calm: string;
  calmSub: string;
};

export const zhCN: TrayMenuText = {
  cardName: "浮屿托盘卡片",
  appName: "浮屿",
  updateBadge: "可更新",
  updateLabel: (version) => `有新版本 ${version}，点一下更新`,
  separator: "，",
  settings: "设置",
  island: "岛屿",
  islandOn: "显示中，点一下隐藏",
  islandOff: "已隐藏，点一下显示",
  islandOnShort: "显示中",
  islandOffShort: "已隐藏",
  showIsland: "显示岛屿",
  hideIsland: "隐藏岛屿",
  screenshot: "截图",
  clipboard: "剪贴板",
  off: "已关闭",
  offHint: (feature) => `已关闭，去 设置 → ${feature} 里打开`,
  open: "打开",
  openPage: (page) => `打开${page}`,
  pages: { "file-shelf": "文件中转" },
  dnd: "游戏勿扰",
  clipPaused: "暂停剪贴板记录",
  autostart: "开机自启",
  autostartMac: "登录时打开",
  restart: "重启",
  quit: "退出",
  nowPlaying: "正在播放",
  unknownTrack: "未知歌曲",
  play: "播放",
  pause: "暂停",
  next: "下一首",
  calm: "现在没什么事",
  calmSub: "有歌在放时会出现在这里",
};

export const en: TrayMenuText = {
  cardName: "Fuyu tray card",
  appName: "Fuyu",
  updateBadge: "Update",
  updateLabel: (version) => `Version ${version} is out, click to update`,
  separator: ", ",
  settings: "Settings",
  island: "Island",
  islandOn: "Showing, click to hide",
  islandOff: "Hidden, click to show",
  islandOnShort: "Showing",
  islandOffShort: "Hidden",
  showIsland: "Show island",
  hideIsland: "Hide island",
  screenshot: "Screenshot",
  clipboard: "Clipboard",
  off: "Off",
  offHint: (feature) => `Off. Turn it on in Settings → ${feature}`,
  open: "Open",
  openPage: (page) => `Open ${page}`,
  pages: { "file-shelf": "File shelf" },
  dnd: "Game mode",
  clipPaused: "Pause clipboard history",
  autostart: "Launch at startup",
  autostartMac: "Open at login",
  restart: "Restart",
  quit: "Quit",
  nowPlaying: "Now playing",
  unknownTrack: "Unknown track",
  play: "Play",
  pause: "Pause",
  next: "Next",
  calm: "Nothing going on",
  calmSub: "Music shows up here",
};
