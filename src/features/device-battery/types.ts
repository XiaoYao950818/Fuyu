export type DeviceBattery = {
  id: string;
  name: string;
  available: boolean;
  percent: number | null;
  level: number | null;
  state: number | null;
};

export type DeviceBatterySettings = {
  enabled: boolean;
};
