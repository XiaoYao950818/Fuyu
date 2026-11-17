export type PluginViewsText = {
  pageLabel: (title: string, plugin: string) => string;
  waiting: string;
  starting: string;
  stopped: string;
  restart: string;
  empty: string;
  search: string;
  loading: string;
  actions: string;
  submit: string;
  submitted: string;
  webviewNotOnMac: string;
  pagesSettings: { title: string; hint: string; empty: string; show: string; moveUp: string; moveDown: string; reset: string; resetConfirm: string; defaultPage: string; builtin: string };
};

export const zhCN: PluginViewsText = {
  pageLabel: (title, plugin) => `${title}（${plugin}）`,
  waiting: "等待插件发来内容…",
  starting: "插件正在启动…",
  stopped: "插件已停止",
  restart: "重新启动",
  empty: "这里还没有内容",
  search: "搜索",
  loading: "加载中…",
  actions: "操作",
  submit: "提交",
  submitted: "已提交",
  webviewNotOnMac: "这个页面用插件自己的网页画，Mac 上暂不支持。插件在收起条上的内容照常显示。",
  pagesSettings: {
    title: "岛上页面",
    hint: "默认顺序是内置页面在前、插件页面在后；排在第一位的页面就是展开岛时默认显示的页面。只列出已启用的页面。也可以直接在岛上拖动页签换位置。",
    empty: "已启用的插件还没有添加页面。",
    show: "显示",
    moveUp: "上移",
    moveDown: "下移",
    reset: "恢复默认顺序",
    resetConfirm: "把页签顺序恢复成默认顺序吗？",
    defaultPage: "默认",
    builtin: "内置",
  },
};

export const en: PluginViewsText = {
  pageLabel: (title, plugin) => `${title} (${plugin})`,
  waiting: "Waiting for the plugin…",
  starting: "The plugin is starting…",
  stopped: "The plugin has stopped",
  restart: "Restart",
  empty: "Nothing here yet",
  search: "Search",
  loading: "Loading…",
  actions: "Actions",
  submit: "Submit",
  submitted: "Sent",
  webviewNotOnMac: "This page is the plugin's own web page, which is not supported on a Mac yet. The plugin's items on the collapsed bar still show.",
  pagesSettings: {
    title: "Island pages",
    hint: "By default the built-in pages come first and plugin pages follow; the first page is the one the island shows when it expands. Only pages that are on are listed. Tabs can also be dragged to reorder right on the island.",
    empty: "No plugin that is on has added a page yet.",
    show: "Show",
    moveUp: "Move up",
    moveDown: "Move down",
    reset: "Reset to default order",
    resetConfirm: "Reset the tab order to the default order?",
    defaultPage: "Default",
    builtin: "Built-in",
  },
};
