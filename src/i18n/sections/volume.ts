export type VolumeText = {
  title: string;
  openDetails: string;
  refresh: string;
  loading: string;
  unavailable: string;
  disabled: string;
  failed: string;
  master: string;
  mute: string;
  unmute: string;
  output: string;
  unknownOutput: string;
  sessions: string;
  emptySessions: string;
  systemSounds: string;
  unknownApp: string;
  muted: string;
  muteApp: (name: string) => string;
  unmuteApp: (name: string) => string;
  settings: VolumeSettingsText;
};

export type VolumeSettingsText = {
  title: string;
  enable: string;
  enableHint: string;
};

export const zhCN: VolumeText = {
  title: "音量",
  openDetails: "打开音量详情",
  refresh: "刷新音量",
  loading: "正在读取音量…",
  unavailable: "没有音频输出设备。",
  disabled: "音量显示已关闭，在设置里打开后可查看主音量和各应用音量。",
  failed: "读取音量失败。",
  master: "主音量",
  mute: "静音",
  unmute: "取消静音",
  output: "输出设备",
  unknownOutput: "未知设备",
  sessions: "应用音量",
  emptySessions: "现在没有正在播放声音的应用。",
  systemSounds: "系统声音",
  unknownApp: "未知应用",
  muted: "已静音",
  muteApp: (name) => `将「${name}」静音`,
  unmuteApp: (name) => `取消「${name}」的静音`,
  settings: {
    title: "音量",
    enable: "显示音量",
    enableHint: "在收起的岛上常驻显示当前音量，点开可调主音量和各应用音量。",
  },
};

export const en: VolumeText = {
  title: "Volume",
  openDetails: "Open volume details",
  refresh: "Refresh volume",
  loading: "Reading volume…",
  unavailable: "No audio output device.",
  disabled: "Volume display is off. Turn it on in Settings to see the master volume and per-app volumes.",
  failed: "Could not read the volume.",
  master: "Master volume",
  mute: "Mute",
  unmute: "Unmute",
  output: "Output device",
  unknownOutput: "Unknown device",
  sessions: "App volume",
  emptySessions: "No app is playing sound right now.",
  systemSounds: "System sounds",
  unknownApp: "Unknown app",
  muted: "Muted",
  muteApp: (name) => `Mute ${name}`,
  unmuteApp: (name) => `Unmute ${name}`,
  settings: {
    title: "Volume",
    enable: "Show volume",
    enableHint: "Shows the current volume on the collapsed island. Click it to adjust the master volume and per-app volumes.",
  },
};
