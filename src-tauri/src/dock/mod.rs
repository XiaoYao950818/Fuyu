mod screen_watch;
mod screens;
mod service;
mod taskbar;
mod tray;
mod window;

use serde::Serialize;
use tauri::AppHandle;

use crate::user_error::UserError;

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct DockApp {
    pub window_handle: u64,
    pub title: String,
    pub exe_path: Option<String>,
    pub icon: Option<String>,
    pub minimized: bool,
    pub active: bool,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct DockAppList {
    pub available: bool,
    pub apps: Vec<DockApp>,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct TrayIcon {
    pub id: String,
    pub name: String,
    pub exe_path: Option<String>,
    pub icon: Option<String>,
    pub overflow: bool,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct TrayIconList {
    pub available: bool,
    pub overflow_available: bool,
    pub icons: Vec<TrayIcon>,
}

pub(crate) fn unavailable() -> DockAppList {
    DockAppList {
        available: false,
        apps: Vec::new(),
    }
}

#[tauri::command]
pub async fn get_dock_apps() -> Result<DockAppList, UserError> {
    tauri::async_runtime::spawn_blocking(service::list_apps)
        .await
        .map_err(|_| UserError::new("dock.read", "Failed to read the running apps"))
}

#[tauri::command]
pub async fn activate_dock_app(window_handle: u64) -> Result<bool, UserError> {
    tauri::async_runtime::spawn_blocking(move || service::activate(window_handle))
        .await
        .map_err(|_| UserError::new("dock.activate", "Failed to switch to the app"))
}

#[tauri::command]
pub async fn get_tray_icons() -> Result<TrayIconList, UserError> {
    tauri::async_runtime::spawn_blocking(|| {
        let apps = service::list_apps().apps;
        tray::list_icons(&apps)
    })
    .await
    .map_err(|_| UserError::new("dock.read", "Failed to read the tray icons"))
}

#[tauri::command]
pub async fn click_tray_icon(icon_id: String, button: String) -> Result<bool, UserError> {
    let right = match button.as_str() {
        "left" => false,
        "right" => true,
        _ => return Err(UserError::new("dock.tray", "Unknown tray click button")),
    };
    tauri::async_runtime::spawn_blocking(move || tray::click(&icon_id, right))
        .await
        .map_err(|_| UserError::new("dock.tray", "Failed to click the tray icon"))
}

#[tauri::command]
pub async fn set_dock_enabled(
    app: AppHandle,
    enabled: bool,
    screen: String,
) -> Result<(), UserError> {
    if let Some(mode) = screens::DockScreen::from_value(&screen) {
        screens::set_screen(mode);
    }
    if enabled {
        taskbar::set_enabled(true);
        window::show(&app);
    } else {
        taskbar::set_enabled(false);
        window::hide(&app);
    }
    Ok(())
}

macro_rules! tauri_commands {
    ($next:ident [$($done:tt)*] $($rest:tt)*) => {
        $next!([$($done)*
            crate::dock::get_dock_apps,
            crate::dock::activate_dock_app,
            crate::dock::get_tray_icons,
            crate::dock::click_tray_icon,
            crate::dock::set_dock_enabled,
        ] $($rest)*)
    };
}
pub(crate) use tauri_commands;
