export type AudioSession = {
  id: string;
  name: string;
  processId: number;
  volume: number;
  muted: boolean;
  icon: string | null;
};

export type VolumeState = {
  available: boolean;
  level: number;
  muted: boolean;
  outputName: string | null;
  sessions: AudioSession[];
};

export type VolumeSettings = {
  enabled: boolean;
};
