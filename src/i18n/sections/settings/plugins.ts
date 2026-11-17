export type SettingsPluginsText = {
  allowThirdParty: string;
  warning: string;
  folder: string;
  brokenState: (backup: string) => string;
  openFolder: string;
  reload: string;
  secretsPermissionMac: string;
  feedback: {
    checking: string;
    upToDate: string;
    found: (count: number) => string;
    reloaded: (count: number) => string;
    folderOpened: string;
    folderOpenedMac: string;
    dataCleared: string;
    saved: string;
    commandSent: string;
  };
  empty: string;
  groupBuiltin: (count: number) => string;
  groupThirdParty: (count: number) => string;
  overview: {
    search: string;
    filter: Record<"all" | "running" | "updates" | "attention", string>;
    filterLabel: string;
    noMatches: string;
    dockTitle: (count: number) => string;
    dockRunning: (running: number) => string;
    dockAttention: (running: number, attention: number) => string;
    dockOpen: (name: string) => string;
  };
  enable: string;
  by: (author: string) => string;
  homepage: string;
  permissions: string;
  noPermissions: string;
  optionalPermission: string;
  permissionCount: (count: number) => string;
  permission: Record<"island:notify" | "secrets" | "clipboard:read" | "messages:read" | "media:read" | "media:control" | "shelf:read" | "shelf:write" | "windows", string>;
  needsApproval: string;
  keybindingConflict: (shortcuts: string) => string;
  sensitive: {
    prompt: (plugin: string, action: string) => string;
    allow: string;
    once: string;
    deny: string;
    action: Record<
      | "island:notify" | "secrets" | "clipboard:read" | "messages:read" | "media:read" | "media:control"
      | "shelf:read" | "shelf:write" | "windows" | "uri",
      string
    >;
    title: string;
    hint: string;
    allowed: string;
    denied: string;
    revoke: string;
    none: string;
  };
  notAllowed: string;
  describedOnly: string;
  invalid: string;
  log: string;
  noLog: string;
  calls: {
    title: string;
    hint: string;
    none: string;
    outcome: Record<"ok" | "denied" | "unknown" | "error", string>;
  };
  status: Record<"stopped" | "starting" | "running" | "restarting" | "crashed" | "idle", string>;
  run: {
    onDemand: string;
    memory: (megabytes: string) => string;
    highCpu: string;
    keepAlive: (reason: string) => string;
    onDemandShort: string;
    keepAliveShort: string;
  };
  dev: {
    title: string;
    badge: string;
    mode: string;
    modeHint: string;
    path: string;
    pathPlaceholder: string;
    load: string;
    pick: string;
    reload: string;
    reloaded: string;
    unload: string;
    noPlugins: string;
    recent: string;
    recentRestores: string;
    loadAgain: string;
    forget: string;
    trace: (id: string) => string;
    traceEmpty: string;
    event: string;
    payload: string;
    send: string;
    badJson: string;
  };
  uninstall: string;
  confirmUninstall: string;
  builtin: string;
  runtimeBuiltIn: string;
  runtimeNode: string;
  nodeMissing: string;
  getNode: string;
  powershellMissing: string;
  getPowershell: string;
  notForMac: string;
  notForWindows: string;
  webviewNotOnMac: string;
  needsNode: string;
  needsPowershell: string;
  nodeMissingCount: (count: number) => string;
  powershellMissingCount: (count: number) => string;
  describedOnlyShort: string;
  moreNotes: (count: number) => string;
  detail: {
    open: string;
    back: string;
    info: string;
    infoWhenRunning: string;
    settings: string;
    noSettings: string;
    actions: string;
    copy: string;
    copied: string;
    notifications: string;
    showNotifications: string;
    windows: string;
    windowsNoTopmost: string;
    windowsNoClickThrough: string;
    windowsHidden: string;
    windowsHint: string;
    memoryLimit: string;
    memoryLimitOption: (megabytes: number) => string;
    memoryLimitHint: string;
    data: string;
    dataHint: string;
    clearData: string;
    confirmClearData: string;
  };
  market: {
    title: string;
    hint: string;
    refresh: string;
    loading: string;
    empty: string;
    loadFailed: string;
    loadFailedMac: string;
    installFailed: (name: string) => string;
    install: string;
    installing: string;
    update: (version: string) => string;
    installed: string;
    incompatible: string;
    search: string;
    summary: (installed: number, updates: number, favorites: number) => string;
    noMatches: string;
    allCategories: string;
    spotlight: string;
    category: Record<"productivity" | "developer" | "media" | "messages" | "information" | "utilities" | "sounds", string>;
    official: string;
    publisher: (name: string) => string;
    trustAndInstall: string;
    confirmTrust: string;
    trustHint: (publisher: string) => string;
    signed: string;
    keyChanged: (keyId: string) => string;
    signatureDropped: string;
    updateAnyway: string;
    confirmKeyChange: string;
    cancel: string;
    revoked: string;
    repository: string;
    reportIssue: string;
    readme: string;
    changelog: string;
    customUi: string;
    customUiNotOnMac: string;
    status: (count: number, time: string) => string;
    statusCount: (count: number) => string;
    refreshing: string;
    groupInstallable: (count: number) => string;
    groupInstalled: (count: number) => string;
    groupUpdates: (count: number) => string;
    favorites: (count: number) => string;
    noFavorites: string;
    request: {
      title: (name: string) => string;
      titleUnknown: string;
      hint: string;
      loading: string;
      missing: (id: string) => string;
      failed: string;
      dismiss: string;
    };
    favorite: (name: string) => string;
    unfavorite: (name: string) => string;
    like: (name: string, count: number) => string;
    sortLabel: string;
    sortIndex: string;
    sortLikes: string;
    manage: string;
    verified: string;
    noPermissions: string;
    runtime: Record<"node" | "powershell" | "exe", string>;
  };
  updates: {
    title: string;
    autoUpdate: string;
    autoUpdateHint: string;
    check: string;
    trusted: string;
    noTrusted: string;
    untrust: string;
    available: (version: string) => string;
    keyChanged: (version: string) => string;
    autoUpdated: (version: string) => string;
    autoUpdateFailed: (reason: string) => string;
    revoked: (reason: string) => string;
    preReleaseTitle: string;
    preRelease: string;
    preReleaseHint: string;
    preReleaseAvailable: (version: string) => string;
    preReleaseOffered: (version: string) => string;
    autoUpdatedShort: (version: string) => string;
    preReleaseShort: (version: string) => string;
  };
  sshTunnel: {
    title: string;
    hint: string;
    empty: string;
    port: string;
    portInvalid: string;
    needsPort: string;
    checking: string;
    state: Record<"off" | "connecting" | "connected" | "portInUse" | "error", string>;
    waitingForPlugin: string;
    confirm: (host: string, port: number) => string;
    unchecked: (host: string, port: number, reason: string) => string;
    yes: string;
    no: string;
    proxy: {
      label: string;
      looking: string;
      found: Record<"clashVerge" | "v2rayN" | "systemProxy" | "clashVergeDefault" | "v2rayNDefault" | "custom", string>;
      listening: string;
      notListening: string;
    };
  };
};

export const zhCN: SettingsPluginsText = {
  allowThirdParty: "允许运行第三方插件",
  warning: "插件是在你电脑上运行的程序，和你本人有同样的权限：可以读写文件、联网，也能读到这台电脑上保存的密码和授权码（包括岛屿保存的邮箱授权码）。下面列出的权限只限制它能通过岛屿读写哪些数据。只安装你信任的插件。",
  folder: "插件目录",
  brokenState: (backup) => `插件设置文件读不出来，已按默认值重新开始：第三方插件的开关、授权、设置和信任的发布者都要重新设置。原文件备份在 ${backup}。`,
  openFolder: "打开",
  reload: "重新加载",
  secretsPermissionMac: "在钥匙串中保存密码和令牌",
  feedback: {
    checking: "正在检查…",
    upToDate: "已是最新（刚刚检查）",
    found: (count) => `找到 ${count} 个更新`,
    reloaded: (count) => `已重新加载，共 ${count} 个插件`,
    folderOpened: "已在资源管理器中打开",
    folderOpenedMac: "已在访达中打开",
    dataCleared: "数据已清除",
    saved: "已保存",
    commandSent: "已发给插件",
  },
  empty: "还没有安装插件。把插件文件夹放进插件目录，再点“重新加载”。",
  groupBuiltin: (count: number) => `内置（${count}）`,
  groupThirdParty: (count: number) => `第三方（${count}）`,
  overview: {
    search: "搜索已安装的插件",
    filter: { all: "全部", running: "运行中", updates: "可更新", attention: "需处理" },
    filterLabel: "按状态筛选",
    noMatches: "没有符合条件的插件。",
    dockTitle: (count) => `装了 ${count} 个插件`,
    dockRunning: (running) => (running > 0 ? `${running} 个正在运行，一切正常` : "现在没有插件在运行"),
    dockAttention: (running, attention) => `${running} 个正在运行，${attention} 个需要你看一下`,
    dockOpen: (name) => `打开 ${name} 的设置`,
  },
  enable: "启用",
  by: (author: string) => `作者：${author}`,
  homepage: "主页",
  permissions: "需要的权限",
  noPermissions: "不需要读写岛上的数据",
  optionalPermission: "可选，用到时询问",
  permissionCount: (count: number) => `${count} 项权限`,
  permission: {
    "island:notify": "在岛上显示通知",
    secrets: "在 Windows 凭据管理器中保存密码和令牌",
    "clipboard:read": "读取剪贴板历史中的文字（敏感，首次使用时询问）",
    "messages:read": "读取 QQ、微信和邮箱的提醒：发送者和预览文字，不含邮件正文（敏感）",
    "media:read": "读取正在播放的歌曲和播放器（敏感）",
    "media:control": "播放、暂停、上一首、下一首",
    "shelf:read": "读取文件中转列表（只有路径，敏感）",
    "shelf:write": "往文件中转添加或移除条目，不会删除文件（敏感）",
    windows: "在岛屿之外新建自己的窗口（实验，暂只支持 Windows）",
  },
  needsApproval: "新版本需要更多权限，已暂停。关掉再打开开关即可授权。",
  keybindingConflict: (shortcuts: string) => `快捷键已被其他程序占用：${shortcuts}`,
  sensitive: {
    prompt: (plugin: string, action: string) => `${plugin} 想${action}`,
    allow: "允许",
    once: "本次",
    deny: "拒绝",
    action: {
      "island:notify": "在岛上显示通知",
      secrets: "保存自己的密钥",
      "media:control": "控制媒体播放",
      "clipboard:read": "读取剪贴板历史",
      "messages:read": "读取消息提醒",
      "media:read": "读取正在播放的内容",
      "shelf:read": "读取文件中转列表",
      "shelf:write": "修改文件中转列表",
      windows: "新建自己的窗口",
      uri: "处理网页或其他程序打开的 fuyu:// 链接",
    },
    title: "需要询问的权限",
    hint: "插件第一次使用敏感权限、申请可选权限或收到链接时，岛上会询问你。撤销后，下次会再问一次。",
    allowed: "已允许",
    denied: "已拒绝",
    revoke: "撤销",
    none: "还没有询问过。",
  },
  notAllowed: "先在上面打开“允许运行第三方插件”。",
  describedOnly: "这个插件没有需要运行的程序。",
  invalid: "无法加载",
  log: "日志",
  noLog: "暂无日志",
  calls: {
    title: "调用记录",
    hint: "插件最近 200 次调用了岛屿的哪些接口、结果如何，最新的在最上面。只记接口名称，不记读写的内容；岛屿重启后清空。",
    none: "还没有调用",
    outcome: { ok: "成功", denied: "没有权限", unknown: "没有这个接口", error: "出错" },
  },
  status: {
    stopped: "未运行",
    starting: "启动中",
    running: "运行中",
    restarting: "重启中",
    crashed: "已出错停止",
    idle: "待命",
  },
  run: {
    onDemand: "按需启动：用到时才运行，空闲 1 分钟后自动停止。",
    memory: (megabytes: string) => `内存 ${megabytes} MB`,
    highCpu: "这个插件过去 1 分钟一直占用较多 CPU。",
    keepAlive: (reason: string) => `插件申请常驻：${reason}`,
    onDemandShort: "按需启动",
    keepAliveShort: "申请常驻",
  },
  dev: {
    title: "开发者",
    badge: "开发中",
    mode: "开发模式",
    modeHint: "可以加载任意文件夹里的插件来调试：不需要打开“允许第三方插件”，自动获得它申请的权限（敏感权限仍会询问），也可以使用实验 API。开发模式不保存，岛屿重启后要重新打开（开发版岛屿启动时自动打开）；加载过的文件夹会记住。命令行工具 fuyu-plugin dev 还需要打开“本地 API”插件。",
    path: "插件文件夹",
    pathPlaceholder: "插件文件夹的完整路径，里面要有 fuyu-plugin.json",
    load: "加载",
    pick: "选择文件夹",
    reload: "重新加载",
    reloaded: "已重新加载",
    unload: "移除",
    noPlugins: "还没有加载开发中的插件。",
    recent: "最近加载过的",
    recentRestores: "这是开发版：开发模式在启动时自动打开，上次没有移除的插件和环境变量 FUYU_DEV_PLUGINS 列出的插件会自动加载。",
    loadAgain: "加载",
    forget: "不再记住",
    trace: (id: string) => `${id} 的 JSON-RPC 收发记录（最近 200 行）`,
    traceEmpty: "还没有收发记录。插件运行后会显示在这里。",
    event: "事件",
    payload: "事件内容（JSON）",
    send: "发送事件",
    badJson: "事件内容不是有效的 JSON。",
  },
  uninstall: "卸载",
  confirmUninstall: "确认卸载",
  builtin: "内置",
  runtimeBuiltIn: "无需另外安装",
  runtimeNode: "需要 Node.js",
  nodeMissing: "这台电脑上没有找到 Node.js，装好之后这个插件才能运行。",
  getNode: "下载 Node.js",
  powershellMissing: "这个插件用 PowerShell 写成，这台 Mac 上没有找到 PowerShell 7（pwsh），装好之后才能运行。",
  getPowershell: "安装 PowerShell",
  notForMac: "这个插件只支持 Windows，在 Mac 上不能运行。",
  notForWindows: "这个插件只支持 macOS，在 Windows 上不能运行。",
  webviewNotOnMac: "这个插件的页面用它自己的网页画，Mac 上暂不支持，打开是一行说明；收起条上的内容照常显示。",
  needsNode: "需要 Node.js",
  needsPowershell: "需要 PowerShell 7",
  nodeMissingCount: (count: number) => `这台电脑上没有找到 Node.js，${count} 个插件装好它之后才能运行。`,
  powershellMissingCount: (count: number) => `这台 Mac 上没有找到 PowerShell 7（pwsh），${count} 个用 PowerShell 写的插件装好它之后才能运行。`,
  describedOnlyShort: "不运行程序",
  moreNotes: (count: number) => `还有 ${count} 条`,
  detail: {
    open: "设置",
    back: "关闭",
    info: "运行信息",
    infoWhenRunning: "插件运行后，会在这里显示它提供的信息。",
    settings: "设置",
    noSettings: "这个插件没有可以调整的设置。",
    actions: "操作",
    copy: "复制",
    copied: "已复制",
    notifications: "通知",
    showNotifications: "在岛上显示这个插件的通知",
    windows: "窗口",
    windowsNoTopmost: "不允许置顶",
    windowsNoClickThrough: "不允许点击穿透",
    windowsHidden: "隐藏这个插件的全部窗口",
    windowsHint: "插件在岛屿之外新建的窗口。这里的设置优先于插件自己的设置；隐藏后插件建不了新窗口，再打开才行。",
    memoryLimit: "内存上限",
    memoryLimitOption: (megabytes: number) => (megabytes >= 1024 ? `${megabytes / 1024} GB` : `${megabytes} MB`) + (megabytes === 512 ? "（默认）" : ""),
    memoryLimitHint: "插件自己（连同它启动的程序）占用的内存超过上限时，岛屿会结束它并显示原因。和插件卡片上的内存一样，不算 PowerShell、Node.js 本身固定的那部分占用。一般不需要改；插件说明里要求更多内存时再调高。",
    data: "数据",
    dataHint: "删除插件保存的数据和凭据，插件会重新启动。卸载插件不会删除这些数据。",
    clearData: "清除数据",
    confirmClearData: "确认清除",
  },
  market: {
    title: "插件市场",
    hint: "从这里安装的插件会先核对校验值，确认文件完整、没被改动过。装好后默认是关闭的，打开时再决定给它哪些权限。",
    refresh: "刷新",
    loading: "正在加载插件列表…",
    empty: "市场里暂时还没有插件。",
    loadFailed: "暂时获取不到插件列表。请检查网络或 Windows 系统代理，然后点「刷新」重试。",
    loadFailedMac: "暂时获取不到插件列表。请检查网络或代理设置，然后点「刷新」重试。",
    installFailed: (name: string) => `「${name}」没有装上，已有的插件不受影响。`,
    install: "安装",
    installing: "正在安装…",
    update: (version: string) => `更新到 v${version}`,
    installed: "已安装",
    incompatible: "不兼容",
    search: "搜索名称、说明或发布者",
    summary: (installed: number, updates: number, favorites: number) =>
      [`已装 ${installed} 个`, updates > 0 ? `${updates} 个可更新` : "", favorites > 0 ? `收藏 ${favorites} 个` : ""].filter(Boolean).join(" · "),
    noMatches: "没有符合条件的插件。",
    allCategories: "全部",
    spotlight: "大家都在装",
    category: {
      productivity: "效率",
      developer: "开发",
      media: "媒体",
      messages: "消息",
      information: "资讯",
      utilities: "工具",
      sounds: "音效包",
    },
    official: "官方",
    publisher: (name: string) => `发布者 ${name}`,
    trustAndInstall: "信任并安装",
    confirmTrust: "确认信任并安装",
    signed: "作者已签名",
    keyChanged: (keyId: string) => `这个版本的签名密钥变了（现在是 ${keyId}），和已安装的版本不同。可能是作者换了密钥，也可能是插件仓库被人盗用。确认是作者本人发布的再更新。`,
    signatureDropped: "这个版本没有作者签名，而已安装的版本有。可能是作者停用了签名，也可能是插件仓库被人盗用。确认是作者本人发布的再更新。",
    updateAnyway: "仍然更新",
    confirmKeyChange: "确认更新",
    cancel: "取消",
    trustHint: (publisher: string) => `第一次安装 ${publisher} 发布的插件，需要先信任这个发布者。插件以你的身份运行，能访问你能访问的文件和保存的密码，只信任你了解的发布者。信任后它的插件可以安装和自动更新，可在 插件 → 更新 中取消。`,
    revoked: "已下架",
    repository: "源码仓库",
    reportIssue: "报告问题",
    readme: "插件说明",
    changelog: "版本历史",
    customUi: "自定义界面",
    customUiNotOnMac: "自定义界面 · Mac 暂不支持",
    status: (count: number, time: string) => `共 ${count} 个插件 · 索引更新于 ${time}`,
    statusCount: (count: number) => `共 ${count} 个插件`,
    refreshing: "正在刷新插件列表…",
    groupInstallable: (count: number) => `可安装（${count}）`,
    groupInstalled: (count: number) => `已安装（${count}）`,
    groupUpdates: (count: number) => `可更新（${count}）`,
    favorites: (count: number) => (count > 0 ? `收藏 ${count}` : "收藏"),
    noFavorites: "还没有收藏的插件。点卡片右侧的星标收藏，收藏只保存在这台电脑上。",
    request: {
      title: (name) => `官网请你安装「${name}」`,
      titleUnknown: "官网请你安装一个插件",
      hint: "确认是你自己点的，再点下面的「安装」。不点就什么都不会装。",
      loading: "正在读取插件市场……",
      missing: (id) => `插件市场里没有 ${id}，可能已经下架，或者链接写错了。`,
      failed: "插件市场读不出来，检查网络后点右上角的刷新再试。",
      dismiss: "不装了",
    },
    favorite: (name: string) => `收藏 ${name}`,
    unfavorite: (name: string) => `取消收藏 ${name}`,
    like: (name: string, count: number) => `${name}：${count} 个赞，在 GitHub 上点赞`,
    sortLabel: "排序",
    sortIndex: "默认顺序",
    sortLikes: "按点赞数",
    manage: "管理",
    verified: "已验证",
    noPermissions: "无需权限",
    runtime: { node: "Node.js", powershell: "PowerShell", exe: "程序" },
  },
  updates: {
    title: "更新",
    autoUpdate: "自动更新插件",
    autoUpdateHint: "岛屿每 6 小时在后台检查一次插件市场（只在允许第三方插件时）。打开后，作者签了名（并且密钥没变）、不需要新权限、发布者已受信任的更新会自动安装；其他更新只提示。",
    check: "立即检查",
    trusted: "受信任的发布者",
    noTrusted: "还没有信任其他发布者（官方插件总是受信任）。",
    untrust: "取消信任",
    available: (version: string) => `有新版本 v${version}，可在插件市场更新。`,
    keyChanged: (version: string) => `v${version} 的签名密钥和已安装的版本不同，不会自动更新；到插件市场确认后再更新。`,
    autoUpdated: (version: string) => `已自动更新到 v${version}。`,
    autoUpdateFailed: (reason: string) => `自动更新没成功，下次检查会再试：${reason}`,
    revoked: (reason: string) => `这个版本已从插件市场下架，已停用：${reason}`,
    preReleaseTitle: "预发布版本",
    preRelease: "接收这个插件的预发布版本",
    preReleaseHint: "预发布版本是作者还在测试的新版本，可能不稳定。关掉后不会退回旧版本，等正式版比当前版本新时再更新。",
    preReleaseAvailable: (version: string) => `插件市场里有预发布版本 v${version}。`,
    preReleaseOffered: (version: string) => `有预发布版本 v${version}，可在插件设置里选择接收。`,
    autoUpdatedShort: (version: string) => `已自动更新到 v${version}`,
    preReleaseShort: (version: string) => `有预发布版 v${version}`,
  },
  sshTunnel: {
    title: "主机",
    hint: "主机来自 ~/.ssh/config。每台填一个服务器上的端口（1024–65535，别和别人的隧道重复），打开后在服务器上运行下面那行 export 就能用这里的代理。",
    empty: "没有主机：在 ~/.ssh/config 里写 Host。",
    port: "服务器端口",
    portInvalid: "端口要是 1024–65535 的整数",
    needsPort: "先填服务器端口",
    checking: "正在检查服务器上的端口…",
    state: {
      off: "未开启",
      connecting: "连接中…",
      connected: "已连接",
      portInUse: "端口被占用，等待中",
      error: "连接失败，稍后重试",
    },
    waitingForPlugin: "插件开启后连接",
    confirm: (host: string, port: number) => `${host} 上的端口 ${port} 已被占用（可能是另一个隧道），仍要搭建隧道吗？`,
    unchecked: (host: string, port: number, reason: string) =>
      `没能检查 ${host} 上的端口 ${port} 是否被占用（${reason}），仍要搭建隧道吗？`,
    yes: "是",
    no: "否",
    proxy: {
      label: "本地代理",
      looking: "正在查找本地代理…",
      found: {
        clashVerge: "端口来自 Clash Verge 的设置",
        v2rayN: "端口来自 v2rayN 的设置",
        systemProxy: "端口来自 Windows 系统代理",
        clashVergeDefault: "Clash Verge 的默认端口",
        v2rayNDefault: "v2rayN 的默认端口",
        custom: "自定义端口",
      },
      listening: "，代理正在监听。",
      notListening: "，但现在没有程序在监听这个端口：请打开代理软件。",
    },
  },
};

export const en: SettingsPluginsText = {
  allowThirdParty: "Allow third-party plugins",
  warning: "Plugins are programs that run on your computer with the same rights as you: they can read and write files, use the network, and read passwords and codes saved on this computer (including the mail codes the island saves). The permissions below only limit which data they can use through the island. Only install plugins you trust.",
  folder: "Plugins folder",
  brokenState: (backup) => `The plugin settings file could not be read, so plugins started over with the defaults: third-party plugins, permissions, settings and trusted publishers need setting up again. The original file is kept at ${backup}.`,
  openFolder: "Open",
  reload: "Reload",
  secretsPermissionMac: "Keep passwords and tokens in the keychain",
  feedback: {
    checking: "Checking…",
    upToDate: "Up to date (just checked)",
    found: (count) => `${count} update${count === 1 ? "" : "s"} found`,
    reloaded: (count) => `Reloaded, ${count} plugin${count === 1 ? "" : "s"}`,
    folderOpened: "Opened in File Explorer",
    folderOpenedMac: "Opened in Finder",
    dataCleared: "Data cleared",
    saved: "Saved",
    commandSent: "Sent to the plugin",
  },
  empty: "No plugins installed. Put a plugin folder in the plugins folder, then click Reload.",
  groupBuiltin: (count: number) => `Built in (${count})`,
  groupThirdParty: (count: number) => `Third-party (${count})`,
  overview: {
    search: "Search installed plugins",
    filter: { all: "All", running: "Running", updates: "Updates", attention: "Needs attention" },
    filterLabel: "Filter by state",
    noMatches: "No plugins match.",
    dockTitle: (count) => (count === 1 ? "1 plugin installed" : `${count} plugins installed`),
    dockRunning: (running) => (running > 0 ? `${running} running, all is well` : "No plugin is running right now"),
    dockAttention: (running, attention) => `${running} running, ${attention} need a look`,
    dockOpen: (name) => `Open ${name}'s settings`,
  },
  enable: "Enabled",
  by: (author: string) => `by ${author}`,
  homepage: "Homepage",
  permissions: "Permissions",
  noPermissions: "Uses no island data",
  optionalPermission: "optional, asked when needed",
  permissionCount: (count: number) => (count === 1 ? "1 permission" : `${count} permissions`),
  permission: {
    "island:notify": "Show notifications on the island",
    secrets: "Keep passwords and tokens in Windows Credential Manager",
    "clipboard:read": "Read text from the clipboard history (sensitive: asks on first use)",
    "messages:read": "Read QQ, WeChat and mail alerts: sender and preview, never mail bodies (sensitive)",
    "media:read": "See what is playing and in which player (sensitive)",
    "media:control": "Play, pause, next and previous track",
    "shelf:read": "Read the file shelf (paths only; sensitive)",
    "shelf:write": "Add to or remove from the file shelf; never deletes files (sensitive)",
    windows: "Open windows of its own outside the island (experimental, Windows only for now)",
  },
  needsApproval: "The new version asks for more permissions, so it is paused. Switch it off and on to allow them.",
  keybindingConflict: (shortcuts: string) => `Shortcut already in use by another app: ${shortcuts}`,
  sensitive: {
    prompt: (plugin: string, action: string) => `${plugin} wants to ${action}`,
    allow: "Allow",
    once: "Once",
    deny: "Deny",
    action: {
      "island:notify": "show notifications on the island",
      secrets: "keep its own secrets",
      "media:control": "control media playback",
      "clipboard:read": "read your clipboard history",
      "messages:read": "read your message alerts",
      "media:read": "see what is playing",
      "shelf:read": "read the file shelf",
      "shelf:write": "change the file shelf",
      windows: "open windows of its own",
      uri: "handle a fuyu:// link opened by a web page or another app",
    },
    title: "Permissions the island asks about",
    hint: "The island asks you the first time a plugin uses a sensitive permission, asks for an optional one, or receives a link. After you revoke an answer, it asks again.",
    allowed: "Allowed",
    denied: "Denied",
    revoke: "Revoke",
    none: "Not asked yet.",
  },
  notAllowed: "Turn on “Allow third-party plugins” above first.",
  describedOnly: "This plugin has nothing to run.",
  invalid: "Cannot load",
  log: "Log",
  noLog: "No log yet",
  calls: {
    title: "Calls",
    hint: "The island APIs the plugin called in its last 200 calls and how each ended, newest first. Only the API names are kept, not what was read or written; cleared when the island restarts.",
    none: "No calls yet",
    outcome: { ok: "ok", denied: "no permission", unknown: "no such API", error: "error" },
  },
  status: {
    stopped: "Not running",
    starting: "Starting",
    running: "Running",
    restarting: "Restarting",
    crashed: "Stopped after errors",
    idle: "Idle",
  },
  run: {
    onDemand: "Starts on demand: runs only when needed and stops after a minute with nothing to do.",
    memory: (megabytes: string) => `Memory ${megabytes} MB`,
    highCpu: "This plugin has used a lot of CPU for the last minute.",
    keepAlive: (reason: string) => `Keeps running: ${reason}`,
    onDemandShort: "On demand",
    keepAliveShort: "Keeps running",
  },
  dev: {
    title: "Developer",
    badge: "In development",
    mode: "Development mode",
    modeHint: "Load a plugin from any folder to debug it: it needs no “Allow third-party plugins”, gets the permissions it asks for (sensitive ones are still confirmed) and may use experimental APIs. Development mode is not saved; turn it on again after the island restarts (a development build turns it on by itself). Folders you loaded are remembered. The fuyu-plugin dev command also needs the Local API plugin on.",
    path: "Plugin folder",
    pathPlaceholder: "Full path of a folder with fuyu-plugin.json",
    load: "Load",
    pick: "Choose folder",
    reload: "Reload",
    reloaded: "Reloaded",
    unload: "Remove",
    noPlugins: "No plugins in development loaded yet.",
    recent: "Loaded before",
    recentRestores: "This is a development build: development mode turns on at startup and loads the plugins you did not remove last time and those listed in FUYU_DEV_PLUGINS.",
    loadAgain: "Load",
    forget: "Forget",
    trace: (id: string) => `JSON-RPC messages of ${id} (last 200 lines)`,
    traceEmpty: "No messages yet. They show up here once the plugin runs.",
    event: "Event",
    payload: "Event payload (JSON)",
    send: "Send event",
    badJson: "The payload is not valid JSON.",
  },
  uninstall: "Uninstall",
  confirmUninstall: "Confirm uninstall",
  builtin: "Built in",
  runtimeBuiltIn: "Nothing else to install",
  runtimeNode: "Needs Node.js",
  nodeMissing: "Node.js was not found on this computer; this plugin runs once it is installed.",
  getNode: "Get Node.js",
  powershellMissing: "This plugin is written in PowerShell, and PowerShell 7 (pwsh) was not found on this Mac; it runs once that is installed.",
  getPowershell: "Install PowerShell",
  notForMac: "This plugin is for Windows only and does not run on a Mac.",
  notForWindows: "This plugin is for macOS only and does not run on Windows.",
  webviewNotOnMac: "This plugin draws its page with its own web page, which is not supported on a Mac yet; the page shows a note instead. Its items on the collapsed bar still show.",
  needsNode: "Needs Node.js",
  needsPowershell: "Needs PowerShell 7",
  nodeMissingCount: (count: number) => `Node.js was not found on this computer; ${count === 1 ? "1 plugin runs" : `${count} plugins run`} once it is installed.`,
  powershellMissingCount: (count: number) => `PowerShell 7 (pwsh) was not found on this Mac; ${count === 1 ? "1 PowerShell plugin runs" : `${count} PowerShell plugins run`} once it is installed.`,
  describedOnlyShort: "Nothing to run",
  moreNotes: (count: number) => `${count} more`,
  detail: {
    open: "Settings",
    back: "Close",
    info: "Info",
    infoWhenRunning: "Once the plugin runs, what it shares appears here.",
    settings: "Settings",
    noSettings: "This plugin has no settings.",
    actions: "Actions",
    copy: "Copy",
    copied: "Copied",
    notifications: "Notifications",
    showNotifications: "Show this plugin's notifications on the island",
    windows: "Windows",
    windowsNoTopmost: "Don't allow always on top",
    windowsNoClickThrough: "Don't allow clicks to pass through",
    windowsHidden: "Hide all of this plugin's windows",
    windowsHint: "Windows the plugin opens outside the island. These settings win over the plugin's own; while hidden, the plugin cannot open new windows.",
    memoryLimit: "Memory limit",
    memoryLimitOption: (megabytes: number) => (megabytes >= 1024 ? `${megabytes / 1024} GB` : `${megabytes} MB`) + (megabytes === 512 ? " (default)" : ""),
    memoryLimitHint: "When the plugin, with the programs it starts, uses more memory than this, the island stops it and says why. Like the memory on the plugin card, the fixed share PowerShell or Node.js takes by itself is not counted. Leave it unless the plugin's description asks for more.",
    data: "Data",
    dataHint: "Deletes what the plugin saved, including its secrets, and restarts it. Uninstalling keeps this data.",
    clearData: "Clear data",
    confirmClearData: "Confirm clear",
  },
  market: {
    title: "Plugin market",
    hint: "Plugins installed from here are checked first to make sure the files are complete and unchanged. They start off, and you choose what they may access when you turn one on.",
    refresh: "Refresh",
    loading: "Loading plugins…",
    empty: "No plugins in the market yet.",
    loadFailed: "Could not load the plugin list. Check your network or the Windows proxy settings, then click Refresh.",
    loadFailedMac: "Could not load the plugin list. Check your network or proxy settings, then click Refresh.",
    installFailed: (name: string) => `${name} was not installed. Your other plugins are unaffected.`,
    install: "Install",
    installing: "Installing…",
    update: (version: string) => `Update to v${version}`,
    installed: "Installed",
    incompatible: "Not compatible",
    search: "Search names, descriptions or publishers",
    summary: (installed: number, updates: number, favorites: number) =>
      [`${installed} installed`, updates > 0 ? `${updates} to update` : "", favorites > 0 ? `${favorites} starred` : ""].filter(Boolean).join(" · "),
    noMatches: "No plugins match.",
    allCategories: "All",
    spotlight: "Most liked",
    category: {
      productivity: "Productivity",
      developer: "Developer",
      media: "Media",
      messages: "Messages",
      information: "Information",
      utilities: "Utilities",
      sounds: "Sound packs",
    },
    official: "Official",
    publisher: (name: string) => `Published by ${name}`,
    trustAndInstall: "Trust and install",
    confirmTrust: "Confirm and install",
    signed: "Signed by author",
    keyChanged: (keyId: string) => `This version is signed with a different key (${keyId}) than the installed one. The author may have changed keys, or the plugin's repository may have been taken over. Update only if you are sure the author published it.`,
    signatureDropped: "This version has no author signature, but the installed one had. The author may have stopped signing, or the plugin's repository may have been taken over. Update only if you are sure the author published it.",
    updateAnyway: "Update anyway",
    confirmKeyChange: "Confirm update",
    cancel: "Cancel",
    trustHint: (publisher: string) => `This is the first plugin from ${publisher}. Trust the publisher to install it. Plugins run as you and can reach your files and saved passwords, so only trust publishers you know. Its plugins can then be installed and updated automatically. You can undo this under Plugins > Updates.`,
    revoked: "Taken down",
    repository: "Source code",
    reportIssue: "Report a problem",
    readme: "About this plugin",
    changelog: "Version history",
    customUi: "Custom UI",
    customUiNotOnMac: "Custom UI · not on Mac yet",
    status: (count: number, time: string) => `${count} ${count === 1 ? "plugin" : "plugins"} · index updated ${time}`,
    statusCount: (count: number) => `${count} ${count === 1 ? "plugin" : "plugins"}`,
    refreshing: "Refreshing the plugin list…",
    groupInstallable: (count: number) => `Available (${count})`,
    groupInstalled: (count: number) => `Installed (${count})`,
    groupUpdates: (count: number) => `Updates (${count})`,
    favorites: (count: number) => (count > 0 ? `Starred ${count}` : "Starred"),
    noFavorites: "No starred plugins yet. Use the star on a card; stars are kept on this computer only.",
    request: {
      title: (name) => `The website asks you to install “${name}”`,
      titleUnknown: "The website asks you to install a plugin",
      hint: "If you clicked it yourself, press Install below. Nothing is installed unless you do.",
      loading: "Reading the plugin market…",
      missing: (id) => `${id} is not in the plugin market. It may have been taken down, or the link is wrong.`,
      failed: "The plugin market could not be read. Check the connection and press refresh above.",
      dismiss: "Don't install",
    },
    favorite: (name: string) => `Star ${name}`,
    unfavorite: (name: string) => `Unstar ${name}`,
    like: (name: string, count: number) => `${name}: ${count} ${count === 1 ? "like" : "likes"}, like it on GitHub`,
    sortLabel: "Sort",
    sortIndex: "Default order",
    sortLikes: "Most liked",
    manage: "Manage",
    verified: "Verified",
    noPermissions: "No permissions",
    runtime: { node: "Node.js", powershell: "PowerShell", exe: "Program" },
  },
  updates: {
    title: "Updates",
    autoUpdate: "Update plugins automatically",
    autoUpdateHint: "The island checks the plugin market every 6 hours in the background (only while third-party plugins are allowed). When this is on, updates signed by their author (with an unchanged key) from trusted publishers that need no new permissions install by themselves; other updates are only offered.",
    check: "Check now",
    trusted: "Trusted publishers",
    noTrusted: "No other publishers trusted yet (official plugins always are).",
    untrust: "Stop trusting",
    available: (version: string) => `Version ${version} is available in the plugin market.`,
    keyChanged: (version: string) => `${version} is signed with a different key than the installed version, so it does not update by itself; confirm it in the plugin market.`,
    autoUpdated: (version: string) => `Updated to ${version} automatically.`,
    autoUpdateFailed: (reason: string) => `The automatic update failed; the next check will try again: ${reason}`,
    revoked: (reason: string) => `This version was taken off the plugin market and is switched off: ${reason}`,
    preReleaseTitle: "Pre-releases",
    preRelease: "Get pre-releases of this plugin",
    preReleaseHint: "Pre-releases are new versions the author is still testing and may be unstable. Turning this off does not roll back; the plugin updates again once a release is newer than what is installed.",
    preReleaseAvailable: (version: string) => `Pre-release ${version} is in the plugin market. `,
    preReleaseOffered: (version: string) => `Pre-release ${version} is available; you can opt in from the plugin's settings.`,
    autoUpdatedShort: (version: string) => `Updated to ${version}`,
    preReleaseShort: (version: string) => `Pre-release ${version}`,
  },
  sshTunnel: {
    title: "Hosts",
    hint: "Hosts come from ~/.ssh/config. Give each a port on the server (1024–65535, not one another tunnel uses); once it is on, run the export line below on the server to use the proxy here.",
    empty: "No hosts: add a Host to ~/.ssh/config.",
    port: "Server port",
    portInvalid: "The port must be a whole number from 1024 to 65535",
    needsPort: "Set the server port first",
    checking: "Checking the port on the server…",
    state: {
      off: "Off",
      connecting: "Connecting…",
      connected: "Connected",
      portInUse: "Port in use, waiting",
      error: "Failed, retrying soon",
    },
    waitingForPlugin: "Connects once the plugin is on",
    confirm: (host: string, port: number) => `Port ${port} on ${host} is already in use (maybe by another tunnel). Set up the tunnel anyway?`,
    unchecked: (host: string, port: number, reason: string) =>
      `Could not check whether port ${port} on ${host} is in use (${reason}). Set up the tunnel anyway?`,
    yes: "Yes",
    no: "No",
    proxy: {
      label: "Local proxy",
      looking: "Looking for the local proxy…",
      found: {
        clashVerge: "Port from Clash Verge's settings",
        v2rayN: "Port from v2rayN's settings",
        systemProxy: "Port from the Windows system proxy",
        clashVergeDefault: "Clash Verge's default port",
        v2rayNDefault: "v2rayN's default port",
        custom: "Custom port",
      },
      listening: "; the proxy is listening.",
      notListening: ", but nothing listens on it now: start the proxy app.",
    },
  },
};
