import type { SettingsFileShelfText } from "./fileShelf";
import type { SettingsScreenshotText } from "./screenshot";
import type { SettingsModulesText } from "./modules";
import type { SettingsOverviewText } from "./overview";
import type { SettingsMessageSourcesText } from "./messageSources";
import type { SettingsCollapsedItemsText } from "./collapsedItems";
import type { SettingsThemeMarketText } from "./themeMarket";
import type { SettingsResetAppearanceText } from "./resetAppearance";
import type { SettingsWindowControlsText } from "./windowControls";
import type { SettingsDevBuildText } from "./devBuild";
import type { SettingsLocalApiText } from "./localApi";
import type { SettingsPluginsV3Text } from "./pluginsV3";
import type { SettingsCategoriesText } from "./categories";
import type { SettingsBehaviorText } from "./behavior";
import type { SettingsPositionText } from "./position";
import type { SettingsExpandText } from "./expand";
import type { SettingsGameModeText } from "./gameMode";
import type { SettingsDeviceUseText } from "./deviceUse";
import type { SettingsLevelPopupText } from "./levelPopup";
import type { SettingsDeviceAlertsText } from "./deviceAlerts";
import type { SettingsLyricsText } from "./lyrics";
import type { SettingsMusicBarText } from "./musicBar";
import type { SettingsBackupText } from "./backup";
import type { SettingsDataHomeText } from "./dataHome";
import type { SettingsPermissionsText } from "./permissions";
import type { SettingsShortcutsText } from "./shortcuts";
import type { SettingsPageShortcutsText } from "./pageShortcuts";
import type { SettingsProjectText } from "./project";
import type { SettingsLanguageText } from "./language";
import type { SettingsAppearanceText } from "./appearance";
import type { SettingsLayoutText } from "./layout";
import type { SettingsClipboardText } from "./clipboard";
import type { SettingsColorsText } from "./colors";
import type { SettingsPresetsText } from "./presets";
import type { SettingsPluginsText } from "./plugins";
import type { SettingsVersionHistoryText } from "./versionHistory";
import * as fileShelf from "./fileShelf.ts";
import * as screenshot from "./screenshot.ts";
import * as modules from "./modules.ts";
import * as overview from "./overview.ts";
import * as messageSources from "./messageSources.ts";
import * as collapsedItems from "./collapsedItems.ts";
import * as themeMarket from "./themeMarket.ts";
import * as resetAppearance from "./resetAppearance.ts";
import * as windowControls from "./windowControls.ts";
import * as devBuild from "./devBuild.ts";
import * as localApi from "./localApi.ts";
import * as pluginsV3 from "./pluginsV3.ts";
import * as categories from "./categories.ts";
import * as behavior from "./behavior.ts";
import * as position from "./position.ts";
import * as expand from "./expand.ts";
import * as gameMode from "./gameMode.ts";
import * as deviceUse from "./deviceUse.ts";
import * as levelPopup from "./levelPopup.ts";
import * as deviceAlerts from "./deviceAlerts.ts";
import * as lyrics from "./lyrics.ts";
import * as musicBar from "./musicBar.ts";
import * as backup from "./backup.ts";
import * as dataHome from "./dataHome.ts";
import * as permissions from "./permissions.ts";
import * as shortcuts from "./shortcuts.ts";
import * as pageShortcuts from "./pageShortcuts.ts";
import * as project from "./project.ts";
import * as language from "./language.ts";
import * as appearance from "./appearance.ts";
import * as layout from "./layout.ts";
import * as clipboard from "./clipboard.ts";
import * as colors from "./colors.ts";
import * as presets from "./presets.ts";
import * as plugins from "./plugins.ts";
import * as versionHistory from "./versionHistory.ts";

export type SettingsText = {
  fileShelf: SettingsFileShelfText;
  screenshot: SettingsScreenshotText;
  messageSources: SettingsMessageSourcesText;
  collapsedItems: SettingsCollapsedItemsText;
  themeMarket: SettingsThemeMarketText;

  modules: SettingsModulesText;
  overview: SettingsOverviewText;
  title: string;
  resetAppearance: SettingsResetAppearanceText;
  windowControls: SettingsWindowControlsText;
  devBuild: SettingsDevBuildText;
  pluginsV3: SettingsPluginsV3Text;

  categories: SettingsCategoriesText;

  behavior: SettingsBehaviorText;

  position: SettingsPositionText;

  expand: SettingsExpandText;

  gameMode: SettingsGameModeText;
  localApi: SettingsLocalApiText;
  deviceUse: SettingsDeviceUseText;
  levelPopup: SettingsLevelPopupText;
  deviceAlerts: SettingsDeviceAlertsText;
  lyrics: SettingsLyricsText;
  musicBar: SettingsMusicBarText;
  backup: SettingsBackupText;
  dataHome: SettingsDataHomeText;
  permissions: SettingsPermissionsText;

  shortcuts: SettingsShortcutsText;

  pageShortcuts: SettingsPageShortcutsText;

  project: SettingsProjectText;

  language: SettingsLanguageText;

  appearance: SettingsAppearanceText;

  layout: SettingsLayoutText;

  clipboard: SettingsClipboardText;

  colors: SettingsColorsText;

  presets: SettingsPresetsText;

  plugins: SettingsPluginsText;
  versionHistory: SettingsVersionHistoryText;
};

export const zhCN: SettingsText = {
  fileShelf: fileShelf.zhCN,
  screenshot: screenshot.zhCN,
  messageSources: messageSources.zhCN,
  collapsedItems: collapsedItems.zhCN,
  themeMarket: themeMarket.zhCN,

  modules: modules.zhCN,
  overview: overview.zhCN,
  title: "设置",
  resetAppearance: resetAppearance.zhCN,
  windowControls: windowControls.zhCN,
  devBuild: devBuild.zhCN,
  pluginsV3: pluginsV3.zhCN,

  categories: categories.zhCN,

  behavior: behavior.zhCN,

  position: position.zhCN,

  expand: expand.zhCN,

  gameMode: gameMode.zhCN,
  localApi: localApi.zhCN,
  deviceUse: deviceUse.zhCN,
  levelPopup: levelPopup.zhCN,
  deviceAlerts: deviceAlerts.zhCN,
  lyrics: lyrics.zhCN,
  musicBar: musicBar.zhCN,
  backup: backup.zhCN,
  dataHome: dataHome.zhCN,
  permissions: permissions.zhCN,

  shortcuts: shortcuts.zhCN,

  pageShortcuts: pageShortcuts.zhCN,

  project: project.zhCN,

  language: language.zhCN,

  appearance: appearance.zhCN,

  layout: layout.zhCN,

  clipboard: clipboard.zhCN,

  colors: colors.zhCN,

  presets: presets.zhCN,

  plugins: plugins.zhCN,
  versionHistory: versionHistory.zhCN,
};

export const en: SettingsText = {
  fileShelf: fileShelf.en,
  screenshot: screenshot.en,
  messageSources: messageSources.en,
  collapsedItems: collapsedItems.en,
  themeMarket: themeMarket.en,

  modules: modules.en,
  overview: overview.en,
  title: "Settings",
  resetAppearance: resetAppearance.en,
  windowControls: windowControls.en,
  devBuild: devBuild.en,
  pluginsV3: pluginsV3.en,

  categories: categories.en,

  behavior: behavior.en,

  position: position.en,

  expand: expand.en,

  gameMode: gameMode.en,
  localApi: localApi.en,
  deviceUse: deviceUse.en,
  levelPopup: levelPopup.en,
  deviceAlerts: deviceAlerts.en,
  lyrics: lyrics.en,
  musicBar: musicBar.en,
  backup: backup.en,
  dataHome: dataHome.en,
  permissions: permissions.en,

  shortcuts: shortcuts.en,

  pageShortcuts: pageShortcuts.en,

  project: project.en,

  language: language.en,

  appearance: appearance.en,

  layout: layout.en,

  clipboard: clipboard.en,

  colors: colors.en,

  presets: presets.en,

  plugins: plugins.en,
  versionHistory: versionHistory.en,
};
