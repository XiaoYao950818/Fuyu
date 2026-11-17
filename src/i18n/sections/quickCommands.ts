export type QuickCommandsText = {
  title: string;
  empty: string;
  disabled: string;
  run: string;
  running: string;
  exitCode: (code: number | null) => string;
  timedOut: string;
  noOutput: string;
  failed: string;
  settings: QuickCommandsSettingsText;
};

export type QuickCommandsSettingsText = {
  title: string;
  enable: string;
  enableHint: string;
  empty: string;
  name: string;
  namePlaceholder: string;
  command: string;
  commandPlaceholder: string;
  add: string;
  remove: string;
  commandHint: string;
};

export const zhCN: QuickCommandsText = {
  title: "快捷命令",
  empty: "还没有命令，在设置里添加一条命令吧。",
  disabled: "快捷命令已关闭，在设置里打开后可一键运行命令。",
  run: "运行",
  running: "运行中…",
  exitCode: (code) => (code === null ? "没有退出码" : `退出码 ${code}`),
  timedOut: "运行超时（30 秒），已停止。",
  noOutput: "没有输出。",
  failed: "运行失败",
  settings: {
    title: "快捷命令",
    enable: "启用快捷命令",
    enableHint: "在岛上显示快捷命令页，点一下就运行。",
    empty: "还没有命令，添加一条命令吧。",
    name: "名字",
    namePlaceholder: "例如：清理临时文件",
    command: "命令",
    commandPlaceholder: "例如：Get-ChildItem $env:TEMP | Measure-Object",
    add: "添加",
    remove: "删除",
    commandHint: "命令在 PowerShell 里运行，30 秒内跑完，输出会显示在面板上。",
  },
};

export const en: QuickCommandsText = {
  title: "Quick commands",
  empty: "No commands yet. Add one in Settings.",
  disabled: "Quick commands are off. Turn them on in Settings to run a command with one click.",
  run: "Run",
  running: "Running…",
  exitCode: (code) => (code === null ? "No exit code" : `Exit code ${code}`),
  timedOut: "Timed out after 30 seconds and was stopped.",
  noOutput: "No output.",
  failed: "Failed to run",
  settings: {
    title: "Quick commands",
    enable: "Enable quick commands",
    enableHint: "Shows the quick commands page on the island. One click runs a command.",
    empty: "No commands yet. Add one.",
    name: "Name",
    namePlaceholder: "For example: Clean temp files",
    command: "Command",
    commandPlaceholder: "For example: Get-ChildItem $env:TEMP | Measure-Object",
    add: "Add",
    remove: "Remove",
    commandHint: "Commands run in PowerShell, finish within 30 seconds, and their output shows in the panel.",
  },
};
