export type DeviceBatteryText = {
  title: string;
  refresh: string;
  unavailable: string;
  disabled: string;
  level: Record<"full" | "good" | "low" | "critical", string>;
  state: Record<"discharging" | "charging" | "almostFull" | "full", string>;
  settings: DeviceBatterySettingsText;
};

export type DeviceBatterySettingsText = {
  title: string;
  enable: string;
  enableHint: string;
};

export const zhCN: DeviceBatteryText = {
  title: "设备电量",
  refresh: "刷新电量",
  unavailable: "未连接",
  disabled: "电量显示已关闭，在设置里打开后可查看两只鼠标的电量。",
  level: { full: "满", good: "良好", low: "低", critical: "危急" },
  state: { discharging: "放电中", charging: "充电中", almostFull: "将满", full: "已满" },
  settings: {
    title: "设备电量",
    enable: "显示鼠标电量",
    enableHint: "在岛上显示罗技 PRO X SUPERLIGHT 2c 和 MX Master 4 的电量。",
  },
};

export const en: DeviceBatteryText = {
  title: "Device battery",
  refresh: "Refresh battery",
  unavailable: "Not connected",
  disabled: "Battery display is off. Turn it on in Settings to see both mice.",
  level: { full: "Full", good: "Good", low: "Low", critical: "Critical" },
  state: { discharging: "Discharging", charging: "Charging", almostFull: "Almost full", full: "Full" },
  settings: {
    title: "Device battery",
    enable: "Show mouse battery",
    enableHint: "Shows the battery of the Logitech PRO X SUPERLIGHT 2c and MX Master 4 on the island.",
  },
};
