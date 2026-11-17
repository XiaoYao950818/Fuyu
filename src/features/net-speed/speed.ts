import { formatBytes } from "../../utils/bytes.ts";

export function formatRate(bytesPerSec: number): string {
  return `${formatBytes(bytesPerSec)}/s`;
}
