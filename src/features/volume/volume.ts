import type { AudioSession, VolumeState } from "./types";

export function clampVolume(value: number): number {
  if (!Number.isFinite(value)) return 0;
  if (value < 0) return 0;
  if (value > 1) return 1;
  return value;
}

export function volumeToPercent(volume: number): number {
  return Math.round(clampVolume(volume) * 100);
}

export function percentToVolume(percent: number): number {
  if (!Number.isFinite(percent)) return 0;
  return clampVolume(percent / 100);
}

export function normalizeVolumeSession(value: unknown): AudioSession | null {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return null;
  const session = value as Partial<AudioSession>;
  if (typeof session.id !== "string" || session.id === "") return null;
  if (typeof session.processId !== "number" || !Number.isInteger(session.processId) || session.processId < 0) return null;
  return {
    id: session.id,
    name: typeof session.name === "string" ? session.name : "",
    processId: session.processId,
    volume: clampVolume(typeof session.volume === "number" ? session.volume : Number.NaN),
    muted: session.muted === true,
    icon: typeof session.icon === "string" && session.icon !== "" ? session.icon : null,
  };
}

export function normalizeVolumeSessions(value: unknown): AudioSession[] {
  if (!Array.isArray(value)) return [];
  const seen = new Set<string>();
  const sessions: AudioSession[] = [];
  for (const entry of value) {
    const session = normalizeVolumeSession(entry);
    if (session === null || seen.has(session.id)) continue;
    seen.add(session.id);
    sessions.push(session);
  }
  return sessions;
}

export function normalizeVolumeState(value: unknown): VolumeState | null {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return null;
  const state = value as Partial<VolumeState>;
  return {
    available: state.available === true,
    level: clampVolume(typeof state.level === "number" ? state.level : Number.NaN),
    muted: state.muted === true,
    outputName: typeof state.outputName === "string" && state.outputName !== "" ? state.outputName : null,
    sessions: normalizeVolumeSessions(state.sessions),
  };
}

export function sortVolumeSessions(sessions: AudioSession[]): AudioSession[] {
  return [...sessions].sort((left, right) => {
    const leftName = left.name.trim();
    const rightName = right.name.trim();
    if (leftName === "" && rightName !== "") return 1;
    if (leftName !== "" && rightName === "") return -1;
    const byName = leftName.localeCompare(rightName);
    if (byName !== 0) return byName;
    return left.processId - right.processId;
  });
}

export function sessionDisplayName(session: AudioSession, systemSounds: string, unknownApp: string): string {
  const name = session.name.trim();
  if (name !== "") return name;
  if (session.processId === 0) return systemSounds;
  return unknownApp;
}
