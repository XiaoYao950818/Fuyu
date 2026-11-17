import type { CommonText } from "./sections/common";
import type { MessagesText } from "./sections/messages";
import type { QqText } from "./sections/qq";
import type { WechatText } from "./sections/wechat";
import type { MailText } from "./sections/mail";
import type { IslandText } from "./sections/island";
import type { MusicText } from "./sections/music";
import type { ClipboardText } from "./sections/clipboard";
import type { ClipboardListText } from "./sections/clipboardList";
import type { ClipboardPrivacyText } from "./sections/clipboardPrivacy";
import type { FileShelfText } from "./sections/fileShelf";
import type { ScreenshotText } from "./sections/screenshot";
import type { TimerText } from "./sections/timer";
import type { DeviceBatteryText } from "./sections/deviceBattery";
import type { QuickLaunchText } from "./sections/quickLaunch";
import type { QuickCommandsText } from "./sections/quickCommands";
import type { FileSearchText } from "./sections/fileSearch";
import type { NetSpeedText } from "./sections/netSpeed";
import type { VolumeText } from "./sections/volume";
import type { DockText } from "./sections/dock";
import type { MusicIslandText } from "./sections/musicIsland";
import type { PluginViewsText } from "./sections/pluginViews";
import type { SettingsText } from "./sections/settings/index";
import type { OnboardingText } from "./sections/onboarding";
import type { ErrorsText } from "./sections/errors";
import type { TrayMenuText } from "./sections/trayMenu";

export type LocaleCode = "zh-CN" | "en";

export type Translations = {
  localeLabel: string;
  localeTag: string;

  common: CommonText;
  messages: MessagesText;
  qq: QqText;
  wechat: WechatText;
  mail: MailText;

  island: IslandText;

  music: MusicText;

  clipboard: ClipboardText;
  clipboardList: ClipboardListText;
  clipboardPrivacy: ClipboardPrivacyText;

  fileShelf: FileShelfText;

  screenshot: ScreenshotText;
  timer: TimerText;
  deviceBattery: DeviceBatteryText;
  quickLaunch: QuickLaunchText;
  quickCommands: QuickCommandsText;
  fileSearch: FileSearchText;
  netSpeed: NetSpeedText;
  volume: VolumeText;
  dock: DockText;
  musicIsland: MusicIslandText;

  pluginViews: PluginViewsText;
  settings: SettingsText;
  onboarding: OnboardingText;
  errors: ErrorsText;
  trayMenu: TrayMenuText;
};
