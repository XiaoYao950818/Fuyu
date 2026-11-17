export type NetSpeedText = {
  title: string;
  openDetails: string;
  refresh: string;
  loading: string;
  unavailable: string;
  disabled: string;
  failed: string;
  down: string;
  up: string;
  totalReceived: string;
  totalSent: string;
  adapter: string;
  unknownAdapter: string;
  settings: NetSpeedSettingsText;
};

export type NetSpeedSettingsText = {
  title: string;
  enable: string;
  enableHint: string;
};

export const zhCN: NetSpeedText = {
  title: "网速",
  openDetails: "打开网速详情",
  refresh: "刷新网速",
  loading: "正在读取网速…",
  unavailable: "无网络",
  disabled: "网速显示已关闭，在设置里打开后可查看上下行速度。",
  failed: "读取网速失败。",
  down: "下载",
  up: "上传",
  totalReceived: "累计下载",
  totalSent: "累计上传",
  adapter: "网卡",
  unknownAdapter: "未知网卡",
  settings: {
    title: "网速",
    enable: "显示网速",
    enableHint: "在收起的岛上常驻显示上下行速度，点开查看详情。",
  },
};

export const en: NetSpeedText = {
  title: "Network speed",
  openDetails: "Open network speed details",
  refresh: "Refresh network speed",
  loading: "Reading network speed…",
  unavailable: "No network",
  disabled: "Network speed is off. Turn it on in Settings to see download and upload speeds.",
  failed: "Could not read the network speed.",
  down: "Download",
  up: "Upload",
  totalReceived: "Total downloaded",
  totalSent: "Total uploaded",
  adapter: "Adapter",
  unknownAdapter: "Unknown adapter",
  settings: {
    title: "Network speed",
    enable: "Show network speed",
    enableHint: "Shows download and upload speeds on the collapsed island. Click it for details.",
  },
};
