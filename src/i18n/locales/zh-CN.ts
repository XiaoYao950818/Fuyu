import type { Translations } from "../types";
import * as common from "../sections/common.ts";
import * as messages from "../sections/messages.ts";
import * as qq from "../sections/qq.ts";
import * as wechat from "../sections/wechat.ts";
import * as mail from "../sections/mail.ts";
import * as island from "../sections/island.ts";
import * as music from "../sections/music.ts";
import * as clipboard from "../sections/clipboard.ts";
import * as clipboardList from "../sections/clipboardList.ts";
import * as clipboardPrivacy from "../sections/clipboardPrivacy.ts";
import * as fileShelf from "../sections/fileShelf.ts";
import * as screenshot from "../sections/screenshot.ts";
import * as timer from "../sections/timer.ts";
import * as deviceBattery from "../sections/deviceBattery.ts";
import * as quickLaunch from "../sections/quickLaunch.ts";
import * as quickCommands from "../sections/quickCommands.ts";
import * as fileSearch from "../sections/fileSearch.ts";
import * as netSpeed from "../sections/netSpeed.ts";
import * as volume from "../sections/volume.ts";
import * as dock from "../sections/dock.ts";
import * as musicIsland from "../sections/musicIsland.ts";
import * as pluginViews from "../sections/pluginViews.ts";
import * as settings from "../sections/settings/index.ts";
import * as onboarding from "../sections/onboarding.ts";
import * as errors from "../sections/errors.ts";
import * as trayMenu from "../sections/trayMenu.ts";

const zhCN: Translations = {
  localeLabel: "简体中文",
  localeTag: "zh-CN",

  common: common.zhCN,
  messages: messages.zhCN,
  qq: qq.zhCN,
  wechat: wechat.zhCN,
  mail: mail.zhCN,

  island: island.zhCN,

  music: music.zhCN,

  clipboard: clipboard.zhCN,
  clipboardList: clipboardList.zhCN,
  clipboardPrivacy: clipboardPrivacy.zhCN,

  fileShelf: fileShelf.zhCN,
  screenshot: screenshot.zhCN,
  timer: timer.zhCN,
  deviceBattery: deviceBattery.zhCN,
  quickLaunch: quickLaunch.zhCN,
  quickCommands: quickCommands.zhCN,
  fileSearch: fileSearch.zhCN,
  netSpeed: netSpeed.zhCN,
  volume: volume.zhCN,
  dock: dock.zhCN,
  musicIsland: musicIsland.zhCN,

  pluginViews: pluginViews.zhCN,
  settings: settings.zhCN,
  onboarding: onboarding.zhCN,
  errors: errors.zhCN,
  trayMenu: trayMenu.zhCN,
};

export default zhCN;
