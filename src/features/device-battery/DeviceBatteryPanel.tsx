import { useCallback, useEffect, useState } from "react";
import { Battery, BatteryCharging, BatteryFull, BatteryLow, BatteryMedium, Mouse, RefreshCw } from "lucide-react";
import { useTranslation } from "../../i18n";
import { getDeviceBatteries } from "./api";
import { batteryIconKind, batteryPercentText, levelKey, normalizeDeviceBatteries, stateKey } from "./battery";
import { useDeviceBatterySettings } from "./useDeviceBatterySettings";
import type { DeviceBattery } from "./types";
import "../../components/list/IslandList.css";
import "./DeviceBattery.css";

const POLL_MS = 60_000;

const BATTERY_ICONS = {
  unknown: Battery,
  charging: BatteryCharging,
  full: BatteryFull,
  medium: BatteryMedium,
  low: BatteryLow,
} as const;

export function DeviceBatteryPanel({ isOpen }: { isOpen: boolean }) {
  const t = useTranslation().deviceBattery;
  const [settings] = useDeviceBatterySettings();
  const [batteries, setBatteries] = useState<DeviceBattery[]>([]);

  const refresh = useCallback(() => {
    getDeviceBatteries().then((value) => setBatteries(normalizeDeviceBatteries(value))).catch(() => setBatteries([]));
  }, []);

  useEffect(() => {
    if (!isOpen || !settings.enabled) return;
    refresh();
    const id = window.setInterval(refresh, POLL_MS);
    return () => window.clearInterval(id);
  }, [isOpen, settings.enabled, refresh]);

  return (
    <section className="island-list-page device-battery-panel" aria-label={t.title}>
      <div className="device-battery-panel__header">
        <span className="device-battery-panel__title">{t.title}</span>
        <button className="device-battery-panel__button" type="button" aria-label={t.refresh} title={t.refresh} onClick={refresh} disabled={!settings.enabled}>
          <RefreshCw size={14} strokeWidth={2.2} aria-hidden="true" />
        </button>
      </div>
      {!settings.enabled ? (
        <p className="device-battery-panel__empty">{t.disabled}</p>
      ) : (
        <ul className="device-battery-panel__list">
          {batteries.map((battery) => <BatteryRow key={battery.id} battery={battery} />)}
        </ul>
      )}
    </section>
  );
}

function BatteryRow({ battery }: { battery: DeviceBattery }) {
  const t = useTranslation().deviceBattery;
  const Icon = BATTERY_ICONS[batteryIconKind(battery)];
  const level = levelKey(battery.level);
  const state = stateKey(battery.state);
  const percent = batteryPercentText(battery);
  return (
    <li className="device-battery-panel__row">
      <Mouse className="device-battery-panel__mouse" size={15} strokeWidth={2} aria-hidden="true" />
      <span className="device-battery-panel__label">{battery.name}</span>
      <Icon className="device-battery-panel__icon" size={18} strokeWidth={2} aria-hidden="true" />
      {percent !== null ? (
        <>
          <span className="device-battery-panel__percent">{percent}</span>
          <span className="device-battery-panel__detail">
            {[level ? t.level[level] : null, state ? t.state[state] : null].filter((part) => part !== null).join(" · ")}
          </span>
        </>
      ) : (
        <span className="device-battery-panel__unavailable">{t.unavailable}</span>
      )}
    </li>
  );
}
