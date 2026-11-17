export type NetSpeed = {
  available: boolean;
  name: string | null;
  downBytesPerSec: number;
  upBytesPerSec: number;
  totalReceivedBytes: number;
  totalSentBytes: number;
};

export type NetSpeedSettings = {
  enabled: boolean;
};
