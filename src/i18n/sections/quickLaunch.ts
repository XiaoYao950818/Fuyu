export type QuickLaunchText = {
  title: string;
  empty: string;
  disabled: string;
  openFailed: string;
  kind: Record<"app" | "folder" | "url", string>;
  settings: QuickLaunchSettingsText;
};

export type QuickLaunchSettingsText = {
  title: string;
  enable: string;
  enableHint: string;
  empty: string;
  name: string;
  namePlaceholder: string;
  target: string;
  targetPlaceholder: string;
  kind: string;
  browseFile: string;
  browseFolder: string;
  add: string;
  remove: string;
  targetHint: string;
};

export const zhCN: QuickLaunchText = {
  title: "快捷启动",
  empty: "还没有启动项，在设置里添加应用、文件夹或网址。",
  disabled: "快捷启动已关闭，在设置里打开后可一键打开应用、文件夹或网址。",
  openFailed: "打不开",
  kind: { app: "应用", folder: "文件夹", url: "网址" },
  settings: {
    title: "快捷启动",
    enable: "启用快捷启动",
    enableHint: "在岛上显示快捷启动页，点一下就打开。",
    empty: "还没有启动项，添加一个应用、文件夹或网址吧。",
    name: "名字",
    namePlaceholder: "例如：微信",
    target: "目标",
    targetPlaceholder: "路径或网址",
    kind: "类型",
    browseFile: "选择文件",
    browseFolder: "选择文件夹",
    add: "添加",
    remove: "删除",
    targetHint: "应用填程序或文件路径，文件夹填文件夹路径，网址填以 https:// 开头的地址。",
  },
};

export const en: QuickLaunchText = {
  title: "Quick launch",
  empty: "No launch items yet. Add an app, a folder, or a website in Settings.",
  disabled: "Quick launch is off. Turn it on in Settings to open apps, folders, and websites with one click.",
  openFailed: "Could not open",
  kind: { app: "App", folder: "Folder", url: "Website" },
  settings: {
    title: "Quick launch",
    enable: "Enable quick launch",
    enableHint: "Shows the quick launch page on the island. One click opens it.",
    empty: "No launch items yet. Add an app, a folder, or a website.",
    name: "Name",
    namePlaceholder: "For example: WeChat",
    target: "Target",
    targetPlaceholder: "Path or URL",
    kind: "Type",
    browseFile: "Choose file",
    browseFolder: "Choose folder",
    add: "Add",
    remove: "Remove",
    targetHint: "Apps take a program or file path, folders take a folder path, and websites take an address starting with https://.",
  },
};
