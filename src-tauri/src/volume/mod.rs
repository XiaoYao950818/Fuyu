mod service;

use serde::Serialize;

use crate::user_error::UserError;

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct AudioSession {
    pub id: String,
    pub name: String,
    pub process_id: u32,
    pub volume: f32,
    pub muted: bool,
    pub icon: Option<String>,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct VolumeState {
    pub available: bool,
    pub level: f32,
    pub muted: bool,
    pub output_name: Option<String>,
    pub sessions: Vec<AudioSession>,
}

pub(crate) fn unavailable() -> VolumeState {
    VolumeState {
        available: false,
        level: 0.0,
        muted: false,
        output_name: None,
        sessions: Vec::new(),
    }
}

#[tauri::command]
pub async fn get_volume_state() -> Result<VolumeState, UserError> {
    tauri::async_runtime::spawn_blocking(service::read_state)
        .await
        .map_err(|_| UserError::new("volume.read", "Failed to read the system volume"))?
}

#[tauri::command]
pub async fn set_master_volume_level(level: f32) -> Result<VolumeState, UserError> {
    tauri::async_runtime::spawn_blocking(move || service::set_master_level(level))
        .await
        .map_err(|_| UserError::new("volume.set", "Failed to change the system volume"))?
}

#[tauri::command]
pub async fn set_master_muted(muted: bool) -> Result<VolumeState, UserError> {
    tauri::async_runtime::spawn_blocking(move || service::set_master_mute(muted))
        .await
        .map_err(|_| UserError::new("volume.set", "Failed to change the system volume"))?
}

#[tauri::command]
pub async fn set_session_volume(process_id: u32, level: f32) -> Result<(), UserError> {
    tauri::async_runtime::spawn_blocking(move || service::set_app_level(process_id, level))
        .await
        .map_err(|_| UserError::new("volume.set", "Failed to change the app volume"))?
}

#[tauri::command]
pub async fn set_session_muted(process_id: u32, muted: bool) -> Result<(), UserError> {
    tauri::async_runtime::spawn_blocking(move || service::set_app_mute(process_id, muted))
        .await
        .map_err(|_| UserError::new("volume.set", "Failed to change the app volume"))?
}

macro_rules! tauri_commands {
    ($next:ident [$($done:tt)*] $($rest:tt)*) => {
        $next!([$($done)*
            crate::volume::get_volume_state,
            crate::volume::set_master_volume_level,
            crate::volume::set_master_muted,
            crate::volume::set_session_volume,
            crate::volume::set_session_muted,
        ] $($rest)*)
    };
}
pub(crate) use tauri_commands;
