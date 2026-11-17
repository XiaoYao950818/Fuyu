export type FileSearchText = {
  title: string;
  placeholder: string;
  refresh: string;
  loading: string;
  indexing: (count: number) => string;
  hint: (count: number) => string;
  searching: string;
  noResults: string;
  disabled: string;
  adminRequired: string;
  failed: string;
  open: string;
  revealInFolder: string;
  folder: string;
  settings: FileSearchSettingsText;
};

export type FileSearchSettingsText = {
  title: string;
  enable: string;
  enableHint: string;
  ready: (count: number, drives: string) => string;
};

export const zhCN: FileSearchText = {
  title: "文件快速搜索",
  placeholder: "搜文件名…",
  refresh: "刷新索引状态",
  loading: "正在读取索引状态…",
  indexing: (count) => `正在建立索引…已收录 ${count} 个文件。`,
  hint: (count) => `已收录 ${count} 个文件，输入文件名搜索（只搜名字，不搜内容）。`,
  searching: "正在搜索…",
  noResults: "没有找到匹配的文件。",
  disabled: "文件快速搜索已关闭，在设置里打开后可搜索文件名。",
  adminRequired: "需要管理员权限运行，请右键以管理员身份运行浮屿。",
  failed: "索引建立失败。",
  open: "打开",
  revealInFolder: "在文件夹中显示",
  folder: "文件夹",
  settings: {
    title: "文件快速搜索",
    enable: "启用文件快速搜索",
    enableHint: "读 NTFS 主文件表建索引，只搜文件名，不搜文件内容。",
    ready: (count, drives) => `索引就绪：${drives} 共 ${count} 个文件。`,
  },
};

export const en: FileSearchText = {
  title: "File search",
  placeholder: "Search file names…",
  refresh: "Refresh index status",
  loading: "Reading index status…",
  indexing: (count) => `Building the index… ${count} files indexed so far.`,
  hint: (count) => `${count} files indexed. Type a file name to search (names only, not contents).`,
  searching: "Searching…",
  noResults: "No matching files found.",
  disabled: "File search is off. Turn it on in Settings to search file names.",
  adminRequired: "Administrator rights are required. Right-click Fuyu and run it as administrator.",
  failed: "Failed to build the index.",
  open: "Open",
  revealInFolder: "Reveal in folder",
  folder: "Folder",
  settings: {
    title: "File search",
    enable: "Enable file search",
    enableHint: "Reads the NTFS master file table to build an index. Searches file names only, not contents.",
    ready: (count, drives) => `Index ready: ${count} files on ${drives}.`,
  },
};
