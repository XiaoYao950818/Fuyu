use serde::Serialize;

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

#[tauri::command]
pub async fn get_dock_apps() -> Result<DockAppList, UserError> {
    Ok(DockAppList {
        available: false,
        apps: Vec::new(),
    })
}

#[tauri::command]
pub async fn activate_dock_app(_window_handle: u64) -> Result<bool, UserError> {
    Ok(false)
}

#[tauri::command]
pub async fn get_tray_icons() -> Result<TrayIconList, UserError> {
    Ok(TrayIconList {
        available: false,
        overflow_available: false,
        icons: Vec::new(),
    })
}

#[tauri::command]
pub async fn click_tray_icon(_icon_id: String, _button: String) -> Result<bool, UserError> {
    Ok(false)
}

#[tauri::command]
pub async fn set_dock_enabled(
    _app: tauri::AppHandle,
    _enabled: bool,
    _screen: String,
) -> Result<(), UserError> {
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
